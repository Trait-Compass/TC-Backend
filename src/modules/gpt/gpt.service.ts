import {Injectable, ServiceUnavailableException} from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  constructor(private readonly openai: OpenAI) {
    this.openai = new OpenAI({
      organization: 'org-2hBClm68lIMWeMQq40Iyn9Va',
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getKeywords(url: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: '이 사진의 무드와 장소를 한글 키워드 3개로 분석해서 오직 배열로만 반환해줘. 다른 설명 없이 ["키워드1", "키워드2", "키워드3"] 형식으로 반환해.' },
              { type: 'image_url', image_url: { url, detail: 'low' } },
            ],
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      });

      const [content] = completion.choices.map((choice) => choice.message.content);

      return content;
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException('Unable to recognize image');
    }
  }

  async generateCourseNameFromKeywords(keywords: string): Promise<string> {
    try {

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: `여행지 코스 키워드: ${keywords}. 키워드를 통해 코스의 전체적인 분위기를 다른 설명 그리고 양 끝에 따음표 없이 간단하게 코스 이름을 만들어줘.` },
            ],
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      });

      const [content] = completion.choices.map((choice) => choice.message.content);

      return content;
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException('Unable to recognize image');
    }
  }
}
