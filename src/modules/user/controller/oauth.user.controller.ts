import {Body, Controller, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {OauthUserService} from "../service/oauth.user.service";
import {OauthLoginRequest} from "../dto/request/oauth.login.request";

@Controller('/oauth')
@ApiTags('Oauth User')
export class OauthUserController {
    constructor(
        private readonly oauthService: OauthUserService
    ){}

    @ApiOperation({summary : '카카오 콜백 API', description : '발급된 카카오 엑세스 토큰을 받아 로그인 및 회원가입' })
    @Post('/kakao')
    async login(
        @Body() oauthLoginRequest : OauthLoginRequest,
    ): Promise<string> {
        return this.oauthService.login(oauthLoginRequest);
    }
}
