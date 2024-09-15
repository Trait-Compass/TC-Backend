import {Injectable} from '@nestjs/common';
import {Location, locationMapping, MBTI, mbtiKeywords} from "../../common/enums";
import {InjectModel} from "@nestjs/mongoose";
import {Tour, TourDocument} from "../tour/schema/tour.schema";
import {Model} from "mongoose";
import {User, UserDocument} from "../user/schema/user.schema";
import {MbtiTourListResponse} from "./dto/response/mbti-spot-list.response";
import {EMPTY} from "rxjs";

@Injectable()
export class SpotService {
    constructor(
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async getRecommandSpot(location: Location): Promise<Tour[]> {
        return this.findByCode(locationMapping[location]);
    }

    async getPopularSpot(location: Location): Promise<Tour[]> {
        return this.findByCode(locationMapping[location]);
    }

    async getMbtiSpot(userId: string): Promise<MbtiTourListResponse> {
        const user = await this.userModel.findById(userId).exec();

        if (!user.mbti || user.mbti === MBTI.EMPTY) {
            throw new Error('MBTI가 없습니다');
        }

        const keywords = mbtiKeywords[user.mbti];

        const tourList = await this.tourModel.find({ keywords: { $in: keywords } }).exec();

        return {
            mbti: user.mbti,
            tourList: tourList,
        };
    }


    async findByCode(code: number): Promise<Tour[]> {
        return this.tourModel.find({ code }).exec();
    }

}
