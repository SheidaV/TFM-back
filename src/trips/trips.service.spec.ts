import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ROLE_OWNER,
  ROLE_PARTICIPANT,
} from '../participants/entities/role.entity.js';
import { TripsRepository } from './trips.repository.js';
import { TripsService } from './trips.service.js';

const trip = {
  id: 'trip-1',
  owner_id: 'user-1',
  name: 'Escapada a Granada',
  destination: 'Granada',
  start_date: '2027-05-14',
  end_date: '2027-05-17',
  budget: 400,
};

function participation(roleId: number, roleName: string) {
  return {
    trip_id: trip.id,
    user_id: 'user-1',
    trip: { ...trip },
    role: { id: roleId, name: roleName },
  };
}

describe('TripsService', () => {
  let service: TripsService;
  const repository = {
    createWithOwner: vi.fn(),
    findParticipation: vi.fn(),
    countParticipants: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();
    repository.countParticipants.mockResolvedValue(new Map([[trip.id, 1]]));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        { provide: TripsRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<TripsService>(TripsService);
  });

  it('crea el viaje con el usuario como propietario', async () => {
    repository.createWithOwner.mockResolvedValue(trip);

    const result = await service.create(trip, 'user-1');

    expect(repository.createWithOwner).toHaveBeenCalledWith(
      expect.objectContaining({ owner_id: 'user-1' }),
    );
    expect(result.role).toBe('owner');
  });

  it('no crea un viaje si la fecha de fin es anterior a la de inicio', async () => {
    await expect(
      service.create({ ...trip, end_date: '2027-05-10' }, 'user-1'),
    ).rejects.toThrow(BadRequestException);
    expect(repository.createWithOwner).not.toHaveBeenCalled();
  });

  it('devuelve 404 si el usuario no participa en el viaje', async () => {
    repository.findParticipation.mockResolvedValue(null);

    await expect(service.findOne(trip.id, 'user-2')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('solo el propietario puede editar', async () => {
    repository.findParticipation.mockResolvedValue(
      participation(ROLE_PARTICIPANT, 'participant'),
    );

    await expect(
      service.update(trip.id, { name: 'Otro nombre' }, 'user-1'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('valida las fechas combinando las nuevas con las guardadas', async () => {
    repository.findParticipation.mockResolvedValue(
      participation(ROLE_OWNER, 'owner'),
    );

    await expect(
      service.update(trip.id, { end_date: '2027-01-01' }, 'user-1'),
    ).rejects.toThrow(BadRequestException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('solo el propietario puede eliminar', async () => {
    repository.findParticipation.mockResolvedValue(
      participation(ROLE_PARTICIPANT, 'participant'),
    );

    await expect(service.remove(trip.id, 'user-1')).rejects.toThrow(
      ForbiddenException,
    );
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
