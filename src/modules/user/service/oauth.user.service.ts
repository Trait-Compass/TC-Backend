import {BadRequestException, Injectable} from '@nestjs/common';
import axios from "axios";
import {AuthService} from "../../auth/service/auth.service";
import {UserService} from "./user.service";
import {MBTI, ROLE} from "../../../common/enums";
import {OauthLoginRequest} from "../dto/request/oauth.login.request";

@Injectable()
export class OauthUserService {
    constructor(
        private readonly jwtService: AuthService,
        private readonly userService: UserService
    ) {
    }

    async login(oauthLoginRequest: OauthLoginRequest): Promise<string> {
        let userId;
        switch (oauthLoginRequest.vendor) {
            case 'kakao': {
                userId = await this.getUserByKakaoAccessToken(oauthLoginRequest.accessToken);
                break;
            }
            default: {
                throw new BadRequestException("소셜로그인 선택 실패");
            }
        }

        return await this.jwtService.createJwt(ROLE.USER, userId);
    }

    async getUserByKakaoAccessToken(accessToken: string): Promise<string> {

        const kakaoUser = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!kakaoUser) throw new BadRequestException("카카오 로그인 실패");

        const user = await this.userService.findByTcId(kakaoUser.data.id);

        if (!user) {
            const newUser = await this.userService.createUser({
                id: kakaoUser.data.kakao_account.email,
                password: "",
                isOauth: true,
                nickname: kakaoUser.data.kakao_account.profile.nickname,
                mbti: MBTI.EMPTY
            });
            return newUser.id;
        }

        return user.id;
    }
}

