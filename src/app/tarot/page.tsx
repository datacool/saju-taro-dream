'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { drawCards, formatCardsForPrompt, type DrawnCard, type TarotCard } from '@/lib/tarot';
import AchievementToast from '@/components/AchievementToast';
import {
  markStamp, unlockAchievements, saveSeenCards, getSeenCards,
  type Achievement,
} from '@/lib/gamification';

type Step = 'input' | 'shuffling' | 'spread' | 'cards' | 'result';

const SUIT_LABELS: Record<string, string> = {
  major:'대아르카나', wands:'완드', cups:'컵', swords:'소드', pentacles:'펜타클',
};
const SUIT_COLORS: Record<string, string> = {
  major:'text-violet-300 border-violet-500/40 bg-violet-600/15',
  wands:'text-orange-300 border-orange-500/40 bg-orange-600/15',
  cups:'text-blue-300 border-blue-500/40 bg-blue-600/15',
  swords:'text-gray-300 border-gray-500/40 bg-gray-600/15',
  pentacles:'text-green-300 border-green-500/40 bg-green-600/15',
};
const POSITION_DESC: Record<string, string> = {
  '상황':'현재 당신이 처한 상황을 나타냅니다',
  '조언':'앞으로 나아갈 방향과 조언을 담고 있습니다',
  '결과':'이 상황이 이끄는 결과와 가능성을 보여줍니다',
};
const POSITIONS: Array<'상황' | '조언' | '결과'> = ['상황', '조언', '결과'];

// 직감 버튼 옵션
const INTUITION_OPTIONS = [
  { symbol: '★', label: '별', desc: '별의 기운이 함께합니다' },
  { symbol: '☽', label: '달', desc: '달의 직관이 이끕니다' },
  { symbol: '◎', label: '태양', desc: '태양의 에너지가 깃듭니다' },
];

const FAN_CONFIG = [
  { rotate:-18, baseY:18 }, { rotate:-12, baseY:9 }, { rotate:-6, baseY:3 },
  { rotate:0,   baseY:0  }, { rotate:6,  baseY:3  }, { rotate:12, baseY:9 },
  { rotate:18,  baseY:18 },
];

const DECK_LAYERS = [
  { cls:'shuffle-a', z:30, offset:-4 },
  { cls:'shuffle-b', z:20, offset:-2 },
  { cls:'shuffle-c', z:10, offset:0  },
];

function CardBack({ small = false }: { small?: boolean }) {
  const h = small ? 'h-[140px]' : 'h-[180px]';
  const w = small ? 'w-[90px]'  : 'w-[112px]';
  return (
    <div className={`${w} ${h} border border-amber-500/50 flex flex-col items-center justify-center rounded-sm relative overflow-hidden`}
      style={{ background:'#0B1326' }}>
      <div className="absolute inset-2 border border-amber-500/20" />
      <div className="text-3xl mb-2 float" style={{ color:'#FFB95F', filter:'drop-shadow(0 0 6px #FFB95F)' }}>✦</div>
      <div className="w-8 h-8 border border-amber-500/40 rotate-45 flex items-center justify-center">
        <div className="text-[10px] -rotate-45 text-amber-400/60">★</div>
      </div>
      <div className="mt-2 text-[8px] font-pixel tracking-widest text-amber-400/50">TAROT</div>
    </div>
  );
}

