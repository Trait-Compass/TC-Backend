import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsNotEmpty, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

class AccessToken {
    @ApiProperty({
        example: 'WDXIT44pkLblvWphVoFehbhRlKJQQlncAAAAAQopyV8AAAGR8T7gvOQ1KlcE_6bt',
        description: '엑세스 토큰',
    })
    @IsNotEmpty()
    @IsString()
    access_token!: string;

    @ApiProperty({
        example: '2024-09-15T12:55:11.209',
        description: '엑세스 토큰 만료 시간',
    })
    @IsNotEmpty()
    @IsString()
    expires_at!: string;

    @ApiProperty({
        example: '_1ve8oLDoiEUZdp4OerBeScw3QSXG1SQAAAAAgopyV8AAAGR8T7guOQ1KlcE_6bt',
        description: '리프레시 토큰',
    })
    @IsNotEmpty()
    @IsString()
    refresh_token!: string;

    @ApiProperty({
        example: '2024-11-14T00:55:11.209',
        description: '리프레시 토큰 만료 시간',
    })
    @IsNotEmpty()
    @IsString()
    refresh_token_expires_at!: string;

    @ApiProperty({
        example: ['account_email', 'profile_nickname'],
        description: '토큰에 부여된 스코프',
    })
    @IsArray()
    @IsString({ each: true })
    scopes!: string[];
}
export class OauthLoginRequest {
    @ApiProperty({
        description: '엑세스 토큰 정보',
        type: AccessToken
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AccessToken)
    accessToken!: AccessToken;

    @ApiProperty({
        example: 'kakao',
        description: 'OAuth제공사명',
    })
    @IsNotEmpty()
    @IsString()
    vendor!: string;
}
