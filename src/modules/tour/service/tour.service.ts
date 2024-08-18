import { Injectable } from '@nestjs/common';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Tour, TourDocument} from "../schema/tour.schema";

@Injectable()
export class TourService {
    constructor(
        @InjectModel(Tour.name) private touristSpotModel: Model<TourDocument>,
    ) {}

    async findByKeywords(keywords: number[]): Promise<Tour[]> {
        return this.touristSpotModel.find({ keywords: { $in: keywords } }).exec();
    }
}
