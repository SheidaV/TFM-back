import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';

export interface JWTPayload {
  userId: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    return user;
  }

  async generateAccessToken(user: { id: string; email: string }) {
    const payload: JWTPayload = { userId: user.id, email: user.email };
    return {
      user_id: user.id,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
