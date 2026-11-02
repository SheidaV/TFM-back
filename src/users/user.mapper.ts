import { CreateUserDto } from './dto/create-user.dto.js';
import { UserDto } from './dto/user.dto.js';
import { User } from './entities/user.entity.js';

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      alias: user.alias,
      birth_date: user.birth_date,
      email: user.email,
      is_admin: user.is_admin,
    };
  }

  static toEntity(dto: CreateUserDto, passwordHash: string): Partial<User> {
    return {
      name: dto.name.trim(),
      surname: dto.surname.trim(),
      alias: dto.alias.trim(),
      birth_date: dto.birth_date,
      email: dto.email.trim().toLowerCase(),
      password: passwordHash,
    };
  }
}
