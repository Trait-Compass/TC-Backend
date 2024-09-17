import {Controller, Get, Query, UseGuards} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {RecommandQuery} from "./query/recommand.query";
import {SpotService} from "./spot.service";
import {Tour} from "../tour/schema/tour.schema";
import {TcUser} from "../../decorator/user.decorator";
import {UserDetail} from "../auth/user";
import {MbtiTourListResponse} from "./dto/response/mbti-spot-list.response";
import {UserAuthGuard} from "../guards/auth.guard";
import {TravelCourse} from "../tour/schema/course.schema";
import {DistanceQuery} from "./query/distance.query";

@Controller('/spot')
@ApiTags('Spot')
export class SpotController {
    constructor(private readonly spotService: SpotService) {}


    @ApiOperation({summary : '추천 코스/계획 - J: 추천 여행지' })
    @UseGuards(UserAuthGuard)
    @Get('/recommand')
    async getRecommandSpot(
        @Query() recommandQuery: RecommandQuery
    ): Promise<Tour[]> {
        return await this.spotService.getRecommandSpot(recommandQuery.location);
    }

    @ApiOperation({summary : '추천 코스/계획 - J: 인기 여행지' })
    @UseGuards(UserAuthGuard)
    @Get('/popular')
    async getPopularSpot(
        @Query() recommandQuery: RecommandQuery
    ): Promise<Tour[]> {
        return await this.spotService.getPopularSpot(recommandQuery.location);
    }

    @ApiOperation({summary : '추천 코스/계획 - J: MBTI 여행지' })
    @UseGuards(UserAuthGuard)
    @Get('/mbti')
    async getMbtiSpot(
        @TcUser() userDetail: UserDetail
    ): Promise<MbtiTourListResponse> {
        return await this.spotService.getMbtiSpot(userDetail.userId);
    }

    @ApiOperation({summary : '추천 코스/계획 - 두 여행지 간 소요시간 ' })
    @UseGuards(UserAuthGuard)
    @Get('/distance')
    async getDistance(
        @Query() query: DistanceQuery
    ): Promise<TravelCourse[]> {
        return await this.spotService.getDistance(query);
    }
}
