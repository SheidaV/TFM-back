import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
    description:
      'Valida las credenciales y devuelve un token JWT. Úsalo como: Authorization: Bearer <token>.',
  })
  @ApiOkResponse({
    schema: { example: { user_id: 'uuid', access_token: 'eyJhbGciOi...' } },
  })
  @ApiBadRequestResponse({ description: 'Error de validación' })
  @ApiUnauthorizedResponse({ description: 'Correo o contraseña incorrectos' })
  async login(
    @Body() dto: LoginDto,
  ): Promise<{ user_id: string; access_token: string }> {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    return this.authService.generateAccessToken(user);
  }
}
