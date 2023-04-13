import { Controller, Get, UseGuards, Patch, Body } from '@nestjs/common';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService:UserService){
    
  }

  @Get('me')
  profile(@GetUser() user: User) {
    return user;
  }

  @Patch('/profile')
  editUser(@GetUser('id') userId: number, @Body() dto:UpdateUserDto) {
    return this.userService.update(userId,dto);
  }
}
