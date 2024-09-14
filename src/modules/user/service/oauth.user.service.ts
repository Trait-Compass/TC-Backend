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
                userId = await this.getUserByKakaoAccessToken(oauthLoginRequest.accessToken.access_token);
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

        if (!kakaoUser) {
            throw new BadRequestException('카카오 로그인 실패');
        }

        const kakaoEmail = kakaoUser.data.kakao_account.email;
        const kakaoNickname = kakaoUser.data.kakao_account.profile.nickname;

        // Step 2: Check if the user exists by Kakao email (acting as tcId)
        let user = await this.userService.findByTcId(kakaoEmail);

        // Step 3: If user doesn't exist, create a new OAuth user
        if (!user) {
            const newUser = await this.userService.createUser({
                id: kakaoEmail,
                password: 'kakao',
                isOauth: true,
                nickname: kakaoNickname,
                mbti: MBTI.EMPTY,
            });
            user = await this.userService.findByTcId(kakaoEmail);
        }

        return user.id;
    }
}

