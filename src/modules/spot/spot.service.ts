import {Injectable} from '@nestjs/common';
import {Location, locationMapping, MBTI, mbtiKeywords} from "../../common/enums";
import {InjectModel} from "@nestjs/mongoose";
import {Tour, TourDocument} from "../tour/schema/tour.schema";
import {Model} from "mongoose";

@Injectable()
export class SpotService {
    constructor(
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    ) {}

    async getRecommandSpot(location: Location): Promise<Tour[]> {
        return this.findByCode(locationMapping[location]);
    }

    async getPopularSpot(location: Location): Promise<Tour[]> {
        return this.findByCode(locationMapping[location]);
    }

    async getMbtiSpot(mbti: MBTI): Promise<Tour[]> {
        const keywords = mbtiKeywords[mbti];
        return this.tourModel.find({ keywords: { $in: keywords } }).exec();

    }

    async findByCode(code: number): Promise<Tour[]> {
        return this.tourModel.find({ code }).exec();
    }

}
