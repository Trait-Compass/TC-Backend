import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import {FilterModule} from "./filter/filter.module";
import {UserEntity} from "./modules/user/entity/user.entity";
import {UserController} from "./modules/user/controller/user.controller";
import {UserModule} from "./modules/user/user.module";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath:
              process.env.NODE_ENV === 'prod'
                  ? '.prod.env'
                  : '.local.env',
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
          synchronize: true,
      }),
      FilterModule,
      UserModule
  ],
  controllers: [
      AppController
  ],
  providers: [AppService],
})
export class AppModule {}
