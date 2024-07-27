import {Body, Controller, Get, HttpStatus, Post, Query, ValidationPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {CourseService} from "../service/course.service";
import {SimpleCourseQuery} from "../query/simpleCourse.query";
import {PhotoDto} from "../../photo/course/dto/photo.dto";

@Controller('/course')
@ApiTags('Course')
export class CourseController {
    constructor(
        private readonly courseService: CourseService
    ){}

    @ApiOperation({summary : 'mbti 맞춤형 코스 API', description : '코스 4가지 추천' })
    @Get('/simple')
    async getSimpleCourse(
        @Query() simpleCourseQuery: SimpleCourseQuery
    ): Promise<PhotoDto[]> {
        return await this.courseService.getSimpleCourse(simpleCourseQuery);
    }

    @ApiOperation({summary : '인기 코스 API' })
    @Get('/best')
    async getBestCourse(): Promise<PhotoDto[]> {
        return await this.courseService.getBestCourse();
    }

    @ApiOperation({summary : '축제 API' })
    @Get('/festival')
    async getFestival(): Promise<PhotoDto[]> {
        return await this.courseService.getFestival();
    }
}
