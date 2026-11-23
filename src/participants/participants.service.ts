import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { ParticipantDto } from './dto/participant.dto.js';
import { ROLE_OWNER } from './entities/role.entity.js';
import { TripParticipant } from './entities/trip-participant.entity.js';
import { ParticipantMapper } from './participant.mapper.js';
import { ParticipantsRepository } from './participants.repository.js';

@Injectable()
export class ParticipantsService {
  constructor(
    private readonly participantsRepository: ParticipantsRepository,
    private readonly usersService: UsersService,
  ) {}

  async findAll(tripId: string, userId: string): Promise<ParticipantDto[]> {
    await this.getMembership(tripId, userId);
    const participants = await this.participantsRepository.findByTrip(tripId);
    return participants.map((p) => ParticipantMapper.toDto(p));
  }

  async invite(
    tripId: string,
    identifier: string,
    userId: string,
  ): Promise<ParticipantDto> {
    const membership = await this.getMembership(tripId, userId);
    if (membership.role.id !== ROLE_OWNER) {
      throw new ForbiddenException('Solo el propietario puede invitar');
    }

    const user = await this.usersService.findByAliasOrEmail(identifier.trim());
    if (!user) {
      throw new NotFoundException(
        'No hay ningún usuario con ese alias o correo',
      );
    }
    if (await this.participantsRepository.findOne(tripId, user.id)) {
      throw new ConflictException('Esa persona ya está en el viaje');
    }

    const participant = await this.participantsRepository.add(tripId, user.id);
    return ParticipantMapper.toDto(participant);
  }

  // owner removes someone, or a participant leaves the trip
  async remove(
    tripId: string,
    targetUserId: string,
    userId: string,
  ): Promise<void> {
    const membership = await this.getMembership(tripId, userId);
    const isOwner = membership.role.id === ROLE_OWNER;

    if (!isOwner && targetUserId !== userId) {
      throw new ForbiddenException(
        'Solo el propietario puede quitar participantes',
      );
    }
    if (isOwner && targetUserId === userId) {
      throw new BadRequestException(
        'El propietario no puede salir del viaje; puede eliminarlo',
      );
    }

    const target = await this.participantsRepository.findOne(
      tripId,
      targetUserId,
    );
    if (!target) {
      throw new NotFoundException('Esa persona no está en el viaje');
    }

    await this.participantsRepository.remove(tripId, targetUserId);
  }

  async count(tripId: string): Promise<number> {
    return (await this.participantsRepository.findByTrip(tripId)).length;
  }

  // error NotFoundException
  async getMembership(
    tripId: string,
    userId: string,
  ): Promise<TripParticipant> {
    const membership = await this.participantsRepository.findOne(
      tripId,
      userId,
    );
    if (!membership) {
      throw new NotFoundException('Viaje no encontrado');
    }
    return membership;
  }
}
