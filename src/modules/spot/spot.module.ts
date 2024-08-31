import { Module } from '@nestjs/common';
import {SpotService} from "./spot.service";
import {SpotController} from "./spot.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {Tour, TourSchema} from "../tour/schema/tour.schema";
import {TravelCourse, TravelCourseSchema} from "../tour/schema/course.schema";

@Module({
  imports: [MongooseModule.forFeature([
        { name: Tour.name, schema: TourSchema }])],
  controllers: [SpotController],
  providers: [SpotService],
    exports: [SpotService],
})
export class SpotModule {}
