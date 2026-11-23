import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantsModule } from '../participants/participants.module.js';
import { PreferencesModule } from '../preferences/preferences.module.js';
import { Vote } from '../votes/entities/vote.entity.js';
import { Proposal } from './entities/proposal.entity.js';
import { ProposalsController } from './proposals.controller.js';
import { ProposalsRepository } from './proposals.repository.js';
import { ProposalsService } from './proposals.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proposal, Vote]),
    ParticipantsModule,
    PreferencesModule,
  ],
  controllers: [ProposalsController],
  providers: [ProposalsService, ProposalsRepository],
  exports: [ProposalsService],
})
export class ProposalsModule {}
