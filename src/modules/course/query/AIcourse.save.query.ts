import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class AIcourseSaveQuery {
    @IsString()
    @ApiProperty({
        description: '코스 아이디',
        example: '66cf270e0a5e485aeae7d647',
        type: String
    })
    @IsNotEmpty()
    id: string;
}
