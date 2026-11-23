import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto } from '../users/dto/user.dto.js';
import { InviteParticipantDto } from './dto/invite-participant.dto.js';
import { ParticipantDto } from './dto/participant.dto.js';
import { ParticipantsService } from './participants.service.js';

@ApiTags('Participants')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token ausente o inválido' })
@ApiNotFoundResponse({ description: 'El viaje no existe o no participo en él' })
@UseGuards(AuthGuard('jwt'))
@Controller('trips/:tripId/participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar los participantes de un viaje' })
  @ApiOkResponse({ type: [ParticipantDto] })
  findAll(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: { user: UserDto },
  ): Promise<ParticipantDto[]> {
    return this.participantsService.findAll(tripId, req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Invitar a un usuario por alias o correo (solo el propietario)',
  })
  @ApiCreatedResponse({ type: ParticipantDto })
  @ApiForbiddenResponse({ description: 'No soy el propietario' })
  @ApiConflictResponse({ description: 'El usuario ya está en el viaje' })
  invite(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body() dto: InviteParticipantDto,
    @Req() req: { user: UserDto },
  ): Promise<ParticipantDto> {
    return this.participantsService.invite(tripId, dto.identifier, req.user.id);
  }

  @Delete(':userId')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Quitar a un participante o salir del viaje (con mi propio id)',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ description: 'El propietario no puede salir' })
  @ApiForbiddenResponse({
    description: 'Solo el propietario puede quitar a otros',
  })
  remove(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Req() req: { user: UserDto },
  ): Promise<void> {
    return this.participantsService.remove(tripId, userId, req.user.id);
  }
}
