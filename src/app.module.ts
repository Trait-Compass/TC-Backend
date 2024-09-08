import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import {FilterModule} from "./filter/filter.module";
import {UserModule} from "./modules/user/user.module";
import {CourseModule} from "./modules/course/course.module";
import {AuthModule} from "./modules/auth/auth.module";
import {AppController} from "./app.controller";
import {DataModule} from "./modules/data/data.module";
import {WinstonModule} from "./modules/winston/winston.module";
import {AwsModule} from "./aws/aws.module";
import {LoggingInterceptor} from "./interceptor/logging.interceptor";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {MongooseModule} from "@nestjs/mongoose";
import {ExelModule} from "./modules/exel/exel.module";
import {TourModule} from "./modules/tour/tour.module";
import {SpotModule} from "./modules/spot/spot.module";
import {DiaryModule} from "./modules/diary/diary.module";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env'
      }),
      MongooseModule.forRoot(process.env.MONGODB_URL),
      FilterModule,
      UserModule,
      AuthModule,
      CourseModule,
      DataModule,
      WinstonModule,
      AwsModule,
      ExelModule,
      TourModule,
      SpotModule,
      DiaryModule,
  ],
  controllers: [AppController],
  providers:[{
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
  }],
})
export class AppModule {}
