import { CreateTripDto } from './dto/create-trip.dto.js';
import { TripDto } from './dto/trip.dto.js';
import { Trip } from './entities/trip.entity.js';

export class TripMapper {
  static toDto(trip: Trip, role: string, participantsCount: number): TripDto {
    return {
      id: trip.id,
      owner_id: trip.owner_id,
      name: trip.name,
      destination: trip.destination,
      destination_lat: trip.destination_lat,
      destination_lon: trip.destination_lon,
      start_date: trip.start_date,
      end_date: trip.end_date,
      budget: trip.budget,
      role,
      participants_count: participantsCount,
    };
  }

  static toEntity(dto: CreateTripDto, ownerId: string): Partial<Trip> {
    return {
      owner_id: ownerId,
      name: dto.name.trim(),
      destination: dto.destination.trim(),
      destination_lat: dto.destination_lat ?? null,
      destination_lon: dto.destination_lon ?? null,
      start_date: dto.start_date,
      end_date: dto.end_date,
      budget: dto.budget ?? null,
    };
  }
}
