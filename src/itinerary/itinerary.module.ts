import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalsModule } from '../proposals/proposals.module.js';
import { TripsModule } from '../trips/trips.module.js';
import { ItineraryDay } from './entities/itinerary-day.entity.js';
import { ItineraryItem } from './entities/itinerary-item.entity.js';
import { ItineraryController } from './itinerary.controller.js';
import { ItineraryRepository } from './itinerary.repository.js';
import { ItineraryService } from './itinerary.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItineraryDay, ItineraryItem]),
    TripsModule,
    ProposalsModule,
  ],
  controllers: [ItineraryController],
  providers: [ItineraryService, ItineraryRepository],
})
export class ItineraryModule {}
