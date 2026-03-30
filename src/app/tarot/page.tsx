'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { drawCards, formatCardsForPrompt, type DrawnCard } from '@/lib/tarot';

type Step = 'input' | 'cards' | 'result';

const SUIT_LABELS: Record<string, string> = {
  major: '대아르카나',
  wands: '완드',
  cups: '컵',
  swords: '소드',
  pentacles: '펜타클',
};

const SUIT_COLORS: Record<string, string> = {
  major: 'text-violet-300 border-violet-500/40 bg-violet-600/15',
  wands: 'text-orange-300 border-orange-500/40 bg-orange-600/15',
  cups: 'text-blue-300 border-blue-500/40 bg-blue-600/15',
  swords: 'text-gray-300 border-gray-500/40 bg-gray-600/15',
  pentacles: 'text-green-300 border-green-500/40 bg-green-600/15',
};

const POSITION_DESC: Record<string, string> = {
  '상황': '현재 당신이 처한 상황을 나타냅니다',
  '조언': '앞으로 나아갈 방향과 조언을 담고 있습니다',
  '결과': '이 상황이 이끄는 결과와 가능성을 보여줍니다',
};

function TarotCardDisplay({ card, flipped }: { card: DrawnCard; flipped: boolean }) {
  const suitColor = SUIT_COLORS[card.suit] ?? 'text-violet-300 border-violet-500/40 bg-violet-600/15';

  return (
    <div className="card-3d" style={{ height: '220px' }}>
      <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
        {/* 뒷면 */}
        <div className="card-face border border-amber-500/30 bg-[#0B1326] flex flex-col items-center justify-center h-full rounded-sm">
          <div className="text-4xl text-amber-400/60 mb-2 glow-gold-sm">✦</div>
          <div className="w-12 h-12 border border-amber-500/20 rotate-45 flex items-center justify-center">
            <div className="text-amber-400/40 text-xs -rotate-45">★</div>
          </div>
          <div className="mt-3 text-amber-400/30 text-[9px] font-pixel tracking-widest">TAROT</div>
        </div>

        {/* 앞면 */}
        <div className={`card-back border ${suitColor.split(' ')[1]} ${suitColor.split(' ')[2]} flex flex-col p-3 h-full rounded-sm`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[9px] px-1.5 py-0.5 border ${suitColor} rounded-sm`}>{SUIT_LABELS[card.suit]}</span>
            {card.reversed && <span className="text-[9px] text-red-400/70 border border-red-500/30 px-1 py-0.5">역방향</span>}
          </div>

          <div className={`text-3xl text-center my-2 ${suitColor.split(' ')[0]}`}>{card.symbol}</div>

          <div className="text-center mb-2">
            <div className="text-white text-sm font-medium leading-tight">{card.nameKor}</div>
            <div className="text-[#E8E4F0]/35 text-[10px] mt-0.5">{card.name}</div>
          </div>

          <div className="flex flex-wrap gap-1 justify-center mt-auto">
            {card.keywords.slice(0, 2).map(kw => (
              <span key={kw} className="text-[9px] text-[#E8E4F0]/50">{kw}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderMarkdown(text: string) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  return lines.map((line, i) => {
    const t = line.trim();
    if (t.startsWith('## '))
      return <h2 key={i} className="text-amber-400 font-serif-kr text-base font-semibold mt-7 mb-3 pb-1.5 border-b border-amber-500/20 first:mt-0">{t.slice(3)}</h2>;
    if (t.startsWith('### '))
      return <h3 key={i} className="text-amber-300/80 text-sm font-medium mt-4 mb-2">{t.slice(4)}</h3>;
    if (t === '')
      return <div key={i} className="h-1.5" />;
    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-[#E8E4F0]/75 text-sm leading-[1.9] my-0.5">
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} className="text-[#E8E4F0] font-medium">{p.slice(2, -2)}</strong>
            : p
        )}
      </p>
    );
  });
}

export default function TarotPage() {
  const [step, setStep] = useState<Step>('input');
  const [question, setQuestion] = useState('');
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [flippedIdx, setFlippedIdx] = useState(-1); // -1=none, 0/1/2=순서대로
  const [streamText, setStreamText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const calledRef = useRef(false);

  const handleDraw = () => {
    if (!question.trim()) return;
    const drawn = drawCards(3);
    setCards(drawn);
    setStep('cards');

    // 카드 순차 플립 (0.5초 간격)
    setTimeout(() => setFlippedIdx(0), 800);
    setTimeout(() => setFlippedIdx(1), 1600);
    setTimeout(() => setFlippedIdx(2), 2400);
  };

  const handleInterpret = async () => {
    if (calledRef.current) return;
    calledRef.current = true;
    setStep('result');
    setStreaming(true);

    try {
      const res = await fetch('/api/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, cards }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: '오류가 발생했습니다.' }));
        setError(err.error);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done: rd, value } = await reader.read();
        if (rd) break;
        setStreamText(prev => prev + decoder.decode(value, { stream: true }));
      }
      setDone(true);
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setStreaming(false);
    }
  };

  const handleReset = () => {
    setStep('input');
    setQuestion('');
    setCards([]);
    setFlippedIdx(-1);
    setStreamText('');
    setStreaming(false);
    setDone(false);
    setError('');
    calledRef.current = false;
  };

  return (
    <div className="min-h-screen bg-[#0B1326]">

      {/* 헤더 */}
      <header className="flex justify-between items-center px-6 py-5 border-b border-amber-500/15">
        <Link href="/" className="font-serif-kr text-[#E8E4F0]/70 text-sm hover:text-[#E8E4F0] transition-colors">
          ← 운세 에이전트
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-lg">✦</span>
          <span className="font-serif-kr text-[#E8E4F0]/80 text-sm">타로 리딩</span>
        </div>
        {(step === 'cards' || step === 'result') && (
          <button onClick={handleReset} className="text-[10px] font-pixel text-[#E8E4F0]/40 hover:text-[#E8E4F0]/70 transition-colors">
            다시 뽑기
          </button>
        )}
        {step === 'input' && <div className="w-16" />}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* ── 1단계: 질문 입력 ─────────────────────────────────── */}
        {step === 'input' && (
          <div>
            <div className="text-center mb-10">
              <div className="text-5xl text-amber-400 mb-5 float glow-gold">✦</div>
              <h1 className="font-serif-kr text-2xl text-white font-semibold mb-3">
                카드에게 물어보세요
              </h1>
              <p className="text-[#E8E4F0]/45 text-sm leading-relaxed">
                마음속 고민이나 궁금한 것을 적어주세요<br />
                우주가 3장의 카드로 답을 드립니다
              </p>
            </div>

            <div className="border border-amber-500/20 bg-amber-500/5 p-6">
              <label className="block text-xs text-amber-400/70 font-pixel mb-3 tracking-wider">
                // 고민 또는 질문
              </label>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="예) 지금 이직을 고려하고 있는데 어떻게 해야 할까요? / 이 관계는 어디로 흘러갈까요?"
                rows={4}
                className="w-full bg-transparent border border-amber-500/25 text-[#E8E4F0] text-sm px-4 py-3 resize-none focus:outline-none focus:border-amber-400 transition-colors placeholder:text-[#E8E4F0]/25 leading-relaxed"
              />
              <p className="text-[#E8E4F0]/30 text-xs mt-2">
                구체적일수록 더 정확한 해석을 받을 수 있습니다
              </p>
            </div>

            <button
              onClick={handleDraw}
              disabled={!question.trim()}
              className="w-full mt-4 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-medium text-sm transition-colors"
            >
              카드 뽑기
            </button>

            {/* 스프레드 안내 */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {(['상황', '조언', '결과'] as const).map(pos => (
                <div key={pos} className="border border-amber-500/15 bg-amber-500/5 p-3 text-center">
                  <div className="text-amber-400/60 text-xs font-pixel mb-1">{pos}</div>
                  <div className="text-[#E8E4F0]/40 text-[10px] leading-relaxed">{POSITION_DESC[pos]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 2단계: 카드 공개 ─────────────────────────────────── */}
        {step === 'cards' && (
          <div>
            <div className="text-center mb-8">
              <p className="text-amber-400/60 text-xs font-pixel tracking-widest mb-2">// YOUR READING</p>
              <p className="text-[#E8E4F0]/70 text-sm italic">"{question}"</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {cards.map((card, i) => (
                <div key={card.id} className="flex flex-col gap-2">
                  <div className="text-center">
                    <span className="text-[10px] font-pixel text-amber-400/50">{card.position}</span>
                  </div>
                  <TarotCardDisplay card={card} flipped={flippedIdx >= i} />
                  {flippedIdx >= i && (
                    <div className="text-center">
                      <div className="text-white text-xs font-medium">{card.nameKor}</div>
                      <div className="flex flex-wrap gap-1 justify-center mt-1">
                        {card.keywords.slice(0, 2).map(kw => (
                          <span key={kw} className="text-[9px] text-[#E8E4F0]/40">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {flippedIdx >= 2 && (
              <div className="text-center">
                <p className="text-[#E8E4F0]/45 text-xs mb-4">카드가 준비되었습니다. AI 해석을 시작하세요</p>
                <button
                  onClick={handleInterpret}
                  className="px-10 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm transition-colors"
                >
                  AI 해석 보기
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 3단계: AI 해석 결과 ──────────────────────────────── */}
        {step === 'result' && (
          <div>
            {/* 질문 & 카드 요약 */}
            <div className="border border-amber-500/20 bg-amber-500/5 p-4 mb-8">
              <div className="text-[10px] font-pixel text-amber-400/50 mb-2">// 질문</div>
              <p className="text-[#E8E4F0]/70 text-sm italic mb-4">"{question}"</p>
              <div className="grid grid-cols-3 gap-3">
                {cards.map(card => (
                  <div key={card.id} className="text-center">
                    <div className="text-[9px] font-pixel text-amber-400/50 mb-1">{card.position}</div>
                    <div className={`text-xl mb-1 ${(SUIT_COLORS[card.suit] ?? '').split(' ')[0]}`}>{card.symbol}</div>
                    <div className="text-[#E8E4F0]/80 text-xs font-medium">{card.nameKor}</div>
                    {card.reversed && <div className="text-red-400/60 text-[9px]">역방향</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* 에러 */}
            {error && (
              <div className="text-center py-8">
                <p className="text-red-400 text-sm mb-4">{error}</p>
                <button onClick={handleReset} className="text-amber-400 text-xs hover:underline">← 다시 시도</button>
              </div>
            )}

            {/* 로딩 */}
            {!streamText && streaming && (
              <div className="flex items-center gap-3 text-[#E8E4F0]/40 text-sm py-8">
                <div className="w-4 h-4 border border-amber-400/30 border-t-amber-400 rounded-full animate-spin shrink-0" />
                <span className="font-pixel text-amber-400/50 animate-pulse text-xs">카드의 메시지를 읽는 중...</span>
              </div>
            )}

            {/* 스트리밍 텍스트 */}
            {streamText && (
              <div className="leading-relaxed">
                {renderMarkdown(streamText)}
                {!done && (
                  <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse ml-1 align-middle" />
                )}
              </div>
            )}

            {/* 다시하기 */}
            {done && (
              <div className="mt-10 pt-6 border-t border-amber-500/15 text-center">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 border border-amber-500/40 text-amber-400 text-sm hover:border-amber-400 hover:bg-amber-500/10 transition-colors"
                >
                  다른 질문으로 다시 뽑기
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
