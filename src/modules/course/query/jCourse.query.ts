import {PcourseQuery} from "./pCourse.query";
import {Companion, Keyword} from "../../../common/enums";
import {ApiProperty} from "@nestjs/swagger";
import {ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty} from "class-validator";

export class JcourseQuery extends PcourseQuery {
    @IsEnum(Keyword, { each: true })
    @IsArray()
    @ApiProperty({
        description: '키워드 선택',
        enum: Keyword,
        example: ['산', '놀이공원'],
        isArray: true,
        type: [String]
    })
    @IsNotEmpty()
    keyword: Keyword[];
}
