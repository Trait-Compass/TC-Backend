import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsNotEmpty} from "class-validator";
import {MBTI} from "../../../common/enums";

export class PatchProfileQuery {
    @ApiProperty({
        description: 'mbti',
        example: 'ENFP',
        enum: MBTI,
    })
    @IsNotEmpty()
    @IsEnum(MBTI)
    mbti: MBTI;

    @ApiProperty({
        description: '닉네임',
        example: 'travler',
    })
    @IsNotEmpty()
    nickname: string;
}
