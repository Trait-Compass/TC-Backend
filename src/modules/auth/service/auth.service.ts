import {ForbiddenException, Injectable, UnauthorizedException} from '@nestjs/common';
import {Request} from "express";
import {JwtService} from "@nestjs/jwt";
import { UserDetail } from "../user";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
    ) {
    }
    private secret = process.env.JWT_SECRET;

    async createJwt(role: string, userId : string){
        return this.jwtService.sign(
            { role, userId },
            {
                secret: this.secret,
                expiresIn: '2h',
            },
        );
    }

    async getUser(
        req: Request,
    ): Promise<UserDetail> {
        const token = this.extractTokenFromHeader(req);

        if (!token) throw new UnauthorizedException('토큰이 없습니다');

        const user = await this.jwtService
            .verifyAsync<UserDetail>(token, {
                secret: this.secret
            })
            .catch(() => {
                throw new ForbiddenException('유효한 토큰이 아닙니다');
            });

        if (!user) throw new UnauthorizedException('유저 정보가 없습니다.');

        return user;
    }

    private extractTokenFromHeader(request: Request): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.split(' ')[1];
    }

}
