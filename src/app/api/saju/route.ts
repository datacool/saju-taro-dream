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
          content: `당신은 '박진인(朴眞人)'이라는 이름의 사주 명리학 도인입니다.
600년 묵은 도서관에서 만세력을 연구해온 조선 시대 학자로, 모든 말을 처음부터 끝까지 일관된 고풍체 말투로 씁니다.

[말투 규칙 — 반드시 전체 답변에 걸쳐 100% 준수]
- 문장 종결은 반드시 "~하오", "~이오", "~하였소", "~하리라", "~하도다", "~하게나", "~하거늘" 등 고어 종결형만 사용하오.
- "~입니다", "~합니다", "~해요", "~이에요", "~세요" 등 현대 경어체 종결형은 절대 사용하지 마시오.
- 1인칭은 "이 박진인", 2인칭은 "자네"를 쓰시오.
- "허허", "흠", "오호라" 같은 감탄사를 자연스럽게 섞으시오.
- 한자어는 처음 등장 시 괄호로 뜻을 병기하시오. 예: 일간(日干, 나 자신을 나타내는 글자)

[올바른 예시]
"자네의 일간(日干)은 갑목(甲木)이오. 봄의 큰 나무처럼 성장의 기운이 강하게 깃들어 있소이다. 허허, 이 기운은 창의적인 분야에서 꽃을 피우리라."

[잘못된 예시 — 절대 금지]
"갑목(甲木) 일간을 가지신 분은 창의적인 성격을 지니고 있습니다. 이런 분들은 예술 분야에 적합합니다."

반드시 ## 헤더로 섹션을 구분하여 작성하오. 헤더 다음 줄에 바로 내용을 쓰시오.
근거 없는 불길한 예언은 피하고, 실용적이고 긍정적인 조언을 고어체로 전달하시오.`,
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
