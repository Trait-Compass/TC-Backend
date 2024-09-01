import {Body, Controller, Get, HttpStatus, Post, Query, ValidationPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {CourseService} from "../service/course.service";
import {SimpleCourseQuery} from "../query/simpleCourse.query";
import {PhotoDto} from "../../photo/course/dto/photo.dto";
import {PcourseQuery} from "../query/pCourse.query";
import {JcourseQuery} from "../query/jCourse.query";
import {Tour} from "../../tour/schema/tour.schema";
import {TravelCourse} from "../../tour/schema/course.schema";

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
    ): Promise<TravelCourse[]> {
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

    @ApiOperation({summary : '여행 일정: P형 API' })
    @Get('/p')
    async getPcourse(
        @Query() pCourseQuery: PcourseQuery
    ): Promise<Tour[]> {
        return await this.courseService.getPcourse(pCourseQuery);
    }

    @ApiOperation({summary : '여행 일정: J형 API' })
    @Get('/j')
    async getJcourse(
        @Query() jCourseQuery: JcourseQuery
    ): Promise<Tour[]> {
        return await this.courseService.getJcourse(jCourseQuery);
    }
}
