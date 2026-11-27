import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ItineraryModule } from './itinerary/itinerary.module.js';
import { ParticipantsModule } from './participants/participants.module.js';
import { PreferencesModule } from './preferences/preferences.module.js';
import { ProposalsModule } from './proposals/proposals.module.js';
import { RecommendationsModule } from './recommendations/recommendations.module.js';
import { TripsModule } from './trips/trips.module.js';
import { UsersModule } from './users/users.module.js';
import { VotesModule } from './votes/votes.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const common = {
          type: 'postgres' as const,
          autoLoadEntities: true,
          synchronize: false,
        };
        // Neon (production): pooled connection string with SSL
        const url = config.get<string>('DATABASE_URL');
        if (url) {
          return { ...common, url, ssl: true };
        }
        // local PostgreSQL
        return {
          ...common,
          host: config.get<string>('DB_HOST', 'localhost'),
          port: Number(config.get<string>('DB_PORT', '5432')),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
        };
      },
    }),
    AuthModule,
    UsersModule,
    TripsModule,
    ParticipantsModule,
    PreferencesModule,
    ProposalsModule,
    VotesModule,
    ItineraryModule,
    RecommendationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
