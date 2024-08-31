import {Companion, Location} from "../../../common/enums";
import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsNotEmpty} from "class-validator";

export class RecommandQuery {
    @IsEnum(Location)
    @ApiProperty({
        description: '여행 장소 선택',
        enum: Location,
        example: '마산',
    })
    @IsNotEmpty()
    location: Location;
}
