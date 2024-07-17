import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import {FilterModule} from "./filter/filter.module";

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
          entities: [],
          synchronize: true,
      }),
      FilterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
