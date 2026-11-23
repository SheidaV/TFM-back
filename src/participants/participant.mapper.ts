import { ParticipantDto } from './dto/participant.dto.js';
import { TripParticipant } from './entities/trip-participant.entity.js';

export class ParticipantMapper {
  static toDto(participant: TripParticipant): ParticipantDto {
    return {
      user_id: participant.user_id,
      name: participant.user.name,
      surname: participant.user.surname,
      alias: participant.user.alias,
      role: participant.role.name,
      joined_at: participant.createdAt,
    };
  }
}
