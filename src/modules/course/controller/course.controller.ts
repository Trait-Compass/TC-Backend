import {Body, Controller, Get, HttpStatus, Post, Query, ValidationPipe} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CourseService} from "../service/course.service";
import {SimpleCourseRequest} from "../dto/request/simpleCourse.request";
import {PhotoDto} from "../../photo/course/dto/photo.dto";

@Controller('/course')
@ApiTags('Course')
export class CourseController {
    constructor(
        private readonly courseService: CourseService
    ){}

    @Get('/simple')
    async getSimpleCourse(
        @Query() simpleCourseRequest: SimpleCourseRequest
    ): Promise<PhotoDto[]> {
        return await this.courseService.getSimpleCourse(simpleCourseRequest);
    }

    @Get('/festival')
    async getFestival(): Promise<PhotoDto[]> {
        return await this.courseService.getFestival();
    }
}
