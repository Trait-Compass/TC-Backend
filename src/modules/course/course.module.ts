import { Module } from '@nestjs/common';
import {CourseService} from "./service/course.service";
import {CourseController} from "./controller/course.controller";
import {PhotoModule} from "../photo/course/photo.module";
import {MongooseModule} from "@nestjs/mongoose";
import {Tour, TourSchema} from "../tour/schema/tour.schema";
import {TravelCourse, TravelCourseSchema} from "../tour/schema/course.schema";
import {User, UserSchema} from "../user/schema/user.schema";
import {GptService} from "../gpt/gpt.service";
import OpenAI from "openai";

@Module({
  imports: [PhotoModule, MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Tour.name, schema: TourSchema },
    { name: TravelCourse.name, schema: TravelCourseSchema }])],
  controllers: [CourseController],
  providers: [CourseService, GptService, OpenAI],
    exports: [CourseService],
})
export class CourseModule {}
