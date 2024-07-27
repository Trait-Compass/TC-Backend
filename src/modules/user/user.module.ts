import { Module } from '@nestjs/common';
import {UserService} from "./service/user.service";
import {UserController} from "./controller/user.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entity/user.entity";
import {AuthModule} from "../auth/auth.module";
import {OauthUserController} from "./controller/oauth.user.controller";
import {OauthUserService} from "./service/oauth.user.service";

@Module({
  imports: [
      TypeOrmModule.forFeature(
      [UserEntity]
  ),
      AuthModule
  ],
  controllers: [UserController,OauthUserController],
  providers: [UserService,OauthUserService],
    exports: [UserService,OauthUserService],
})
export class UserModule {}
