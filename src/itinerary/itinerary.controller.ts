import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto } from '../users/dto/user.dto.js';
import { CreateItineraryItemDto } from './dto/create-itinerary-item.dto.js';
import { ItineraryDto } from './dto/itinerary.dto.js';
import { UpdateItineraryItemDto } from './dto/update-itinerary-item.dto.js';
import { ItineraryService } from './itinerary.service.js';

@ApiTags('Itinerary')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token ausente o inválido' })
@ApiNotFoundResponse({ description: 'El viaje no existe o no participo en él' })
@UseGuards(AuthGuard('jwt'))
@Controller('trips/:tripId/itinerary')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Get()
  @ApiOperation({ summary: 'Consultar el itinerario por días' })
  @ApiOkResponse({ type: ItineraryDto })
  get(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: { user: UserDto },
  ): Promise<ItineraryDto> {
    return this.itineraryService.get(tripId, req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Añadir una propuesta aceptada (solo el organizador)',
  })
  @ApiOkResponse({ type: ItineraryDto })
  @ApiBadRequestResponse({
    description:
      'Fecha fuera del viaje, horas incorrectas, solapamiento o propuesta no aceptada',
  })
  @ApiForbiddenResponse({ description: 'No soy el organizador' })
  @ApiConflictResponse({ description: 'La propuesta ya está en el itinerario' })
  add(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body() dto: CreateItineraryItemDto,
    @Req() req: { user: UserDto },
  ): Promise<ItineraryDto> {
    return this.itineraryService.add(tripId, dto, req.user.id);
  }

  @Patch(':itemId')
  @ApiOperation({ summary: 'Cambiar el día o el horario de una actividad' })
  @ApiOkResponse({ type: ItineraryDto })
  @ApiBadRequestResponse({
    description: 'Fecha fuera del viaje, horas incorrectas o solapamiento',
  })
  @ApiForbiddenResponse({ description: 'No soy el organizador' })
  update(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateItineraryItemDto,
    @Req() req: { user: UserDto },
  ): Promise<ItineraryDto> {
    return this.itineraryService.update(tripId, itemId, dto, req.user.id);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Retirar una actividad del itinerario' })
  @ApiOkResponse({ type: ItineraryDto })
  @ApiForbiddenResponse({ description: 'No soy el organizador' })
  remove(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Req() req: { user: UserDto },
  ): Promise<ItineraryDto> {
    return this.itineraryService.remove(tripId, itemId, req.user.id);
  }
}
