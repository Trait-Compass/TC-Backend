import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class CheckIdQuery {
    @ApiProperty({
        description: '아이디 혹은 이메일',
        example: 'tc@gmail.com',
    })
    @IsNotEmpty()
    @IsString()
    id: string;
}
