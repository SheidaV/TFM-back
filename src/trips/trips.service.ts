import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ROLE_OWNER } from '../participants/entities/role.entity.js';
import { TripParticipant } from '../participants/entities/trip-participant.entity.js';
import { CreateTripDto } from './dto/create-trip.dto.js';
import { TripDto } from './dto/trip.dto.js';
import { UpdateTripDto } from './dto/update-trip.dto.js';
import { TripMapper } from './trip.mapper.js';
import { TripsRepository } from './trips.repository.js';

@Injectable()
export class TripsService {
  constructor(private readonly tripsRepository: TripsRepository) {}

  async findAllForUser(userId: string): Promise<TripDto[]> {
    const participations =
      await this.tripsRepository.findParticipationsByUser(userId);
    const counts = await this.tripsRepository.countParticipants(
      participations.map((p) => p.trip_id),
    );

    return participations.map((p) =>
      TripMapper.toDto(p.trip, p.role.name, counts.get(p.trip_id) ?? 1),
    );
  }

  async findOne(tripId: string, userId: string): Promise<TripDto> {
    const participation = await this.getParticipation(tripId, userId);
    return this.toDto(participation);
  }

  async create(dto: CreateTripDto, userId: string): Promise<TripDto> {
    this.checkDates(dto.start_date, dto.end_date);
    const trip = await this.tripsRepository.createWithOwner(
      TripMapper.toEntity(dto, userId),
    );
    return TripMapper.toDto(trip, 'owner', 1);
  }

  async update(
    tripId: string,
    dto: UpdateTripDto,
    userId: string,
  ): Promise<TripDto> {
    const participation = await this.getParticipation(tripId, userId);
    this.checkOwner(participation);

    const trip = participation.trip;
    // Se comprueban las fechas combinando las nuevas con las que ya tenía
    this.checkDates(
      dto.start_date ?? trip.start_date,
      dto.end_date ?? trip.end_date,
    );

    if (dto.name !== undefined) trip.name = dto.name.trim();
    if (dto.destination !== undefined)
      trip.destination = dto.destination.trim();
    if (dto.destination_lat !== undefined)
      trip.destination_lat = dto.destination_lat;
    if (dto.destination_lon !== undefined)
      trip.destination_lon = dto.destination_lon;
    if (dto.start_date !== undefined) trip.start_date = dto.start_date;
    if (dto.end_date !== undefined) trip.end_date = dto.end_date;
    if (dto.budget !== undefined) trip.budget = dto.budget;

    participation.trip = await this.tripsRepository.save(trip);
    return this.toDto(participation);
  }

  async remove(tripId: string, userId: string): Promise<void> {
    const participation = await this.getParticipation(tripId, userId);
    this.checkOwner(participation);
    await this.tripsRepository.delete(tripId);
  }

  // Si el usuario no participa en el viaje, error NotFoundException
  private async getParticipation(
    tripId: string,
    userId: string,
  ): Promise<TripParticipant> {
    const participation = await this.tripsRepository.findParticipation(
      tripId,
      userId,
    );
    if (!participation) {
      throw new NotFoundException('Viaje no encontrado');
    }
    return participation;
  }

  private checkOwner(participation: TripParticipant): void {
    if (participation.role.id !== ROLE_OWNER) {
      throw new ForbiddenException(
        'Solo el propietario puede modificar el viaje',
      );
    }
  }

  private checkDates(startDate: string, endDate: string): void {
    if (endDate < startDate) {
      throw new BadRequestException(
        'La fecha de fin no puede ser anterior a la de inicio',
      );
    }
  }

  private async toDto(participation: TripParticipant): Promise<TripDto> {
    const counts = await this.tripsRepository.countParticipants([
      participation.trip_id,
    ]);
    return TripMapper.toDto(
      participation.trip,
      participation.role.name,
      counts.get(participation.trip_id) ?? 1,
    );
  }
}
