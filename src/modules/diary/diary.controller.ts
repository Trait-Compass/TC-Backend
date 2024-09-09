import {Body, Controller, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors} from "@nestjs/common";
import {DiaryService} from "./diary.service";
import {FilesInterceptor} from "@nestjs/platform-express";
import {DiaryRequest} from "./dto/request/diary.request";
import {ApiConsumes, ApiTags} from "@nestjs/swagger";
import {UserAuthGuard} from "../guards/auth.guard";
import {UserDetail} from "../auth/user";
import {TcUser} from "../../decorator/user.decorator";

@Controller('/diary')
@ApiTags('Diary')
@UseGuards(UserAuthGuard)
export class DiaryController {
    constructor(private readonly diaryService: DiaryService) {}

    @Post()
    @UseInterceptors(FilesInterceptor('travelPhotos', 10))
    @ApiConsumes('multipart/form-data')
    async createDiary(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() diaryRequest: DiaryRequest,
        @TcUser() userDetail: UserDetail
    ) {
        await this.diaryService.createDiary(diaryRequest,files,userDetail.id);
    }

    @Get('/list')
    async getDiaryList(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @TcUser() userDetail: UserDetail
    ) {
        return await this.diaryService.getDiaryList(userDetail.id);
    }

    @Get(':id')
    async getDiaryById(
        @Param('id') id: string,
        @TcUser() userDetail: UserDetail
    ) {
        return await this.diaryService.getDiaryById(id, userDetail.id);
    }

}
