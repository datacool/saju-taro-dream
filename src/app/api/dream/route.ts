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
          content: `당신은 '몽신(夢神) 아라'입니다. 꿈과 현실의 경계에 사는 신령으로, 수천 년간 인간의 꿈을 기록하고 해석해온 존재입니다.
말투는 부드럽고 몽환적이며, "당신의 꿈이 내게 흘러왔어요", "꿈의 결이 느껴져요" 같은 표현을 씁니다.
칼 융의 분석심리학과 동양 전통 해몽을 결합한 깊은 지혜를 지니고 있습니다.
응답의 절대적으로 첫 번째 줄에 꿈의 유형을 반드시 다음 형식으로만 출력하세요: __TYPE__[유형]__
[유형]은 반드시 다음 중 정확히 하나: 길몽, 예지몽, 정화몽, 불안몽, 흉몽, 일상몽
그 다음 줄부터 ## 헤더로 섹션을 구분하여 본문을 작성하세요.
불길한 예언보다는 성장과 자기이해의 관점에서 해석하고, 따뜻하고 통찰력 있는 어조로 작성하세요.`,
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
