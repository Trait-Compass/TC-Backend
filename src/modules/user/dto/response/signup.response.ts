import {ApiProperty} from "@nestjs/swagger";

export class SignupResponse {
    @ApiProperty({
        description: '아이디 혹은 이메일',
        example: 'traitcompass@gmail.com',
    })
    id: string;

    @ApiProperty({
        description: '닉네임',
        example: '여행가',
    })
    nickname: string;
}
