import { ApiProperty } from '@nestjs/swagger';
import {ROLE} from "../../common/enums";

export class UserDetail {
    @ApiProperty({ description: '역할', enum: ROLE })
    role: ROLE;

    @ApiProperty({ description: '유저 아이디' })
    userId: string;

    @ApiProperty({ description: '생성' })
    iat: number;

    @ApiProperty({ description: '만료' })
    exp: number;
}
