import { Injectable } from '@nestjs/common';
import { ParticipantsService } from '../participants/participants.service.js';
import { GroupPreferencesDto } from './dto/group-preferences.dto.js';
import { PreferenceDto } from './dto/preference.dto.js';
import { UpdatePreferenceDto } from './dto/update-preference.dto.js';
import { Preference } from './entities/preference.entity.js';
import { PreferencesRepository } from './preferences.repository.js';

@Injectable()
export class PreferencesService {
  constructor(
    private readonly preferencesRepository: PreferencesRepository,
    private readonly participantsService: ParticipantsService,
  ) {}

  async findForGroup(
    tripId: string,
    userId: string,
  ): Promise<GroupPreferencesDto> {
    await this.participantsService.getMembership(tripId, userId);

    const preferences = await this.preferencesRepository.findByTrip(tripId);
    const mine = preferences.find((p) => p.user_id === userId);

    return {
      mine: mine ? this.toDto(mine) : null,
      responses: preferences.length,
      participants: await this.participantsService.count(tripId),
      food: this.countTags(preferences.map((p) => p.food)),
      activities: this.countTags(preferences.map((p) => p.activities)),
    };
  }

  async save(
    tripId: string,
    dto: UpdatePreferenceDto,
    userId: string,
  ): Promise<PreferenceDto> {
    await this.participantsService.getMembership(tripId, userId);
    const preference = await this.preferencesRepository.save(tripId, userId, {
      food: dto.food,
      activities: dto.activities,
    });
    return this.toDto(preference);
  }

  async foodCounts(tripId: string): Promise<Record<string, number>> {
    const preferences = await this.preferencesRepository.findByTrip(tripId);
    return this.countTags(preferences.map((p) => p.food));
  }

  private countTags(lists: string[][]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const tag of lists.flat()) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
    return counts;
  }

  private toDto(preference: Preference): PreferenceDto {
    return {
      food: preference.food,
      activities: preference.activities,
      updated_at: preference.updatedAt,
    };
  }
}
