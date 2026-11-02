import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { ExistUserAliasPipe } from './pipes/exist-user-alias.pipe.js';
import { ExistUserEmailPipe } from './pipes/exist-user-email.pipe.js';
import { UsersController } from './users.controller.js';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    ExistUserAliasPipe,
    ExistUserEmailPipe,
  ],
  exports: [UsersService],
})
export class UsersModule {}
