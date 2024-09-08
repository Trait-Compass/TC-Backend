import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {Diary, DiarySchema} from "./schema/diary.schema";
import {DiaryController} from "./diary.controller";
import {DiaryService} from "./diary.service";
import {S3} from "@aws-sdk/client-s3";

@Module({
  imports: [
      MongooseModule.forFeature([
    { name: Diary.name, schema: DiarySchema }])
  ],
  controllers: [DiaryController],
  providers: [DiaryService,S3],
    exports: [DiaryService],
})
export class DiaryModule {}
