import { Controller, Get, UseGuards, Patch } from '@nestjs/common';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  @Get('me')
  profile(@GetUser() user: User) {
    return user;
  }
  @Patch('/:userId')
  editUser(@GetUser() userId: number) {
    return userId;
  }
}
