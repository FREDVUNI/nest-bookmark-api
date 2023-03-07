import { Controller, Post } from "@nestjs/common/decorators";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private authService:AuthService){}

    @Post('signup')
    signup(){
        return "sign up"
    }

    @Post('signin')
    signin(){
        return "sign in"
    }
}