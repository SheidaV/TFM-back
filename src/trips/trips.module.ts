import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../participants/entities/role.entity.js';
import { TripParticipant } from '../participants/entities/trip-participant.entity.js';
import { Trip } from './entities/trip.entity.js';
import { TripsController } from './trips.controller.js';
import { TripsRepository } from './trips.repository.js';
import { TripsService } from './trips.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripParticipant, Role])],
  controllers: [TripsController],
  providers: [TripsService, TripsRepository],
  exports: [TripsService],
})
export class TripsModule {}
