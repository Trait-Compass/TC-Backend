import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class LoginResponse {
    @ApiProperty({
        description: '토큰',
        example: 'Bearer oekieoijfwpeadklmc0dcasdjkcasdladkslmcdl',
    })
    accessToken: string;
}
