import { Global, Module } from '@nestjs/common';
import {ApiLoggerProvider} from "./provider/api-logger.provider";

@Global()
@Module({
    providers: [ApiLoggerProvider],
    exports: [ApiLoggerProvider],
})
export class WinstonModule {}
