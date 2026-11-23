import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service.js';
import { ROLE_OWNER, ROLE_PARTICIPANT } from './entities/role.entity.js';
import { ParticipantsRepository } from './participants.repository.js';
import { ParticipantsService } from './participants.service.js';

const owner = { role: { id: ROLE_OWNER, name: 'owner' } };
const member = { role: { id: ROLE_PARTICIPANT, name: 'participant' } };
const user = { id: 'user-2', name: 'Bea', surname: 'Ruiz', alias: 'bea' };

describe('ParticipantsService', () => {
  let service: ParticipantsService;
  const repository = {
    findOne: vi.fn(),
    findByTrip: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
  };
  const usersService = { findByAliasOrEmail: vi.fn() };

  beforeEach(async () => {
    vi.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantsService,
        { provide: ParticipantsRepository, useValue: repository },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<ParticipantsService>(ParticipantsService);
  });

  it('only the owner can invite', async () => {
    repository.findOne.mockResolvedValueOnce(member);
    await expect(service.invite('trip-1', 'bea', 'user-1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('fails if the user is already in the trip', async () => {
    repository.findOne
      .mockResolvedValueOnce(owner)
      .mockResolvedValueOnce(member);
    usersService.findByAliasOrEmail.mockResolvedValue(user);
    await expect(service.invite('trip-1', 'bea', 'user-1')).rejects.toThrow(
      ConflictException,
    );
    expect(repository.add).not.toHaveBeenCalled();
  });

  it('the owner cannot leave the trip', async () => {
    repository.findOne.mockResolvedValue(owner);
    await expect(service.remove('trip-1', 'user-1', 'user-1')).rejects.toThrow(
      BadRequestException,
    );
    expect(repository.remove).not.toHaveBeenCalled();
  });
});
