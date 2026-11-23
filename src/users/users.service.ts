import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserDto } from './dto/user.dto.js';
import { User } from './entities/user.entity.js';
import { UserMapper } from './user.mapper.js';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(dto: CreateUserDto): Promise<UserDto> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepository.save(
      UserMapper.toEntity(dto, passwordHash),
    );
    return UserMapper.toDto(user);
  }

  async getUserById(id: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findById(id);
    return user ? UserMapper.toDto(user) : null;
  }

  async findByAliasOrEmail(identifier: string): Promise<User | null> {
    return identifier.includes('@')
      ? this.usersRepository.findByEmail(identifier)
      : this.usersRepository.findByAlias(identifier);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.findByEmailWithPassword(email);
  }
}
