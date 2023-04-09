import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  profile(@Req() req: Request) {
    return req.user;
  }
  
}
