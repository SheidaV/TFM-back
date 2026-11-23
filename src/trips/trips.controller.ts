import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { CreateTripDto } from './dto/create-trip.dto.js';
import { TripDto } from './dto/trip.dto.js';
import { UpdateTripDto } from './dto/update-trip.dto.js';
import { TripsService } from './trips.service.js';

@ApiTags('Trips')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token ausente o inválido' })
@UseGuards(AuthGuard('jwt'))
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar los viajes en los que participo' })
  @ApiOkResponse({ type: [TripDto] })
  findAll(@Req() req: { user: UserDto }): Promise<TripDto[]> {
    return this.tripsService.findAllForUser(req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un viaje (el usuario queda como propietario)',
  })
  @ApiCreatedResponse({ type: TripDto })
  @ApiBadRequestResponse({
    description: 'Error de validación o fechas incorrectas',
  })
  create(
    @Body() dto: CreateTripDto,
    @Req() req: { user: UserDto },
  ): Promise<TripDto> {
    return this.tripsService.create(dto, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar un viaje' })
  @ApiOkResponse({ type: TripDto })
  @ApiNotFoundResponse({
    description: 'El viaje no existe o no participo en él',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: UserDto },
  ): Promise<TripDto> {
    return this.tripsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar un viaje (solo el propietario)' })
  @ApiOkResponse({ type: TripDto })
  @ApiBadRequestResponse({
    description: 'Error de validación o fechas incorrectas',
  })
  @ApiForbiddenResponse({ description: 'No soy el propietario' })
  @ApiNotFoundResponse({
    description: 'El viaje no existe o no participo en él',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTripDto,
    @Req() req: { user: UserDto },
  ): Promise<TripDto> {
    return this.tripsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar un viaje (solo el propietario)' })
  @ApiNoContentResponse()
  @ApiForbiddenResponse({ description: 'No soy el propietario' })
  @ApiNotFoundResponse({
    description: 'El viaje no existe o no participo en él',
  })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: UserDto },
  ): Promise<void> {
    return this.tripsService.remove(id, req.user.id);
  }
}
