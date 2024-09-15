import {Controller, Get, Post, Query, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {CourseService} from "../service/course.service";
import {SimpleCourseQuery} from "../query/simpleCourse.query";
import {PhotoDto} from "../../photo/course/dto/photo.dto";
import {PcourseQuery} from "../query/pCourse.query";
import {JcourseQuery} from "../query/jCourse.query";
import {Tour} from "../../tour/schema/tour.schema";
import {TravelCourse} from "../../tour/schema/course.schema";
import {UserAuthGuard} from "../../guards/auth.guard";
import {TcUser} from "../../../decorator/user.decorator";
import {UserDetail} from "../../auth/user";
import {CourseSaveQuery} from "../query/course-save.query";

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

    @UseGuards(UserAuthGuard)
    @ApiOperation({summary : '여행 일정: P형 API' })
    @Get('/p')
    async getPcourse(
        @Query() pCourseQuery: PcourseQuery
    ): Promise<TravelCourse[]> {
        return await this.courseService.getPcourse(pCourseQuery);
    }

    @UseGuards(UserAuthGuard)
    @ApiOperation({summary : '여행 일정: J형 API' })
    @Get('/j')
    async getJcourse(
        @Query() jCourseQuery: JcourseQuery
    ): Promise<Tour[]> {
        return await this.courseService.getJcourse(jCourseQuery);
    }

    @UseGuards(UserAuthGuard)
    @ApiOperation({summary : '여행 일정: J/P형 코스 저장 API' })
    @Post()
    async saveCourse(
        @Query() query: CourseSaveQuery,
        @TcUser() userDetail: UserDetail
    ): Promise<boolean> {
        return await this.courseService.saveCourse(query,userDetail.userId);
    }

    @UseGuards(UserAuthGuard)
    @ApiOperation({summary : '마이페이지: 코스 조회 API' })
    @Get('/my')
    async getMycourses(
        @TcUser() userDetail: UserDetail
    ): Promise<TravelCourse[]> {
        return await this.courseService.getMycourses(userDetail.userId);
    }
}
