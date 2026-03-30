import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { formatCardsForPrompt, type DrawnCard } from '@/lib/tarot';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildTarotPrompt(question: string, cards: DrawnCard[]): string {
  return `[질문]
${question}

[뽑힌 카드 - 3카드 스프레드]
${formatCardsForPrompt(cards)}

위 카드들을 바탕으로 질문에 대한 타로 리딩을 해주세요.
아래 형식을 엄격히 따르고, 각 섹션을 ## 헤더로 구분하세요.

## 전체적인 메시지
## 상황 카드: ${cards[0]?.nameKor} 해석
## 조언 카드: ${cards[1]?.nameKor} 해석
## 결과 카드: ${cards[2]?.nameKor} 해석
## 종합 조언과 앞으로의 방향`;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
    }

    const body = await request.json();
    const { question, cards }: { question: string; cards: DrawnCard[] } = body;

    if (!question?.trim() || !Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json({ error: '질문 또는 카드 정보가 없습니다.' }, { status: 400 });
    }

    const prompt = buildTarotPrompt(question, cards);

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `당신은 20년 경력의 타로 리더입니다. 라이더-웨이트 타로 전통에 깊은 지식을 가지고 있으며,
카드의 상징과 신화적 의미를 현실 상황에 연결하여 실용적인 통찰을 제공합니다.
각 카드의 에너지를 질문자의 상황과 연결하여 스토리텔링 방식으로 해석하세요.
부정적인 카드도 성장의 관점에서 해석하고, 건설적인 조언을 포함하세요.
반드시 ## 헤더로 섹션을 구분하고, 각 섹션은 3~4문장으로 작성하세요.`,
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
    console.error('[tarot API error]', err);
    return NextResponse.json({ error: '해석 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
