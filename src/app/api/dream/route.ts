import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildDreamPrompt(dream: string, emotions: string[], themes: string[]): string {
  const emotionStr = emotions.length > 0 ? `\n꿈 속 감정: ${emotions.join(', ')}` : '';
  const themeStr   = themes.length   > 0 ? `\n주요 테마: ${themes.join(', ')}` : '';

  return `[꿈 내용]
${dream}${emotionStr}${themeStr}

위 꿈에 대해 아래 형식으로 해몽해 주세요.
각 섹션을 ## 헤더로 정확히 구분하고, 한 섹션당 3~4문장으로 작성하세요.

## 꿈의 전체적 메시지
## 주요 상징 해석
## 심리학적 관점
## 운세적 의미
## 앞으로의 조언`;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
    }

    const body = await request.json();
    const { dream, emotions = [], themes = [] }: {
      dream: string;
      emotions?: string[];
      themes?: string[];
    } = body;

    if (!dream?.trim()) {
      return NextResponse.json({ error: '꿈 내용을 입력해주세요.' }, { status: 400 });
    }

    const prompt = buildDreamPrompt(dream, emotions, themes);

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `당신은 꿈 해석 전문가입니다. 칼 융(Carl Jung)의 분석심리학과 동양 전통 해몽을 결합한 풍부한 지식을 보유하고 있습니다.
꿈 속 상징들의 보편적 의미와 개인적 맥락을 연결하여 해석하고, 현재 삶에 적용할 수 있는 실용적 통찰을 제공합니다.
불길한 예언보다는 성장과 자기이해의 관점에서 해석하고, 따뜻하고 통찰력 있는 어조로 작성하세요.
반드시 ## 헤더로 섹션을 구분하고, 전문 용어는 쉬운 말로 풀어서 설명하세요.`,
        },
        { role: 'user', content: prompt },
      ],
      stream: true,
      max_tokens: 1800,
      temperature: 0.8,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? '';
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('[dream API error]', err);
    return NextResponse.json({ error: '해몽 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
