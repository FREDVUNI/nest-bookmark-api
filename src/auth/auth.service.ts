import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    //generate hash
    const hash = await argon.hash(dto.password);

    try {
      //save new users
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        // select:{
        //     email:true,
        //     firstName:true,
        //     lastName:true,
        //     createdAt:true,
        //     updatedAt:true
        // }
      });
      // delete user.hash;

      const token = await this.signToken(user.id, user.email);
      return token;
    } catch (error) {
      // if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('user with this email already exists.');
      }
      // }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user)
      throw new ForbiddenException('wrong password email combination.');

    const verify_password = await argon.verify(user.hash, dto.password);

    if (!verify_password)
      throw new ForbiddenException('wrong password email combination.');

    // delete user.hash;
    const token = await this.signToken(user.id, user.email);
    return token;
  }

  signToken(userId: number, email: string): Promise<String> {
    const payload = {
      sub: userId,
      email,
    };
    return this.jwt.signAsync(payload, {
      expiresIn: '15min',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
