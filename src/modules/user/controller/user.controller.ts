import {Body, Controller, HttpStatus, Post, ValidationPipe} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {UserService} from "../service/user.service";
import {SignupRequest} from "../dto/request/signup.request";
import {SignupResponse} from "../dto/response/signup.response";

@Controller('/user')
@ApiTags('User')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Post('/signup')
    async getSmsDetail(
        @Body(new ValidationPipe()) signupRequest: SignupRequest,
    ): Promise<SignupResponse> {
        const user = await this.userService.signup(signupRequest);
        return { id : user.id, nickname : user.nickname };
    }
}
