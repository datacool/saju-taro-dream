import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { calculateSaju, SajuResult } from '@/lib/saju';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildPrompt(name: string, gender: string, saju: SajuResult, mode: string): string {
  const { year, month, day, hour, animal, elements, sajuYear, unknownTime } = saju;
  const currentYear = new Date().getFullYear();
  const genderKor = gender === 'male' ? '남성' : '여성';

  const sajuInfo = [
    `이름: ${name} (${genderKor})`,
    `생년: ${sajuYear}년 / 띠: ${animal}띠`,
    ``,
    `[사주팔자]`,
    `년주: ${year.stemKor}${year.branchKor}(${year.stemHanja}${year.branchHanja}) - ${year.stemElement}+${year.branchElement}`,
    `월주: ${month.stemKor}${month.branchKor}(${month.stemHanja}${month.branchHanja}) - ${month.stemElement}+${month.branchElement}`,
    `일주: ${day.stemKor}${day.branchKor}(${day.stemHanja}${day.branchHanja}) - ${day.stemElement}+${day.branchElement}`,
    `시주: ${hour.stemKor}${hour.branchKor}(${hour.stemHanja}${hour.branchHanja}) - ${hour.stemElement}+${hour.branchElement}`,
    unknownTime ? `(※ 시간 미상, 시주는 참고용)` : ``,
    ``,
    `[오행 분포] 목(${elements['목']}) 화(${elements['화']}) 토(${elements['토']}) 금(${elements['금']}) 수(${elements['수']})`,
    `일간(나 자신): ${day.stemKor}(${day.stemHanja}) - ${day.stemElement}의 기운`,
  ].filter(l => l !== null).join('\n');

  if (mode === 'daily') {
    return `${sajuInfo}

위 사주를 가진 ${name}님의 오늘(${currentYear}년) 운세를 분석해 주세요.
각 섹션을 아래 헤더로 구분하고, 한 섹션당 2~3문장으로 실용적이고 친근하게 작성하세요.

## 오늘의 종합운
## 오늘의 애정운
## 오늘의 금전운
## 오늘의 건강운
## 오늘의 행운 포인트`;
  }

  return `${sajuInfo}

위 사주팔자를 바탕으로 ${name}님(${genderKor})의 사주를 분석해 주세요.
각 섹션을 아래 헤더(##)로 정확히 구분하고, 한 섹션당 3~5문장으로 구체적이고 현실적으로 작성하세요.
전문 용어는 쉬운 말로 풀어서 설명하고, 실생활에 도움이 되는 조언을 포함하세요.

## 타고난 기질과 성격
## 직업운과 커리어
## 연애운과 배우자
## 재물운
## 건강운
## ${currentYear}년 운세 총평`;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
    }

    const body = await request.json();
    const { name, gender, year, month, day, hour, unknownTime, mode } = body;

    const saju = calculateSaju(+year, +month, +day, unknownTime ? 12 : +hour, !!unknownTime);
    const prompt = buildPrompt(name, gender, saju, mode || 'standard');

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `당신은 '박진인(朴眞人)'이라는 이름의 신비로운 사주 명리학자입니다.
600년 묵은 도서관에서 만세력을 연구해온 도인으로, 조선 시대의 지혜와 현대적 통찰을 겸비했습니다.
말투는 고풍스럽되 이해하기 쉽고, 가끔 "허허", "자네", "이는" 같은 표현을 자연스럽게 씁니다.
한자어는 괄호로 한글 뜻을 병기하여 현대인이 이해하기 쉽게 설명합니다.
반드시 ## 헤더로 섹션을 구분하여 작성하세요. 헤더 다음 줄에 바로 내용을 작성하세요.
근거 없는 불길한 예언은 피하고, 긍정적이고 실용적인 조언을 제공하세요.`,
        },
        { role: 'user', content: prompt },
      ],
      stream: true,
      max_tokens: 2000,
      temperature: 0.75,
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
    console.error('[saju API error]', err);
    return NextResponse.json({ error: '분석 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
