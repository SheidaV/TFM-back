import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProposalDto } from '../proposals/dto/proposal.dto.js';
import { ProposalsService } from '../proposals/proposals.service.js';
import { TripDto } from '../trips/dto/trip.dto.js';
import { TripsService } from '../trips/trips.service.js';
import { CreateItineraryItemDto } from './dto/create-itinerary-item.dto.js';
import {
  ItineraryDayDto,
  ItineraryDto,
  ItineraryProposalDto,
} from './dto/itinerary.dto.js';
import { UpdateItineraryItemDto } from './dto/update-itinerary-item.dto.js';
import { ItineraryDay } from './entities/itinerary-day.entity.js';
import { checkSlot, Slot } from './itinerary-slot.js';
import { ItineraryRepository } from './itinerary.repository.js';

interface ScheduledItem extends Slot {
  id: string;
  day_id: string;
  proposal_id: string;
}

@Injectable()
export class ItineraryService {
  constructor(
    private readonly itineraryRepository: ItineraryRepository,
    private readonly tripsService: TripsService,
    private readonly proposalsService: ProposalsService,
  ) {}

  async get(tripId: string, userId: string): Promise<ItineraryDto> {
    const trip = await this.tripsService.findOne(tripId, userId);
    const [days, proposals] = await Promise.all([
      this.itineraryRepository.findDays(tripId),
      this.proposalsService.findAll(tripId, userId),
    ]);
    return this.toDto(trip, days, proposals);
  }

  async add(
    tripId: string,
    dto: CreateItineraryItemDto,
    userId: string,
  ): Promise<ItineraryDto> {
    const trip = await this.getEditableTrip(tripId, userId);
    const proposals = await this.proposalsService.findAll(tripId, userId);
    const proposal = proposals.find((p) => p.id === dto.proposal_id);
    if (!proposal) {
      throw new NotFoundException('Propuesta no encontrada');
    }
    if (proposal.status !== 'accepted') {
      throw new BadRequestException(
        'Solo se pueden añadir propuestas aceptadas por el grupo',
      );
    }

    const scheduled = await this.scheduled(tripId);
    if (scheduled.some((i) => i.proposal_id === dto.proposal_id)) {
      throw new ConflictException('Esa propuesta ya está en el itinerario');
    }
    checkSlot(dto, trip, scheduled);

    const day = await this.itineraryRepository.findOrCreateDay(
      tripId,
      dto.date,
    );
    await this.itineraryRepository.saveItem({
      day_id: day.id,
      proposal_id: dto.proposal_id,
      start_time: dto.start_time,
      end_time: dto.end_time,
      position: 0,
    });
    await this.itineraryRepository.reorder(day.id);
    return this.get(tripId, userId);
  }

  async update(
    tripId: string,
    itemId: string,
    dto: UpdateItineraryItemDto,
    userId: string,
  ): Promise<ItineraryDto> {
    const trip = await this.getEditableTrip(tripId, userId);
    const scheduled = await this.scheduled(tripId);
    const item = scheduled.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException('Actividad no encontrada en el itinerario');
    }

    const slot: Slot = {
      date: dto.date ?? item.date,
      start_time: dto.start_time ?? item.start_time,
      end_time: dto.end_time ?? item.end_time,
    };
    checkSlot(
      slot,
      trip,
      scheduled.filter((i) => i.id !== itemId),
    );

    const day = await this.itineraryRepository.findOrCreateDay(
      tripId,
      slot.date,
    );
    await this.itineraryRepository.saveItem({
      id: itemId,
      day_id: day.id,
      start_time: slot.start_time,
      end_time: slot.end_time,
    });
    await this.itineraryRepository.reorder(day.id);
    if (day.id !== item.day_id) {
      await this.itineraryRepository.reorder(item.day_id);
    }
    return this.get(tripId, userId);
  }

  async remove(
    tripId: string,
    itemId: string,
    userId: string,
  ): Promise<ItineraryDto> {
    await this.getEditableTrip(tripId, userId);
    const item = (await this.scheduled(tripId)).find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException('Actividad no encontrada en el itinerario');
    }
    await this.itineraryRepository.deleteItem(itemId);
    await this.itineraryRepository.reorder(item.day_id);
    return this.get(tripId, userId);
  }

  private async getEditableTrip(
    tripId: string,
    userId: string,
  ): Promise<TripDto> {
    const trip = await this.tripsService.findOne(tripId, userId);
    if (trip.role !== 'owner') {
      throw new ForbiddenException(
        'Solo el organizador puede editar el itinerario',
      );
    }
    return trip;
  }

  private async scheduled(tripId: string): Promise<ScheduledItem[]> {
    const days = await this.itineraryRepository.findDays(tripId);
    return days.flatMap((day) =>
      day.items.map((item) => ({
        id: item.id,
        day_id: day.id,
        proposal_id: item.proposal_id,
        date: day.date,
        start_time: item.start_time,
        end_time: item.end_time,
      })),
    );
  }

  private toDto(
    trip: TripDto,
    days: ItineraryDay[],
    proposals: ProposalDto[],
  ): ItineraryDto {
    const byId = new Map(proposals.map((p) => [p.id, p]));
    const scheduledIds = new Set(
      days.flatMap((d) => d.items.map((i) => i.proposal_id)),
    );

    // every date of the trip, plus saved days left outside it
    const dates = new Set(this.tripDates(trip.start_date, trip.end_date));
    for (const day of days) {
      if (day.items.length > 0) {
        dates.add(day.date);
      }
    }

    const result: ItineraryDayDto[] = [...dates].sort().map((date) => {
      const day = days.find((d) => d.date === date);
      const items = [...(day?.items ?? [])]
        .sort((a, b) => a.position - b.position)
        .filter((i) => byId.has(i.proposal_id))
        .map((i) => ({
          id: i.id,
          start_time: i.start_time,
          end_time: i.end_time,
          proposal: this.toProposal(byId.get(i.proposal_id)!),
        }));
      return {
        date,
        outside_trip: date < trip.start_date || date > trip.end_date,
        items,
      };
    });

    return {
      can_edit: trip.role === 'owner',
      days: result,
      available: proposals
        .filter((p) => p.status === 'accepted' && !scheduledIds.has(p.id))
        .map((p) => this.toProposal(p)),
    };
  }

  private toProposal(p: ProposalDto): ItineraryProposalDto {
    return {
      id: p.id,
      title: p.title,
      type: p.type,
      location: p.location,
      cost: p.cost,
      status: p.status,
    };
  }

  private tripDates(start: string, end: string): string[] {
    const dates: string[] = [];
    const current = new Date(`${start}T00:00:00Z`);
    const last = new Date(`${end}T00:00:00Z`);
    while (current <= last) {
      dates.push(current.toISOString().slice(0, 10));
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return dates;
  }
}
