import {Module} from '@nestjs/common';
import {TourService} from "./service/tour.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Tour, TourSchema} from "./schema/tour.schema";
import {TravelController} from "./tour.controller";
import {TravelCourse, TravelCourseSchema} from "./schema/course.schema";

@Module({
  imports: [MongooseModule.forFeature([
    { name: Tour.name, schema: TourSchema },
    { name: TravelCourse.name, schema: TravelCourseSchema },
  ])],
  controllers: [TravelController],
  providers: [TourService],
    exports: [MongooseModule],
})
export class TourModule {}
