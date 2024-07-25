import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, IsNotEmpty, IsString} from "class-validator";

export class SimpleCourseRequest {
    @ApiProperty({
        description: '선택한 mbti',
        example: 'ENFP',
    })
    @IsNotEmpty()
    @IsString()
    mbti: string;

    @ApiProperty({
        description: '여행 시작 날짜',
        example: '24-07-12',
    })
    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @ApiProperty({
        description: '여행 마지막 날짜',
        example: '24-07-15',
    })
    @IsNotEmpty()
    @IsDateString()
    endDate: string;
}
