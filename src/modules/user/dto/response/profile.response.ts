import {ApiProperty} from "@nestjs/swagger";
import {MBTI} from "../../../../common/enums";

export class UserProfileResponse {
    @ApiProperty({
        description: '닉네임',
        example: 'traveler',
    })
    nickname: string;

    @ApiProperty({
        description: '유저 mbti',
        example: 'ENFP',
    })
    mbti: MBTI;

    @ApiProperty({
        description: 'mbti 설명',
        example: '["지적 호기심을 만족시키기 위해 여행하는 타입", "역사적이거나 과학적인 장소를 선호"]',
    })
    mbtiDescription: string[];

    @ApiProperty({
        description: 'mbti 궁합',
        example: '["ESFP","ENFP"]',
    })
    mbtiMatchups: { chalTeok: MBTI, hwanJang: MBTI };
}
