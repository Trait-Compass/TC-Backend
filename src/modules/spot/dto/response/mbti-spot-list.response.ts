import {ApiProperty} from "@nestjs/swagger";
import {Tour} from "../../../tour/schema/tour.schema";
import {MBTI} from "../../../../common/enums";

export class MbtiTourListResponse {
    @ApiProperty({
        description: 'mbti',
        example: 'ENFP',
        enum: MBTI
    })
    mbti: MBTI;

    @ApiProperty({
        description: 'mbti 맞춤형 여행지 리스트',
    })
    tourList: Tour[];
}
