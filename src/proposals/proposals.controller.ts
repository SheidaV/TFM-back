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
import { CreateProposalDto } from './dto/create-proposal.dto.js';
import { ProposalDto } from './dto/proposal.dto.js';
import { ProposalsService } from './proposals.service.js';

@ApiTags('Proposals')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token ausente o inválido' })
@ApiNotFoundResponse({ description: 'El viaje no existe o no participo en él' })
@UseGuards(AuthGuard('jwt'))
@Controller('trips/:tripId/proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar las propuestas del viaje' })
  @ApiOkResponse({ type: [ProposalDto] })
  findAll(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: { user: UserDto },
  ): Promise<ProposalDto[]> {
    return this.proposalsService.findAll(tripId, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una propuesta (actividad o restaurante)' })
  @ApiCreatedResponse({ type: ProposalDto })
  @ApiBadRequestResponse({ description: 'Error de validación' })
  create(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body() dto: CreateProposalDto,
    @Req() req: { user: UserDto },
  ): Promise<ProposalDto> {
    return this.proposalsService.create(tripId, dto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar una propuesta (creador u organizador)' })
  @ApiNoContentResponse()
  @ApiForbiddenResponse({ description: 'No soy el creador ni el organizador' })
  remove(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: UserDto },
  ): Promise<void> {
    return this.proposalsService.remove(tripId, id, req.user.id);
  }
}
