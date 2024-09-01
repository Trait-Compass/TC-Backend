import { Module } from '@nestjs/common';
import {CourseService} from "./service/course.service";
import {CourseController} from "./controller/course.controller";
import {PhotoModule} from "../photo/course/photo.module";
import {MongooseModule} from "@nestjs/mongoose";
import {Tour, TourSchema} from "../tour/schema/tour.schema";
import {TravelCourse, TravelCourseSchema} from "../tour/schema/course.schema";

@Module({
  imports: [PhotoModule, MongooseModule.forFeature([
    { name: Tour.name, schema: TourSchema },
    { name: TravelCourse.name, schema: TravelCourseSchema }])],
  controllers: [CourseController],
  providers: [CourseService],
    exports: [CourseService],
})
export class CourseModule {}
