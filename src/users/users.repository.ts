import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  save(data: Partial<User>): Promise<User> {
    return this.repository.save(this.repository.create(data));
  }

  findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email: email.trim().toLowerCase() },
    });
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email.trim().toLowerCase() })
      .getOne();
  }

  findByAlias(alias: string): Promise<User | null> {
    return this.repository.findOne({ where: { alias: alias.trim() } });
  }
}
