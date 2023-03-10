import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()

export class AuthService{
    constructor( private prisma:PrismaService ){}
    login(){
        
    }
    async signup(dto:AuthDto){

        //generate hash
        const hash = await argon.hash(dto.password)

        try{
            //save new users
            const user = await this.prisma.user.create({
                data:{
                    email:dto.email,
                    hash,
                },
                // select:{
                //     email:true,
                //     firstName:true,
                //     lastName:true,
                //     createdAt:true,
                //     updatedAt:true
                // }
            })
            delete user.hash;
            return user;
        }
        catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException('user with this email already exists.')
                }
            }
            throw error
        }
    }
}