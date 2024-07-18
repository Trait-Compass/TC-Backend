import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class LoginRequest {
    @ApiProperty({
        description: '아이디 혹은 이메일',
        example: 'traitcompass@gmail.com',
    })
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty({
        description: '비밀번호',
        example: 'traitcompass1!',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
