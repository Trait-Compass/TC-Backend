import { Module } from '@nestjs/common';
import {DataService} from "./service/data.service";
import {DataController} from "./controller/data.controller";
import {PhotoModule} from "../photo/course/photo.module";

@Module({
  imports: [],
  controllers: [DataController],
  providers: [DataService],
    exports: [DataService],
})
export class DataModule {}
