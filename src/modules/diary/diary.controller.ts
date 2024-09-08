import {Body, Controller, Post, UploadedFiles, UseInterceptors} from "@nestjs/common";
import {DiaryService} from "./diary.service";
import {FilesInterceptor} from "@nestjs/platform-express";
import {DiaryRequest} from "./dto/request/diary.request";
import {ApiConsumes, ApiTags} from "@nestjs/swagger";

@Controller('/diary')
@ApiTags('Diary')
export class DiaryController {
    constructor(private readonly diaryService: DiaryService) {}

    @Post()
    @UseInterceptors(FilesInterceptor('travelPhotos', 10))
    @ApiConsumes('multipart/form-data')
    async createDiary(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() diaryRequest: DiaryRequest
    ) {
        await this.diaryService.createDiary(diaryRequest,files,'1');
    }

}
