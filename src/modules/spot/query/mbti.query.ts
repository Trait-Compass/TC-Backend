import {IsEnum, IsNotEmpty} from "class-validator";
import {Location, MBTI} from "../../../common/enums";
import {ApiProperty} from "@nestjs/swagger";

export class MbtiQuery {
    @IsEnum(MBTI)
    @ApiProperty({
        description: 'mbti',
        enum: MBTI,
        example: 'ENFP',
    })
    @IsNotEmpty()
    mbti: MBTI;
}
