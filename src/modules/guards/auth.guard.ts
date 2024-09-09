import {CanActivate, ExecutionContext, ForbiddenException, Injectable,} from '@nestjs/common';
import {User} from '../user/schema/user.schema';
import {ROLE} from "../../common/enums";

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;
        if (user.role === ROLE.USER) {
            return true;
        }
        throw new ForbiddenException('권한이 없습니다.');
    }
}
