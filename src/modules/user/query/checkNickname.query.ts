import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class CheckNicknameQuery {
    @ApiProperty({
        description: '닉네임',
        example: 'travler03',
    })
    @IsNotEmpty()
    @IsString()
    nickname: string;
}
