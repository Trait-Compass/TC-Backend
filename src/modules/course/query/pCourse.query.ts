import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, IsEnum, IsNotEmpty, IsString} from "class-validator";
import {Companion, Location, MBTI} from "../../../common/enums";
import {SimpleCourseQuery} from "./simpleCourse.query";

export class PcourseQuery extends SimpleCourseQuery {
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
