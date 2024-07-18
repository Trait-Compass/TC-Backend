import {Injectable} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {HttpError} from "../../../common/exception/HttpError";
import { TokenExpiredError } from 'jsonwebtoken';
import * as util from "node:util";

@Injectable()
export class AuthService {
    private secret = process.env.JWT_SECRET;

    async createJwt(role: string, userId : string){
        return await util.promisify(jwt.sign)(
            {
                rol: role,
                usr: userId || 'none',
            },
            this.secret, // Use the single secret
            {
                algorithm: 'HS256',
                expiresIn: '7 days',
            },
        );
    }

    verify(
        token: string,
    ): { role: any; usr: any } {
        try {
            const result = jwt.verify(token, this.secret, {
                algorithms: 'HS256',
            });
            return {
                role: result.rol,
                usr: result.usr || 'none',
            };
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new HttpError(401, 'TOKEN_EXPIRED', '만료된 토큰입니다.');
            }
            return undefined;
        }
    }
}
