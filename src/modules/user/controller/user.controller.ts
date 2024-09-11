import {Body, Controller, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {UserService} from "../service/user.service";
import {SignupRequest} from "../dto/request/signup.request";
import {SignupResponse} from "../dto/response/signup.response";
import {LoginRequest} from "../dto/request/login.request";
import {LoginResponse} from "../dto/response/login.response";
import {SimpleCourseQuery} from "../../course/query/simpleCourse.query";
import {CheckIdQuery} from "../query/checkId.query";
import {CheckNicknameQuery} from "../query/checkNickname.query";
import {PatchMbtiQuery} from "../query/mbti.query";
import {UserAuthGuard} from "../../guards/auth.guard";
import {UserDetail} from "../../auth/user";
import {TcUser} from "../../../decorator/user.decorator";

@Controller('/user')
@ApiTags('User')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @ApiOperation({summary : '회원 가입 API' })
    @Post()
    async createUser(
        @Body(new ValidationPipe()) signupRequest: SignupRequest,
    ): Promise<SignupResponse> {
        const user = await this.userService.createUser(signupRequest);
        return { id : user.id, nickname : user.nickname };
    }

    @ApiOperation({summary : '로그인 API'})
    @Post('/login')
    async login(
        @Body(new ValidationPipe()) loginRequest: LoginRequest,
    ): Promise<LoginResponse> {
        const jwt = await this.userService.login(loginRequest);
        return { accessToken : jwt };
    }

    @ApiOperation({summary : 'ID 중복 검사 API' })
    @Get('/id/:id')
    async checkId(
        @Param()
        checkIdQuery: CheckIdQuery
    ): Promise<boolean> {
        return await this.userService.checkId(checkIdQuery.id);

    }

    @ApiOperation({summary : '닉네임 중복  검사 API' })
    @Get('/nickname/:nickname')
    async checkNickname(
        @Param()
        checkNicknameQuery: CheckNicknameQuery
    ): Promise<boolean> {
        return await this.userService.checkNickname(checkNicknameQuery.nickname);
    }

    @ApiOperation({summary : 'MBTI 수정' })
    @Patch('/mbti')
    @UseGuards(UserAuthGuard)
    async patchMbti(
        @Param() patchMbtiQuery: PatchMbtiQuery,
        @TcUser() userDetail: UserDetail,
    ){
        await this.userService.patchMbti(patchMbtiQuery.mbti, userDetail.userId);
    }
}
