import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';
import {MBTI} from "../../../../common/enums";

export class SignupRequest {
    @ApiProperty({
        description: '아이디 혹은 이메일',
        example: 'traitcompass@gmail.com',
    })
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty({
        description: '패스워드',
        example: 'traitcompass1!',
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        description: '닉네임',
        example: '여행가',
    })
    @IsNotEmpty()
    @IsString()
    nickname: string;

    @ApiProperty({
        description: 'mbti',
        example: 'INFP',
    })
    @IsNotEmpty()
    @IsString()
    mbti: MBTI;

    @ApiProperty({
        description: '성별 M or W',
        example: 'M',
    })
    @IsNotEmpty()
    @IsString()
    gender: string;

}
