import {Controller, Get, Query} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {PhotoDto} from "../photo/course/dto/photo.dto";
import {RecommandQuery} from "./query/recommand.query";
import {JcourseQuery} from "../course/query/jCourse.query";
import {ExcelService} from "../exel/exel.service";
import {SpotService} from "./spot.service";
import {MbtiQuery} from "./query/mbti.query";
import {Tour} from "../tour/schema/tour.schema";

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
        @Query() mbtiQuery: MbtiQuery
    ): Promise<Tour[]> {
        return await this.spotService.getMbtiSpot(mbtiQuery.mbti);
    }
}
