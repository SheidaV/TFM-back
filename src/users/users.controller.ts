import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserDto } from './dto/user.dto.js';
import { ExistUserAliasPipe } from './pipes/exist-user-alias.pipe.js';
import { ExistUserEmailPipe } from './pipes/exist-user-email.pipe.js';
import { UsersService } from './users.service.js';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un usuario' })
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Error de validación' })
  @ApiConflictResponse({ description: 'El alias o el correo ya existen' })
  register(
    @Body(ExistUserAliasPipe, ExistUserEmailPipe) dto: CreateUserDto,
  ): Promise<UserDto> {
    return this.usersService.register(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consultar el usuario autenticado' })
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido' })
  getMe(@Req() req: { user: UserDto }): UserDto {
    return req.user;
  }
}
