import { Module } from '@nestjs/common';
import {UserService} from "./service/user.service";
import {UserController} from "./controller/user.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entity/user.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
      TypeOrmModule.forFeature(
      [UserEntity]
  ),
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
