import { Module } from '@nestjs/common';
import {CourseService} from "./service/course.service";
import {CourseController} from "./controller/course.controller";
import {PhotoModule} from "../photo/course/photo.module";

@Module({
  imports: [PhotoModule],
  controllers: [CourseController],
  providers: [CourseService],
    exports: [CourseService],
})
export class CourseModule {}
