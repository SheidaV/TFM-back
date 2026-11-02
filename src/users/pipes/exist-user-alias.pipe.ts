import { ConflictException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UsersRepository } from '../users.repository.js';

@Injectable()
export class ExistUserAliasPipe implements PipeTransform {
  constructor(private readonly usersRepository: UsersRepository) {}

  async transform(dto: CreateUserDto): Promise<CreateUserDto> {
    if (await this.usersRepository.findByAlias(dto.alias)) {
      throw new ConflictException('Ya existe un usuario con ese alias');
    }
    return dto;
  }
}
