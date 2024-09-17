import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, IsEnum, IsNotEmpty, IsString} from "class-validator";
import {MBTI} from "../../../common/enums";

export class SimpleCourseQuery {
    @IsEnum(MBTI)
    @ApiProperty({
        description: '선택한 mbti',
        example: 'ENFP',
        enum: MBTI
    })
    @IsNotEmpty()
    @IsString()
    mbti: MBTI;

    @ApiProperty({
        description: '여행 시작 날짜',
        example: '2024-09-18T17:34:02.666Z',
    })
    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @ApiProperty({
        description: '여행 마지막 날짜',
        example: '2024-09-19T17:34:02.666Z',
    })
    @IsNotEmpty()
    @IsDateString()
    endDate: string;
}
