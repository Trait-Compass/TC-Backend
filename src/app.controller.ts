import { Controller, Get } from '@nestjs/common';
import {ApiOperation} from "@nestjs/swagger";

@Controller()
export class AppController {
    @ApiOperation({summary : '서버 health 확인 API' })
    @Get()
    healthCheck(): string {
        return 'healthy'
    }
}
