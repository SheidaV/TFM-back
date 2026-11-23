import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantsModule } from '../participants/participants.module.js';
import { ProposalsModule } from '../proposals/proposals.module.js';
import { Vote } from './entities/vote.entity.js';
import { VotesController } from './votes.controller.js';
import { VotesRepository } from './votes.repository.js';
import { VotesService } from './votes.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote]),
    ProposalsModule,
    ParticipantsModule,
  ],
  controllers: [VotesController],
  providers: [VotesService, VotesRepository],
})
export class VotesModule {}
