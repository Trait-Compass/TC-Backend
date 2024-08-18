import {Module} from '@nestjs/common';
import {TourService} from "./service/tour.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Tour, TourSchema} from "./schema/tour.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }])],
  controllers: [],
  providers: [TourService],
    exports: [MongooseModule],
})
export class TourModule {}