function TarotCardDisplay({ card, flipped }: { card: DrawnCard; flipped: boolean }) {
  const suitColor = SUIT_COLORS[card.suit] ?? SUIT_COLORS.major;
  return (
    <div className="card-3d" style={{ height:'200px', width:'100%' }}>
      <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
        <div className="card-face border border-amber-500/30 bg-[#0B1326] flex flex-col items-center justify-center h-full rounded-sm">
          <div className="text-3xl text-amber-400/60 mb-2 glow-gold-sm">✦</div>
          <div className="w-10 h-10 border border-amber-500/20 rotate-45 flex items-center justify-center">
            <div className="text-amber-400/40 text-xs -rotate-45">★</div>
          </div>
          <div className="mt-3 text-amber-400/30 text-[9px] font-pixel tracking-widest">TAROT</div>
        </div>
        <div className={`card-back border ${suitColor.split(' ')[1]} ${suitColor.split(' ')[2]} flex flex-col p-3 h-full rounded-sm`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[11px] px-1.5 py-0.5 border ${suitColor} rounded-sm`}>{SUIT_LABELS[card.suit]}</span>
            {card.reversed && <span className="text-[11px] text-red-400/70 border border-red-500/30 px-1 py-0.5">역</span>}
          </div>
          <div className={`text-3xl text-center my-2 ${suitColor.split(' ')[0]}`}>{card.symbol}</div>
          <div className="text-center mb-2">
            <div className="text-white text-sm font-medium leading-tight">{card.nameKor}</div>
            <div className="text-[#E8E4F0]/30 text-[11px] mt-0.5">{card.name}</div>
          </div>
          <div className="flex flex-wrap gap-1 justify-center mt-auto">
            {card.keywords.slice(0, 2).map(kw => <span key={kw} className="text-[11px] text-[#E8E4F0]/45">{kw}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderMarkdown(text: string) {
  return text.replace(/\r\n/g, '\n').split('\n').map((line, i) => {
    const t = line.trim();
    if (t.startsWith('## '))
      return <h2 key={i} className="text-amber-400 font-serif-kr text-lg font-semibold mt-7 mb-3 pb-1.5 border-b border-amber-500/20 first:mt-0">{t.slice(3)}</h2>;
    if (t.startsWith('### '))
      return <h3 key={i} className="text-amber-300/80 text-base font-medium mt-4 mb-2">{t.slice(4)}</h3>;
    if (t === '') return <div key={i} className="h-1.5" />;
    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-[#E8E4F0]/75 text-base leading-[1.9] my-0.5">
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} className="text-[#E8E4F0] font-medium">{p.slice(2,-2)}</strong>
            : p
        )}
      </p>
    );
  });
}

export default function TarotPage() {
  const [step, setStep]         = useState<Step>('input');
  const [question, setQuestion] = useState('');
  const [intuition, setIntuition] = useState<string | null>(null);

  const [spreadCards, setSpreadCards]       = useState<TarotCard[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [hoveredSpreadIdx, setHoveredSpreadIdx] = useState(-1);

  const [cards, setCards]       = useState<DrawnCard[]>([]);
  const [flippedIdx, setFlippedIdx] = useState(-1);

  const [streamText, setStreamText] = useState('');
  const [streaming, setStreaming]   = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState('');

  const [seenCount, setSeenCount]         = useState(0);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  const calledRef        = useRef(false);
  const shuffleTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 초기 seen count 로드
  useEffect(() => { setSeenCount(getSeenCards().length); }, []);

  const handleDraw = () => {
    if (!question.trim()) return;
    setSpreadCards(drawCards(7) as TarotCard[]);
    setSelectedIndices([]);
    setIntuition(null);
    setStep('shuffling');
  };

  // 직감 선택 → 즉시 spread로
  const handleIntuition = (symbol: string) => {
    setIntuition(symbol);
    if (shuffleTimerRef.current) clearTimeout(shuffleTimerRef.current);
    setTimeout(() => setStep('spread'), 400);
  };

  // 셔플 단계에서 4초 후 자동 진행 (직감 미선택 시)
  useEffect(() => {
    if (step !== 'shuffling') return;
    shuffleTimerRef.current = setTimeout(() => setStep('spread'), 4000);
    return () => { if (shuffleTimerRef.current) clearTimeout(shuffleTimerRef.current); };
  }, [step]);

  const handleCardSelect = (idx: number) => {
    if (selectedIndices.includes(idx)) {
      setSelectedIndices(prev => prev.filter(i => i !== idx));
      return;
    }
    if (selectedIndices.length >= 3) return;
    setSelectedIndices(prev => [...prev, idx]);
  };

  const handleConfirmSelection = () => {
    if (selectedIndices.length !== 3) return;
    const finalCards: DrawnCard[] = selectedIndices.map((spreadIdx, posIdx) => ({
      ...(spreadCards[spreadIdx] as DrawnCard),
      position: POSITIONS[posIdx],
      reversed: Math.random() < 0.25,
    }));
    setCards(finalCards);
    setStep('cards');
    setTimeout(() => setFlippedIdx(0), 800);
    setTimeout(() => setFlippedIdx(1), 1600);
    setTimeout(() => setFlippedIdx(2), 2400);
  };

  const handleInterpret = async () => {
    if (calledRef.current) return;
    calledRef.current = true;
    setStep('result');
    setStreaming(true);

    // 업적 + 스탬프
    markStamp('tarot');
    const newAch = unlockAchievements('first_tarot');
    if (newAch.length > 0) setAchievementQueue(newAch);

    // 타로 도감에 카드 저장
    saveSeenCards(cards.map(c => c.id));
    setSeenCount(getSeenCards().length);

    try {
      const res = await fetch('/api/tarot', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ question, cards }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error:'오류가 발생했습니다.' }));
        setError(err.error); return;
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
    if (shuffleTimerRef.current) clearTimeout(shuffleTimerRef.current);
    setStep('input'); setQuestion(''); setIntuition(null);
    setSpreadCards([]); setSelectedIndices([]); setHoveredSpreadIdx(-1);
    setCards([]); setFlippedIdx(-1);
    setStreamText(''); setStreaming(false); setDone(false); setError('');
    calledRef.current = false;
  };

  const canReset = step !== 'input' && step !== 'shuffling';

  return (
    <div className="min-h-screen bg-[#0B1326]">
      <AchievementToast queue={achievementQueue} onDone={() => setAchievementQueue([])} />

      <header className="flex justify-between items-center px-6 py-5 border-b border-amber-500/15">
        <Link href="/" className="font-serif-kr text-[#E8E4F0]/70 text-base hover:text-[#E8E4F0] transition-colors">
          ← 운세 에이전트
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-lg glow-gold-sm">✦</span>
          <span className="font-serif-kr text-[#E8E4F0]/80 text-base">타로 리딩</span>
        </div>
        {canReset ? (
          <button onClick={handleReset} className="text-xs font-pixel text-[#E8E4F0]/40 hover:text-[#E8E4F0]/70 transition-colors">
            다시 뽑기
          </button>
        ) : (
          <div className="w-16" />
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* ── 1단계: 질문 입력 ─────────────────────────── */}
        {step === 'input' && (
          <div className="fade-up">
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-4xl mx-auto mb-4 avatar-ring-gold"
                style={{ filter:'drop-shadow(0 0 12px rgba(255,185,95,0.4))' }}>✦</div>
              <div className="text-amber-400/60 text-xs font-pixel mb-2">MADAME CÉLESTE</div>
              <h1 className="font-serif-kr text-3xl text-white font-semibold mb-3">카드에게 물어보세요</h1>
              <p className="text-[#E8E4F0]/45 text-base leading-relaxed italic">
                "Les étoiles vous attendent…<br />별들이 당신의 이야기를 듣고 있어요."
              </p>
            </div>

            <div className="border border-amber-500/20 bg-amber-500/5 p-6">
              <label className="block text-sm text-amber-400/70 font-pixel mb-3 tracking-wider">// 고민 또는 질문</label>
              <textarea value={question} onChange={e => setQuestion(e.target.value)}
                placeholder="예) 지금 이직을 고려하고 있는데 어떻게 해야 할까요? / 이 관계는 어디로 흘러갈까요?"
                rows={4}
                className="w-full bg-transparent border border-amber-500/25 text-[#E8E4F0] text-base px-4 py-3 resize-none focus:outline-none focus:border-amber-400 transition-colors placeholder:text-[#E8E4F0]/25 leading-relaxed"
              />
              <p className="text-[#E8E4F0]/30 text-sm mt-2">구체적일수록 더 정확한 해석을 받을 수 있습니다</p>
            </div>

            <button onClick={handleDraw} disabled={!question.trim()}
              className="w-full mt-4 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-medium text-base transition-colors">
              카드 뽑기
            </button>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {(['상황','조언','결과'] as const).map(pos => (
                <div key={pos} className="border border-amber-500/15 bg-amber-500/5 p-3 text-center">
                  <div className="text-amber-400/60 text-sm font-pixel mb-1">{pos}</div>
                  <div className="text-[#E8E4F0]/40 text-xs leading-relaxed">{POSITION_DESC[pos]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 2단계: 셔플 + 직감 선택 ─────────────────── */}
        {step === 'shuffling' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] fade-up">
            <div className="relative w-32 h-48 mb-8">
              {DECK_LAYERS.map((layer, i) => (
                <div key={i} className={`absolute inset-0 border-2 border-amber-500/40 bg-[#0B1326] rounded-sm ${layer.cls}`}
                  style={{ zIndex:layer.z, transform:`translateX(${layer.offset}px)` }}>
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="text-amber-400/60 text-3xl mb-2">✦</div>
                    <div className="w-8 h-8 border border-amber-500/30 rotate-45 flex items-center justify-center">
                      <span className="text-amber-400/30 text-xs -rotate-45">★</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mb-8">
              <div className="text-amber-400/60 text-xs font-pixel mb-3 tracking-widest">MADAME CÉLESTE</div>
              <p className="text-[#E8E4F0]/70 text-base italic mb-2">
                "덱을 섞겠습니다. 마음을 비우고<br />직감에 귀 기울여 보세요."
              </p>
            </div>

            {/* 직감 선택 */}
            {!intuition ? (
              <div className="text-center">
                <p className="text-amber-400/50 text-sm font-pixel mb-4 tracking-wider">// 지금 끌리는 기호를 하나 고르세요</p>
                <div className="flex gap-4 justify-center">
                  {INTUITION_OPTIONS.map(opt => (
                    <button key={opt.symbol} onClick={() => handleIntuition(opt.symbol)}
                      className="flex flex-col items-center gap-2 w-20 py-3 border border-amber-500/25 bg-amber-500/5 hover:border-amber-400/60 hover:bg-amber-500/15 transition-all duration-200 group">
                      <span className="text-2xl text-amber-400/70 group-hover:text-amber-300 transition-colors"
                        style={{ filter:'drop-shadow(0 0 4px rgba(255,185,95,0.4))' }}>
                        {opt.symbol}
                      </span>
                      <span className="text-[10px] font-pixel text-amber-400/50 group-hover:text-amber-400/80">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[#E8E4F0]/20 text-[10px] mt-4">선택하지 않아도 자동으로 진행됩니다</p>
              </div>
            ) : (
              <div className="text-center fade-up">
                <div className="text-4xl text-amber-400 mb-2" style={{ filter:'drop-shadow(0 0 8px rgba(255,185,95,0.6))' }}>
                  {intuition}
                </div>
                <p className="text-amber-300/70 text-sm italic">
                  "{INTUITION_OPTIONS.find(o => o.symbol === intuition)?.desc}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── 3단계: 카드 선택 스프레드 ────────────────── */}
        {step === 'spread' && (
          <div className="fade-up">
            <div className="text-center mb-8">
              <div className="text-amber-400/60 text-[11px] font-pixel mb-2 tracking-widest">MADAME CÉLESTE</div>
              {intuition && (
                <p className="text-amber-300/50 text-xs mb-2">
                  {intuition} {INTUITION_OPTIONS.find(o=>o.symbol===intuition)?.desc}
                </p>
              )}
              <p className="text-[#E8E4F0]/80 text-sm italic mb-1">"카드가 준비되었습니다."</p>
              <p className="text-[#E8E4F0]/50 text-sm">끌리는 카드 <span className="text-amber-400 font-medium">3장</span>을 고르세요</p>
              <p className="text-[#E8E4F0]/30 text-xs mt-1">선택 순서대로 상황 · 조언 · 결과가 됩니다</p>
              <p className="text-amber-400/50 text-xs italic mt-3">"{question}"</p>
            </div>

            <div className="flex justify-center items-end select-none" style={{ paddingTop:'60px', paddingBottom:'20px' }}>
              {spreadCards.map((card, i) => {
                const fan = FAN_CONFIG[i];
                const isSelected = selectedIndices.includes(i);
                const selOrder = selectedIndices.indexOf(i);
                const isHovered = hoveredSpreadIdx === i;
                const hoverLift = isSelected ? -22 : isHovered ? -14 : 0;
                return (
                  <div key={card.id} className="relative"
                    style={{
                      marginLeft: i === 0 ? 0 : '-18px',
                      transition:'transform 0.2s ease',
                      transform:`translateY(${hoverLift}px)`,
                      zIndex: isSelected || isHovered ? 50 : 10 + i,
                    }}
                    onMouseEnter={() => setHoveredSpreadIdx(i)}
                    onMouseLeave={() => setHoveredSpreadIdx(-1)}
                    onClick={() => handleCardSelect(i)}
                  >
                    <div style={{
                      transform:`rotate(${fan.rotate}deg) translateY(${fan.baseY}px)`,
                      cursor: selectedIndices.length >= 3 && !isSelected ? 'not-allowed' : 'pointer',
                      filter: isSelected ? 'drop-shadow(0 0 12px rgba(255,185,95,0.8))' : isHovered ? 'drop-shadow(0 0 6px rgba(255,185,95,0.5))' : 'none',
                      opacity: selectedIndices.length >= 3 && !isSelected ? 0.4 : 1,
                    }}>
                      <CardBack small />
                    </div>
                    {isSelected && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center font-pixel" style={{ zIndex:60 }}>
                        {selOrder + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-6 mt-6 mb-8">
              {POSITIONS.map((pos, i) => (
                <div key={pos} className="text-center">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold mx-auto mb-1 transition-all duration-200 ${selectedIndices.length > i ? 'border-amber-500 bg-amber-500/20 text-amber-400' : 'border-amber-500/20 text-[#E8E4F0]/20'}`}>
                    {selectedIndices.length > i ? '✓' : i+1}
                  </div>
                  <div className="text-[10px] font-pixel text-[#E8E4F0]/40">{pos}</div>
                </div>
              ))}
            </div>

            <button onClick={handleConfirmSelection} disabled={selectedIndices.length !== 3}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-medium text-sm transition-colors">
              {selectedIndices.length === 3 ? '운명을 봅니다 ✦' : `${selectedIndices.length} / 3 선택됨`}
            </button>
          </div>
        )}

        {/* ── 4단계: 카드 공개 ──────────────────────────── */}
        {step === 'cards' && (
          <div className="fade-up">
            <div className="text-center mb-8">
              <p className="text-amber-400/60 text-xs font-pixel tracking-widest mb-2">// YOUR READING</p>
              <p className="text-[#E8E4F0]/70 text-sm italic">"{question}"</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {cards.map((card, i) => (
                <div key={card.id} className="flex flex-col gap-2">
                  <div className="text-center"><span className="text-[10px] font-pixel text-amber-400/50">{card.position}</span></div>
                  <TarotCardDisplay card={card} flipped={flippedIdx >= i} />
                  {flippedIdx >= i && (
                    <div className="text-center fade-up">
                      <div className="text-white text-xs font-medium">{card.nameKor}</div>
                      <div className="flex flex-wrap gap-1 justify-center mt-1">
                        {card.keywords.slice(0,2).map(kw => <span key={kw} className="text-[9px] text-[#E8E4F0]/40">{kw}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {flippedIdx >= 2 && (
              <div className="text-center fade-up">
                <p className="text-[#E8E4F0]/45 text-xs mb-4">"Les cartes ont parlé… 카드가 준비되었습니다."</p>
                <button onClick={handleInterpret}
                  className="px-10 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm transition-colors">
                  마담 셀레스트의 해석 보기
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 5단계: AI 해석 결과 ───────────────────────── */}
        {step === 'result' && (
          <div>
            <div className="border border-amber-500/20 bg-amber-500/5 p-4 mb-8">
              <div className="text-[10px] font-pixel text-amber-400/50 mb-2">// 질문</div>
              <p className="text-[#E8E4F0]/70 text-sm italic mb-4">"{question}"</p>
              <div className="grid grid-cols-3 gap-3">
                {cards.map(card => (
                  <div key={card.id} className="text-center">
                    <div className="text-[9px] font-pixel text-amber-400/50 mb-1">{card.position}</div>
                    <div className={`text-xl mb-1 ${(SUIT_COLORS[card.suit]??'').split(' ')[0]}`}>{card.symbol}</div>
                    <div className="text-[#E8E4F0]/80 text-xs font-medium">{card.nameKor}</div>
                    {card.reversed && <div className="text-red-400/60 text-[9px]">역방향</div>}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-center py-8">
                <p className="text-red-400 text-sm mb-4">{error}</p>
                <button onClick={handleReset} className="text-amber-400 text-xs hover:underline">← 다시 시도</button>
              </div>
            )}

            {!streamText && streaming && (
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="w-14 h-14 rounded-full border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-2xl avatar-ring-gold">✦</div>
                <p className="text-amber-400/60 text-sm italic text-center">
                  "별들이 이야기를 나누고 있습니다…<br />
                  <span className="text-[11px]">Les étoiles murmurent leurs secrets.</span>"
                </p>
                <div className="dot-bounce text-amber-400/40 text-lg"><span>·</span><span>·</span><span>·</span></div>
              </div>
            )}

            {streamText && (
              <div className="leading-relaxed">
                {renderMarkdown(streamText)}
                {!done && <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse ml-1 align-middle" />}
              </div>
            )}

            {/* 타로 도감 스티커 */}
            {done && (
              <div className="mt-10 pt-6 border-t border-amber-500/15">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-pixel text-amber-400/50">// 오늘의 타로 도감</div>
                  <div className="text-[10px] font-pixel text-amber-400/30">
                    {seenCount} / 78 수집
                  </div>
                </div>
                <div className="flex gap-3 mb-6">
                  {cards.map(card => {
                    const sc = SUIT_COLORS[card.suit] ?? SUIT_COLORS.major;
                    return (
                      <div key={card.id}
                        className={`flex-1 border ${sc.split(' ')[1]} ${sc.split(' ')[2]} p-2 text-center rounded-sm`}>
                        <div className={`text-2xl mb-1 ${sc.split(' ')[0]}`}>{card.symbol}</div>
                        <div className="text-[9px] text-[#E8E4F0]/60 font-medium leading-tight">{card.nameKor}</div>
                        <div className="text-[8px] text-[#E8E4F0]/30 mt-0.5">{SUIT_LABELS[card.suit]}</div>
                        {card.reversed && <div className="text-[8px] text-red-400/50 mt-0.5">역방향</div>}
                      </div>
                    );
                  })}
                </div>
                {/* 진행 바 */}
                <div className="mb-6">
                  <div className="flex justify-between text-[10px] font-pixel text-amber-400/30 mb-1">
                    <span>카드 수집 현황</span>
                    <span>{Math.round(seenCount/78*100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-amber-500/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500/50 rounded-full transition-all duration-700"
                      style={{ width:`${seenCount/78*100}%` }} />
                  </div>
                </div>

                <div className="text-center">
                  <button onClick={handleReset}
                    className="px-8 py-3 border border-amber-500/40 text-amber-400 text-sm hover:border-amber-400 hover:bg-amber-500/10 transition-colors">
                    다른 질문으로 다시 뽑기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
