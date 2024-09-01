import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, IsEnum, IsNotEmpty, IsString} from "class-validator";
import {Companion, Location, MBTI} from "../../../common/enums";

export class PcourseQuery {
    @IsEnum(MBTI)
    @ApiProperty({
        description: '선택한 mbti',
        example: 'ENFP',
        enum: MBTI,
    })
    @IsNotEmpty()
    mbti: MBTI;

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

    @IsEnum(Location)
    @ApiProperty({
        description: '여행 장소 선택',
        enum: Location,
        example: '마산',
    })
    @IsNotEmpty()
    location: Location;

    @IsEnum(Companion)
    @ApiProperty({
        description: '인원 선택',
        enum: Companion,
        example: '아이와 함께',
    })
    @IsNotEmpty()
    companion: Companion;
}
