import {Body, Controller, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {OauthUserService} from "../service/oauth.user.service";
import {OauthLoginRequest} from "../dto/request/oauth.login.request";

@Controller('/oauth')
@ApiTags('Oauth User')
export class OauthUserController {
    constructor(
        private readonly oauthService: OauthUserService
    ){}

    @Post('/kakao')
    async login(
        @Body() oauthLoginRequest : OauthLoginRequest,
    ): Promise<string> {
        return this.oauthService.login(oauthLoginRequest);
    }
}
