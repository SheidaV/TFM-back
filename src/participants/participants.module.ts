import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module.js';
import { Role } from './entities/role.entity.js';
import { TripParticipant } from './entities/trip-participant.entity.js';
import { ParticipantsController } from './participants.controller.js';
import { ParticipantsRepository } from './participants.repository.js';
import { ParticipantsService } from './participants.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([TripParticipant, Role]), UsersModule],
  controllers: [ParticipantsController],
  providers: [ParticipantsService, ParticipantsRepository],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
