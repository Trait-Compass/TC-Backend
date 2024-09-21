import {PcourseQuery} from "./pCourse.query";
import {Companion, Keyword} from "../../../common/enums";
import {ApiProperty} from "@nestjs/swagger";
import {ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString, Length} from "class-validator";
import {Transform} from "class-transformer";

export class JcourseQuery extends PcourseQuery {
    @ApiProperty({
        description: '키워드 선택 (예: 산,놀이공원)',
        example: '산,놀이공원',
        type: String
    })
    @Transform(({ value }) => {
        if (Array.isArray(value)) {
            return value.map((item) => item.trim());
        }
        return [value.trim()];
    })
    @IsArray()
    @IsEnum(Keyword, { each: true })
    @IsNotEmpty()
    keyword: Keyword[];
}
