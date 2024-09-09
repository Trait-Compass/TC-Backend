import { Module } from '@nestjs/common';
import {UserService} from "./service/user.service";
import {UserController} from "./controller/user.controller";
import {AuthModule} from "../auth/auth.module";
import {OauthUserController} from "./controller/oauth.user.controller";
import {OauthUserService} from "./service/oauth.user.service";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./schema/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
      AuthModule
  ],
  controllers: [UserController,OauthUserController],
  providers: [UserService,OauthUserService],
    exports: [UserService,OauthUserService],
})
export class UserModule {}
