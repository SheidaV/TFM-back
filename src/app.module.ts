import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { TripsModule } from './trips/trips.module.js';
import { ParticipantsModule } from './participants/participants.module.js';
import { PreferencesModule } from './preferences/preferences.module.js';
import { ProposalsModule } from './proposals/proposals.module.js';
import { VotesModule } from './votes/votes.module.js';
import { ItineraryModule } from './itinerary/itinerary.module.js';
import { RecommendationsModule } from './recommendations/recommendations.module.js';

@Module({
  imports: [AuthModule, UsersModule, TripsModule, ParticipantsModule, PreferencesModule, ProposalsModule, VotesModule, ItineraryModule, RecommendationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
