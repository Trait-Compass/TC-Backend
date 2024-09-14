import { Module } from '@nestjs/common';
import {SpotService} from "./spot.service";
import {SpotController} from "./spot.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {Tour, TourSchema} from "../tour/schema/tour.schema";
import {User, UserSchema} from "../user/schema/user.schema";

@Module({
  imports: [MongooseModule.forFeature([
        { name: Tour.name, schema: TourSchema },
        { name: User.name, schema: UserSchema }
  ])],
  controllers: [SpotController],
  providers: [SpotService],
    exports: [SpotService],
})
export class SpotModule {}
