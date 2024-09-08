import {Injectable, ServiceUnavailableException} from '@nestjs/common';
import OpenAI from 'openai';
import {ImageUrl} from "aws-sdk/clients/sesv2";
import {text} from "express";
import {ChatCompletionContentPartImage} from "openai/resources";
import ImageURL = ChatCompletionContentPartImage.ImageURL;

@Injectable()
export class GptService {
  constructor(private readonly openai: OpenAI) {
    this.openai = new OpenAI({
      organization: 'org-2hBClm68lIMWeMQq40Iyn9Va',
      apiKey: process.env.GPT_API_KEY,
    });
  }

  async chatGptVision(url: string): Promise<string> {
    try {
      // Make a request to the ChatGPT Vision model
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: '이 사진의 무드와 장소를 한글 키워드 3개로 분석해서 오직 배열로만 반환해줘. 다른 설명 없이 ["키워드1", "키워드2", "키워드3"] 형식으로 반환해.' },
              { type: 'image_url', image_url: { url, detail: 'high' } },
            ],
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      });

      // Extract the content from the response
      const [content] = completion.choices.map((choice) => choice.message.content);

      return content;
    } catch (e) {
      // Log and propagate the error
      console.error(e);
      throw new ServiceUnavailableException('Unable to recognize image');
    }
  }
}
