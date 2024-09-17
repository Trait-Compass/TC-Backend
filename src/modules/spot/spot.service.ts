import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Location, locationMapping, MBTI, mbtiKeywords} from "../../common/enums";
import {InjectModel} from "@nestjs/mongoose";
import {Tour, TourDocument} from "../tour/schema/tour.schema";
import {Model} from "mongoose";
import {User, UserDocument} from "../user/schema/user.schema";
import {MbtiTourListResponse} from "./dto/response/mbti-spot-list.response";
import {DistanceQuery} from "./query/distance.query";
import axios from "axios";

@Injectable()
export class SpotService {
    constructor(
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    kakaoCarNaviUrl = 'https://apis-navi.kakaomobility.com/v1/waypoints/directions';

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

    async getDistance(query: DistanceQuery): Promise<any> {
        const { startMapX, startMapY, endtMapX, endMapY } = query;

        const headers = {
            'Authorization': `KakaoAK ${process.env.KAKAO_KEY}`,
            'Content-Type': 'application/json',
        };

        // Request payload for the Kakao API
        const data = {
            origin: { x: startMapX, y: startMapY },
            destination: { x: endtMapX, y: endMapY },
            waypoints: [],
            priority: 'RECOMMEND',
            car_fuel: 'GASOLINE',
            car_hipass: false,
            alternatives: false,
            road_details: false,
        };

        let carResult, walkingResult, transitResult;

        // First, handle car route
        try {
            const response1 = await axios.post(this.kakaoCarNaviUrl, data, { headers });
            carResult = response1.data;

            const carTime = carResult.routes[0]?.summary?.duration;
            const carDistance = carResult.routes[0]?.summary?.distance;

            const walkingTime = carDistance / 1.29;

            const formattedCarDistance = this.formatDistance(carDistance);
            const formattedCarTime = this.formatTime(carTime);
            const formattedWalkingTime = this.formatTime(walkingTime);

            return {
                distance: formattedCarDistance,
                carTime: formattedCarTime,
                walkTime: formattedWalkingTime,
            };
        } catch (error) {
            throw new Error('카카오 내비 길찾기 api 오류');
        }
    }

    formatTime(seconds: number): string {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (h === 0 && m === 0) {
            return `${s}초`;
        }
        return `${h > 0 ? h + '시간 ' : ''}${m > 0 ? m + '분 ' : ''}`.trim();
    }

    formatDistance(meters: number): string {
        if (meters >= 1000) {
            return (meters / 1000).toFixed(1) + ' km';
        } else {
            return meters + ' m';
        }
    }




}
