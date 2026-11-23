import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ROLE_PARTICIPANT } from '../participants/entities/role.entity.js';
import { ParticipantsService } from '../participants/participants.service.js';
import { PreferencesService } from '../preferences/preferences.service.js';
import { ProposalsRepository } from './proposals.repository.js';
import { ProposalsService } from './proposals.service.js';

const creator = { id: 'user-1', name: 'Ana', surname: 'Test', alias: 'ana' };
const proposal = {
  id: 'prop-1',
  trip_id: 'trip-1',
  created_by: 'user-1',
  creator,
  type: 'restaurant',
  title: 'Cena',
  description: null,
  cost: 20,
  location: null,
  location_lat: null,
  location_lon: null,
  diet_tags: ['vegan'],
  createdAt: new Date(),
};
const member = (userId: string, roleId: number) => ({
  user_id: userId,
  role: { id: roleId },
});

describe('ProposalsService', () => {
  let service: ProposalsService;
  const repository = {
    findByTrip: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  };
  const participants = { getMembership: vi.fn() };
  const preferences = { foodCounts: vi.fn() };

  beforeEach(async () => {
    vi.resetAllMocks();
    preferences.foodCounts.mockResolvedValue({});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposalsService,
        { provide: ProposalsRepository, useValue: repository },
        { provide: ParticipantsService, useValue: participants },
        { provide: PreferencesService, useValue: preferences },
      ],
    }).compile();

    service = module.get<ProposalsService>(ProposalsService);
  });

  describe('incompatibleDiets', () => {
    it('lists group diets the restaurant does not offer', () => {
      const result = service.incompatibleDiets(
        { type: 'restaurant', diet_tags: ['vegetarian'] },
        { vegetarian: 1, gluten_free: 2 },
      );
      expect(result).toEqual([{ tag: 'gluten_free', people: 2 }]);
    });

    it('a vegan restaurant is also fine for vegetarians', () => {
      const result = service.incompatibleDiets(
        { type: 'restaurant', diet_tags: ['vegan'] },
        { vegetarian: 3, vegan: 1 },
      );
      expect(result).toEqual([]);
    });
  });

  it('other participants cannot delete it', async () => {
    participants.getMembership.mockResolvedValue(
      member('user-3', ROLE_PARTICIPANT),
    );
    repository.findOne.mockResolvedValue(proposal);

    await expect(service.remove('trip-1', 'prop-1', 'user-3')).rejects.toThrow(
      ForbiddenException,
    );
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
