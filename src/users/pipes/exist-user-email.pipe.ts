import { ConflictException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UsersRepository } from '../users.repository.js';

@Injectable()
export class ExistUserEmailPipe implements PipeTransform {
  constructor(private readonly usersRepository: UsersRepository) {}

  async transform(dto: CreateUserDto): Promise<CreateUserDto> {
    if (await this.usersRepository.findByEmail(dto.email)) {
      throw new ConflictException(
        'Ya existe un usuario con ese correo electrónico',
      );
    }
    return dto;
  }
}
