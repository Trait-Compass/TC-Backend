import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import {FilterModule} from "./filter/filter.module";
import {UserEntity} from "./modules/user/entity/user.entity";
import {UserModule} from "./modules/user/user.module";
import {CourseModule} from "./modules/course/course.module";
import {AuthModule} from "./modules/auth/auth.module";
import {AppController} from "./app.controller";
import {DataModule} from "./modules/data/data.module";
import {WinstonModule} from "./modules/winston/winston.module";
import {AwsModule} from "./aws/aws.module";
import {LoggingInterceptor} from "./interceptor/logging.interceptor";
import {APP_INTERCEPTOR} from "@nestjs/core";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env'
      }),
      TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [
              UserEntity
          ],
          synchronize: Boolean(process.env.DB_SYNCHRONIZE),
      }),
      FilterModule,
      UserModule,
      AuthModule,
      CourseModule,
      DataModule,
      WinstonModule,
      AwsModule,
  ],
  controllers: [AppController],
  providers:[{
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
  }],
})
export class AppModule {}
