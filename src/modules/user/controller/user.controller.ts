import {Body, Controller, Get, Param, Post, Query, ValidationPipe} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {UserService} from "../service/user.service";
import {SignupRequest} from "../dto/request/signup.request";
import {SignupResponse} from "../dto/response/signup.response";
import {LoginRequest} from "../dto/request/login.request";
import {LoginResponse} from "../dto/response/login.response";
import {SimpleCourseQuery} from "../../course/query/simpleCourse.query";
import {CheckIdQuery} from "../query/checkId.query";
import {CheckNicknameQuery} from "../query/checkNickname.query";

@Controller('/user')
@ApiTags('User')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Post()
    async createUser(
        @Body(new ValidationPipe()) signupRequest: SignupRequest,
    ): Promise<SignupResponse> {
        const user = await this.userService.createUser(signupRequest);
        return { id : user.id, nickname : user.nickname };
    }

    @Post('/login')
    async login(
        @Body(new ValidationPipe()) loginRequest: LoginRequest,
    ): Promise<LoginResponse> {
        const jwt = await this.userService.login(loginRequest);
        return { accessToken : jwt };
    }

    @Get('/id/:id')
    async checkId(
        @Param()
        @Query() checkIdQuery: CheckIdQuery
    ): Promise<boolean> {
        return await this.userService.checkId(checkIdQuery.id);

    }

    @Get('/nickname/:nickname')
    async checkNickname(
        @Query() checkNicknameQuery: CheckNicknameQuery
    ): Promise<boolean> {
        return await this.userService.checkNickname(checkNicknameQuery.nickname);
    }
}
