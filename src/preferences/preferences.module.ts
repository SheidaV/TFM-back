import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantsModule } from '../participants/participants.module.js';
import { Preference } from './entities/preference.entity.js';
import { PreferencesController } from './preferences.controller.js';
import { PreferencesRepository } from './preferences.repository.js';
import { PreferencesService } from './preferences.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Preference]), ParticipantsModule],
  controllers: [PreferencesController],
  providers: [PreferencesService, PreferencesRepository],
  exports: [PreferencesService],
})
export class PreferencesModule {}
