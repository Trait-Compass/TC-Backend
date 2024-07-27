import {Body, Controller, Get, HttpStatus, Post, Query, ValidationPipe} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CourseService} from "../service/course.service";
import {SimpleCourseQuery} from "../query/simpleCourse.query";
import {PhotoDto} from "../../photo/course/dto/photo.dto";

@Controller('/course')
@ApiTags('Course')
export class CourseController {
    constructor(
        private readonly courseService: CourseService
    ){}

    @Get('/simple')
    async getSimpleCourse(
        @Query() simpleCourseQuery: SimpleCourseQuery
    ): Promise<PhotoDto[]> {
        return await this.courseService.getSimpleCourse(simpleCourseQuery);
    }

    @Get('/best')
    async getBestCourse(): Promise<PhotoDto[]> {
        return await this.courseService.getBestCourse();
    }

    @Get('/festival')
    async getFestival(): Promise<PhotoDto[]> {
        return await this.courseService.getFestival();
    }
}
