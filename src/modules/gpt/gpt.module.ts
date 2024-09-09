import { Global, Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import OpenAI from 'openai';

@Global()
@Module({
  imports: [],
  providers: [GptService, OpenAI],
  exports: [GptService],
})
export class GptModule {}
