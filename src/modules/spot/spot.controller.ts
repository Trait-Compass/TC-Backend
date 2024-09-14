import {Controller, Get, Query} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {RecommandQuery} from "./query/recommand.query";
import {SpotService} from "./spot.service";
import {Tour} from "../tour/schema/tour.schema";
import {TcUser} from "../../decorator/user.decorator";
import {UserDetail} from "../auth/user";
import {MbtiTourListResponse} from "./dto/response/mbti-spot-list.response";

@Controller('/spot')
@ApiTags('Spot')
export class SpotController {
    constructor(private readonly spotService: SpotService) {}
    @ApiOperation({summary : '추천 코스/계획 - J: 추천 여행지' })
    @Get('/recommand')
    async getRecommandSpot(
        @Query() recommandQuery: RecommandQuery
    ): Promise<Tour[]> {
        return await this.spotService.getRecommandSpot(recommandQuery.location);
    }

    @ApiOperation({summary : '추천 코스/계획 - J: 인기 여행지' })
    @Get('/popular')
    async getPopularSpot(
        @Query() recommandQuery: RecommandQuery
    ): Promise<Tour[]> {
        return await this.spotService.getPopularSpot(recommandQuery.location);
    }

    @ApiOperation({summary : '추천 코스/계획 - J: MBTI 여행지' })
    @Get('/mbti')
    async getMbtiSpot(
        @TcUser() userDetail: UserDetail
    ): Promise<MbtiTourListResponse> {
        return await this.spotService.getMbtiSpot(userDetail.userId);
    }
}
