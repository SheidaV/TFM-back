import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto } from '../users/dto/user.dto.js';
import { GroupPreferencesDto } from './dto/group-preferences.dto.js';
import { PreferenceDto } from './dto/preference.dto.js';
import { UpdatePreferenceDto } from './dto/update-preference.dto.js';
import { PreferencesService } from './preferences.service.js';

@ApiTags('Preferences')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token ausente o inválido' })
@ApiNotFoundResponse({ description: 'El viaje no existe o no participo en él' })
@UseGuards(AuthGuard('jwt'))
@Controller('trips/:tripId/preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @ApiOperation({
    summary: 'Mis preferencias y el resumen del grupo (solo recuentos)',
  })
  @ApiOkResponse({ type: GroupPreferencesDto })
  findAll(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: { user: UserDto },
  ): Promise<GroupPreferencesDto> {
    return this.preferencesService.findForGroup(tripId, req.user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Guardar mis preferencias en el viaje' })
  @ApiOkResponse({ type: PreferenceDto })
  @ApiBadRequestResponse({ description: 'Alguna opción no es válida' })
  save(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body() dto: UpdatePreferenceDto,
    @Req() req: { user: UserDto },
  ): Promise<PreferenceDto> {
    return this.preferencesService.save(tripId, dto, req.user.id);
  }
}
