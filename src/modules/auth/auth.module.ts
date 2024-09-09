import { Module } from '@nestjs/common';
import {AuthService} from "./service/auth.service";
import {JwtService} from "@nestjs/jwt";

@Module({
  imports: [],
  controllers: [],
  providers: [AuthService,JwtService],
    exports: [AuthService],
})
export class AuthModule {}
