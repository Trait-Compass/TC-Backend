import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import {FilterModule} from "./filter/filter.module";
import {UserEntity} from "./modules/user/entity/user.entity";
import {UserModule} from "./modules/user/user.module";
import {CourseModule} from "./modules/course/course.module";
import {AuthModule} from "./modules/auth/auth.module";
import {AppController} from "./app.controller";

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
      CourseModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
