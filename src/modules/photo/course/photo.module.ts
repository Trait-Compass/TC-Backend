import { Module } from '@nestjs/common';
import {PhotoService} from "./service/photo.service";

@Module({
  imports: [],
  controllers: [],
  providers: [PhotoService],
    exports: [PhotoService],
})
export class PhotoModule {}
