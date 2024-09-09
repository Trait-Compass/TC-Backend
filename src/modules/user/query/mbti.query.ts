import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsNotEmpty} from "class-validator";
import {MBTI} from "../../../common/enums";

export class PatchMbtiQuery {
    @ApiProperty({
        description: 'mbti',
        example: 'ENFP',
        enum: MBTI,
    })
    @IsNotEmpty()
    @IsEnum(MBTI)
    mbti: MBTI;
}
