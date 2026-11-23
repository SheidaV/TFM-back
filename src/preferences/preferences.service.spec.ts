import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsService } from '../participants/participants.service.js';
import { PreferencesRepository } from './preferences.repository.js';
import { PreferencesService } from './preferences.service.js';

const date = new Date('2026-11-23');

describe('PreferencesService', () => {
  let service: PreferencesService;
  const repository = { findByTrip: vi.fn(), save: vi.fn() };
  const participants = { getMembership: vi.fn(), count: vi.fn() };

  beforeEach(async () => {
    vi.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreferencesService,
        { provide: PreferencesRepository, useValue: repository },
        { provide: ParticipantsService, useValue: participants },
      ],
    }).compile();

    service = module.get<PreferencesService>(PreferencesService);
  });

  it('fails if the user is not in the trip', async () => {
    participants.getMembership.mockRejectedValue(new NotFoundException());
    await expect(service.findForGroup('trip-1', 'user-9')).rejects.toThrow(
      NotFoundException,
    );
    expect(repository.findByTrip).not.toHaveBeenCalled();
  });

  it('returns my preferences and group counts', async () => {
    repository.findByTrip.mockResolvedValue([
      {
        user_id: 'user-1',
        food: ['vegan'],
        activities: ['culture'],
        updatedAt: date,
      },
      {
        user_id: 'user-2',
        food: ['vegan', 'gluten_free'],
        activities: ['culture', 'nature'],
        updatedAt: date,
      },
    ]);
    participants.count.mockResolvedValue(3);

    const result = await service.findForGroup('trip-1', 'user-1');

    expect(result.mine).toEqual({
      food: ['vegan'],
      activities: ['culture'],
      updated_at: date,
    });
    expect(result.responses).toBe(2);
    expect(result.participants).toBe(3);
    expect(result.food).toEqual({ vegan: 2, gluten_free: 1 });
    expect(result.activities).toEqual({ culture: 2, nature: 1 });
  });
});
