'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import AchievementToast from '@/components/AchievementToast';
import { markStamp, unlockAchievements, type Achievement } from '@/lib/gamification';

const EMOTION_OPTIONS = ['기쁨', '불안', '두려움', '혼란', '평온', '슬픔', '설렘', '당혹'];
const THEME_OPTIONS   = ['비행', '추락', '물', '불', '동물', '사람', '죽음', '탈출', '집', '길', '이성', '직장'];

// 감정 선택 시 몽신 아라의 반응 문구
const EMOTION_REACTIONS: Record<string, string> = {
  '기쁨':   '긍정적인 에너지가 꿈에 가득 담겨 있군요 ✦',
  '불안':   '불안이 꿈으로 표출되는 것은 자연스러운 일이에요',
  '두려움': '두려움 속에 중요한 메시지가 숨어 있을 수 있어요',
  '혼란':   '혼란은 변화의 전조인 경우가 많아요',
  '평온':   '평온한 꿈은 내면의 균형을 나타냅니다',
  '슬픔':   '슬픔을 꿈이 대신 처리해주고 있는 것 같아요',
  '설렘':   '설렘이 가득한 꿈, 좋은 일이 기다리고 있을지도요',
  '당혹':   '예상치 못한 상황을 마주한 내면의 반응이에요',
};

// 감정별 글로우 색상
const EMOTION_GLOW: Record<string, string> = {
  '기쁨':   'rgba(251,191,36,0.6)',
  '불안':   'rgba(249,115,22,0.6)',
  '두려움': 'rgba(239,68,68,0.5)',
  '혼란':   'rgba(168,85,247,0.6)',
  '평온':   'rgba(96,165,250,0.6)',
  '슬픔':   'rgba(99,102,241,0.6)',
  '설렘':   'rgba(236,72,153,0.6)',
  '당혹':   'rgba(107,114,128,0.6)',
};

const DREAM_TYPE_CONFIG: Record<string, {
  label: string; colorClass: string; icon: string; desc: string;
}> = {
  '길몽':   { label: '길몽 吉夢',   colorClass: 'text-amber-300 border-amber-500/50 bg-amber-500/15',   icon: '✦', desc: '행운과 좋은 일을 예시하는 꿈' },
  '예지몽': { label: '예지몽 豫知夢', colorClass: 'text-violet-300 border-violet-500/50 bg-violet-500/15', icon: '◎', desc: '미래의 일을 미리 보는 꿈' },
  '정화몽': { label: '정화몽 淨化夢', colorClass: 'text-blue-300 border-blue-500/50 bg-blue-500/15',     icon: '☽', desc: '내면을 정화하고 치유하는 꿈' },
  '불안몽': { label: '불안몽 不安夢', colorClass: 'text-orange-300 border-orange-500/50 bg-orange-500/15', icon: '◈', desc: '현재의 불안과 스트레스를 반영하는 꿈' },
  '흉몽':   { label: '흉몽 凶夢',   colorClass: 'text-red-300 border-red-500/50 bg-red-500/15',         icon: '⚡', desc: '주의가 필요한 경고의 꿈' },
  '일상몽': { label: '일상몽 日常夢', colorClass: 'text-gray-300 border-gray-500/50 bg-gray-500/15',     icon: '○', desc: '일상의 기억이 반영된 꿈' },
};

interface DreamEntry {
  id: string; date: string; dream: string; dreamType: string;
  emotions: string[]; themes: string[]; summary: string;
}

function loadDiaryEntries(): DreamEntry[] {
  if (typeof window === 'undefined') return [];
  try { const raw = localStorage.getItem('dream_diary'); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}
function saveDiaryEntry(entry: DreamEntry) {
  const entries = loadDiaryEntries();
  entries.unshift(entry);
  localStorage.setItem('dream_diary', JSON.stringify(entries.slice(0, 30)));
}
function deleteDiaryEntry(id: string) {
  localStorage.setItem('dream_diary', JSON.stringify(loadDiaryEntries().filter(e => e.id !== id)));
}

const PARTICLES = [
  { x:20, y:30, dx:-30, dy:-80, size:4, color:'#60A5FA', dur:2.2, del:0   },
  { x:50, y:60, dx: 40, dy:-70, size:3, color:'#7C3AED', dur:2.5, del:0.3 },
  { x:75, y:40, dx:-20, dy:-90, size:5, color:'#60A5FA', dur:2.0, del:0.6 },
  { x:30, y:70, dx: 60, dy:-60, size:2, color:'#A78BFA', dur:2.8, del:0.1 },
  { x:60, y:20, dx:-50, dy:-75, size:3, color:'#93C5FD', dur:2.3, del:0.8 },
  { x:85, y:65, dx:-35, dy:-85, size:4, color:'#60A5FA', dur:1.9, del:0.4 },
];

function renderMarkdown(text: string) {
  return text.replace(/\r\n/g, '\n').split('\n').map((line, i) => {
    const t = line.trim();
    if (t.startsWith('## '))
      return <h2 key={i} className="text-blue-400 font-serif-kr text-base font-semibold mt-7 mb-3 pb-1.5 border-b border-blue-500/20 first:mt-0">{t.slice(3)}</h2>;
    if (t.startsWith('### '))
      return <h3 key={i} className="text-blue-300/80 text-sm font-medium mt-4 mb-2">{t.slice(4)}</h3>;
    if (t === '') return <div key={i} className="h-1.5" />;
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

export default function DreamPage() {
  const [dream, setDream]       = useState('');
  const [emotions, setEmotions] = useState<string[]>([]);
  const [themes, setThemes]     = useState<string[]>([]);
  const [lastEmotion, setLastEmotion] = useState('');

  const [streamText, setStreamText] = useState('');
  const [dreamType, setDreamType]   = useState('');
  const [streaming, setStreaming]   = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState('');
  const [submitted, setSubmitted]   = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const [showDiary, setShowDiary]         = useState(false);
  const [diaryEntries, setDiaryEntries]   = useState<DreamEntry[]>([]);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  const calledRef          = useRef(false);
  const typeBufferRef      = useRef('');
  const typeExtractedRef   = useRef(false);
  const dreamTypeRef       = useRef('');
  const streamTextRef      = useRef('');

  useEffect(() => { dreamTypeRef.current = dreamType; }, [dreamType]);
  useEffect(() => { streamTextRef.current = streamText; }, [streamText]);

  const toggleEmotion = (e: string) => {
    setLastEmotion(e);
    setEmotions(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  };
  const toggleTheme = (t: string) =>
    setThemes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim() || calledRef.current) return;
    calledRef.current = true;
    setSubmitted(true);
    setStreaming(true);
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 3000);

    typeBufferRef.current = '';
    typeExtractedRef.current = false;

    try {
      const res = await fetch('/api/dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream, emotions, themes }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: '오류가 발생했습니다.' }));
        setError(err.error); return;
      }
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done: rd, value } = await reader.read();
        if (rd) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!typeExtractedRef.current) {
          typeBufferRef.current += chunk;
          const match = typeBufferRef.current.match(/__TYPE__([^_]+)__/);
          if (match) {
            setDreamType(match[1].trim());
            const rest = typeBufferRef.current.replace(/__TYPE__[^_]+__\n?/, '');
            if (rest) setStreamText(prev => prev + rest);
            typeExtractedRef.current = true;
            typeBufferRef.current = '';
          } else if (typeBufferRef.current.length > 60) {
            typeExtractedRef.current = true;
            setStreamText(prev => prev + typeBufferRef.current);
            typeBufferRef.current = '';
          }
        } else {
          setStreamText(prev => prev + chunk);
        }
      }
      setDone(true);
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setStreaming(false);
    }
  };

  // 완료 시: 스탬프 + 업적 + 일기 저장
  useEffect(() => {
    if (!done || !submitted) return;
    markStamp('dream');
    const newAch = unlockAchievements('first_dream');
    if (newAch.length > 0) setAchievementQueue(newAch);

    saveDiaryEntry({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' }),
      dream: dream.slice(0, 120),
      dreamType: dreamTypeRef.current || '일상몽',
      emotions, themes,
      summary: streamTextRef.current.replace(/##[^\n]*/g,'').replace(/\*\*/g,'').trim().slice(0, 100),
    });
    setDiaryEntries(loadDiaryEntries());
  }, [done]);

  const handleReset = () => {
    setDream(''); setEmotions([]); setThemes([]); setLastEmotion('');
    setStreamText(''); setDreamType(''); setStreaming(false); setDone(false);
    setError(''); setSubmitted(false); setShowParticles(false);
    calledRef.current = false;
    typeBufferRef.current = ''; typeExtractedRef.current = false;
  };

  const typeConfig = dreamType ? (DREAM_TYPE_CONFIG[dreamType] ?? DREAM_TYPE_CONFIG['일상몽']) : null;
  const emotionReaction = emotions.length > 0
    ? EMOTION_REACTIONS[lastEmotion] ?? EMOTION_REACTIONS[emotions[emotions.length - 1]]
    : null;

  return (
    <div className="min-h-screen bg-[#0B1326] relative overflow-x-hidden">

      <AchievementToast queue={achievementQueue} onDone={() => setAchievementQueue([])} />

      {/* 파티클 */}
      {showParticles && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {PARTICLES.map((p, i) => (
            <div key={i} className="dream-particle" style={{
              left:`${p.x}%`, top:`${p.y}%`,
              width:`${p.size}px`, height:`${p.size}px`,
              background: p.color,
              '--dx':`${p.dx}px`, '--dy':`${p.dy}px`,
              '--dur':`${p.dur}s`, '--del':`${p.del}s`,
              boxShadow:`0 0 6px ${p.color}`,
            } as React.CSSProperties} />
          ))}
        </div>
      )}

      <header className="flex justify-between items-center px-6 py-5 border-b border-blue-500/15">
        <Link href="/" className="font-serif-kr text-[#E8E4F0]/70 text-sm hover:text-[#E8E4F0] transition-colors">
          ← 운세 에이전트
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-lg glow-blue-sm">☽</span>
          <span className="font-serif-kr text-[#E8E4F0]/80 text-sm">꿈해몽</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setDiaryEntries(loadDiaryEntries()); setShowDiary(true); }}
            className="text-[10px] font-pixel text-blue-400/50 hover:text-blue-400/80 transition-colors border border-blue-500/20 px-2 py-1">
            꿈 일기
          </button>
          {submitted && (
            <button onClick={handleReset} className="text-[10px] font-pixel text-[#E8E4F0]/40 hover:text-[#E8E4F0]/70 transition-colors">
              새 꿈 해석
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* ── 입력 폼 ──────────────────────────────────── */}
        {!submitted && (
          <div className="fade-up">
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full border-2 border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-4xl mx-auto mb-4 avatar-ring-blue"
                style={{ textShadow:'0 0 14px rgba(96,165,250,0.8)', filter:'drop-shadow(0 0 10px rgba(96,165,250,0.4))' }}>
                ☽
              </div>
              <div className="text-blue-400/60 text-[11px] font-pixel mb-2">몽신 夢神 아라</div>
              <h1 className="font-serif-kr text-2xl text-white font-semibold mb-3">꿈 이야기를 들려주세요</h1>
              <p className="text-[#E8E4F0]/45 text-sm leading-relaxed italic">
                "당신의 꿈이 내게 흘러오고 있어요…<br />꿈의 결을 함께 살펴볼게요."
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border border-blue-500/20 bg-blue-500/5 p-5">
                <label className="block text-xs text-blue-400/70 font-pixel mb-3 tracking-wider">// 꿈 내용</label>
                <textarea value={dream} onChange={e => setDream(e.target.value)}
                  placeholder="꿈에서 무슨 일이 있었나요? 장소, 등장인물, 사건, 느낌 등 기억나는 것을 모두 적어주세요."
                  rows={6} required
                  className="w-full bg-transparent border border-blue-500/25 text-[#E8E4F0] text-sm px-4 py-3 resize-none focus:outline-none focus:border-blue-400 transition-colors placeholder:text-[#E8E4F0]/25 leading-relaxed"
                />
                <p className="text-[#E8E4F0]/25 text-xs mt-2">자세할수록 더 정확한 해몽이 가능합니다</p>
              </div>

              {/* 감정 선택 — 글로우 반응 */}
              <div>
                <label className="block text-xs text-blue-400/70 font-pixel mb-3 tracking-wider">
                  // 꿈 속에서 느낀 감정 (복수 선택 가능)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {EMOTION_OPTIONS.map(em => {
                    const isSelected = emotions.includes(em);
                    return (
                      <button key={em} type="button" onClick={() => toggleEmotion(em)}
                        className={`px-3 py-1.5 text-xs border transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-400 bg-blue-600/20 text-blue-300'
                            : 'border-blue-500/20 text-[#E8E4F0]/40 hover:border-blue-500/50'
                        }`}
                        style={isSelected ? {
                          boxShadow: `0 0 10px ${EMOTION_GLOW[em]}, 0 0 20px ${EMOTION_GLOW[em]}40`,
                          transform: 'scale(1.05)',
                        } : undefined}
                      >
                        {em}
                      </button>
                    );
                  })}
                </div>
                {/* 아라의 감정 반응 */}
                {emotionReaction && (
                  <p className="text-blue-400/60 text-xs italic fade-up pl-1">
                    ☽ {emotionReaction}
                  </p>
                )}
              </div>

              {/* 테마 선택 */}
              <div>
                <label className="block text-xs text-blue-400/70 font-pixel mb-3 tracking-wider">
                  // 꿈에 등장한 주요 요소 (복수 선택 가능)
                </label>
                <div className="flex flex-wrap gap-2">
                  {THEME_OPTIONS.map(th => (
                    <button key={th} type="button" onClick={() => toggleTheme(th)}
                      className={`px-3 py-1.5 text-xs border transition-colors ${
                        themes.includes(th)
                          ? 'border-blue-400 bg-blue-600/20 text-blue-300'
                          : 'border-blue-500/20 text-[#E8E4F0]/40 hover:border-blue-500/50'
                      }`}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={!dream.trim()}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors mt-2">
                꿈 해석하기
              </button>
            </form>
          </div>
        )}

        {/* ── 결과 ─────────────────────────────────────── */}
        {submitted && (
          <div>
            <div className="border border-blue-500/20 bg-blue-500/5 p-4 mb-6">
              <div className="text-[10px] font-pixel text-blue-400/50 mb-2">// 꿈 내용</div>
              <p className="text-[#E8E4F0]/60 text-sm leading-relaxed line-clamp-4">{dream}</p>
              {(emotions.length > 0 || themes.length > 0) && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {emotions.map(e => <span key={e} className="text-[10px] px-2 py-0.5 border border-blue-500/30 bg-blue-600/15 text-blue-300">{e}</span>)}
                  {themes.map(t => <span key={t} className="text-[10px] px-2 py-0.5 border border-violet-500/30 bg-violet-600/15 text-violet-300">{t}</span>)}
                </div>
              )}
            </div>

            {typeConfig && (
              <div className="mb-6 fade-up">
                <div className={`inline-flex items-center gap-3 px-4 py-3 border ${typeConfig.colorClass} rounded-sm`}>
                  <span className="text-xl">{typeConfig.icon}</span>
                  <div>
                    <div className="text-sm font-semibold font-serif-kr">{typeConfig.label}</div>
                    <div className="text-[11px] opacity-70">{typeConfig.desc}</div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-red-400 text-sm mb-4">{error}</p>
                <button onClick={handleReset} className="text-blue-400 text-xs hover:underline">← 다시 시도</button>
              </div>
            )}

            {!streamText && streaming && (
              <div className="flex flex-col items-center gap-5 py-12">
                <div className="w-16 h-16 rounded-full border-2 border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-3xl avatar-ring-blue"
                  style={{ textShadow:'0 0 14px rgba(96,165,250,0.8)' }}>☽</div>
                <div className="text-center">
                  <div className="text-blue-400/50 text-[11px] font-pixel mb-2">몽신 夢神 아라</div>
                  <p className="text-[#E8E4F0]/60 text-sm italic">
                    "꿈의 파편들을 모으는 중이에요…<br />잠의 세계에서 메시지를 받아오고 있어요."
                  </p>
                </div>
                <div className="dot-bounce text-blue-400/40 text-lg"><span>·</span><span>·</span><span>·</span></div>
              </div>
            )}

            {streamText && (
              <div className="leading-relaxed">
                {renderMarkdown(streamText)}
                {!done && <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1 align-middle" />}
              </div>
            )}

            {done && (
              <div className="mt-10 pt-6 border-t border-blue-500/15 text-center space-y-3">
                <p className="text-blue-400/40 text-xs font-pixel">꿈 일기에 자동으로 저장되었습니다</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={handleReset}
                    className="px-6 py-3 border border-blue-500/40 text-blue-400 text-sm hover:border-blue-400 hover:bg-blue-500/10 transition-colors">
                    다른 꿈 해석하기
                  </button>
                  <button onClick={() => { setDiaryEntries(loadDiaryEntries()); setShowDiary(true); }}
                    className="px-6 py-3 border border-blue-500/20 text-[#E8E4F0]/50 text-sm hover:border-blue-500/40 hover:text-[#E8E4F0]/70 transition-colors">
                    꿈 일기 보기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── 꿈 일기 패널 ─────────────────────────────── */}
      {showDiary && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDiary(false)} />
          <div className="relative bg-[#0D1630] border border-blue-500/20 w-full max-w-lg max-h-[80vh] flex flex-col md:rounded-sm shadow-2xl">
            <div className="flex justify-between items-center px-5 py-4 border-b border-blue-500/15">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 glow-blue-sm">☽</span>
                <span className="font-serif-kr text-white text-sm font-semibold">꿈 일기</span>
                <span className="text-[10px] font-pixel text-blue-400/50">총 {diaryEntries.length}편</span>
              </div>
              <button onClick={() => setShowDiary(false)} className="text-[#E8E4F0]/40 hover:text-[#E8E4F0]/70 text-sm">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 space-y-3">
              {diaryEntries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-blue-400/30 text-4xl mb-4">☽</div>
                  <p className="text-[#E8E4F0]/30 text-sm">아직 기록된 꿈이 없어요</p>
                </div>
              ) : diaryEntries.map(entry => {
                const cfg = DREAM_TYPE_CONFIG[entry.dreamType] ?? DREAM_TYPE_CONFIG['일상몽'];
                return (
                  <div key={entry.id} className="border border-blue-500/15 bg-blue-500/5 p-3 group relative">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 border ${cfg.colorClass} font-pixel`}>{cfg.icon} {entry.dreamType}</span>
                        <span className="text-[10px] text-[#E8E4F0]/30 font-pixel">{entry.date}</span>
                      </div>
                      <button onClick={() => { deleteDiaryEntry(entry.id); setDiaryEntries(loadDiaryEntries()); }}
                        className="text-[10px] text-[#E8E4F0]/20 hover:text-red-400/60 transition-colors opacity-0 group-hover:opacity-100">
                        삭제
                      </button>
                    </div>
                    <p className="text-[#E8E4F0]/60 text-xs leading-relaxed line-clamp-2 mb-1">{entry.dream}</p>
                    {entry.summary && <p className="text-[#E8E4F0]/30 text-[10px] italic line-clamp-2">{entry.summary}…</p>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.emotions.slice(0,3).map(em => <span key={em} className="text-[9px] px-1.5 py-0.5 border border-blue-500/25 text-blue-400/60">{em}</span>)}
                      {entry.themes.slice(0,3).map(th => <span key={th} className="text-[9px] px-1.5 py-0.5 border border-violet-500/25 text-violet-400/60">{th}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
            {diaryEntries.length > 0 && (
              <div className="border-t border-blue-500/15 px-4 py-3">
                <div className="text-[10px] font-pixel text-blue-400/40 mb-2">꿈 유형 통계</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(diaryEntries.reduce<Record<string,number>>((acc,e) => { acc[e.dreamType]=(acc[e.dreamType]||0)+1; return acc; }, {}))
                    .sort((a,b)=>b[1]-a[1])
                    .map(([type, count]) => {
                      const cfg = DREAM_TYPE_CONFIG[type] ?? DREAM_TYPE_CONFIG['일상몽'];
                      return <span key={type} className={`text-[10px] px-2 py-0.5 border ${cfg.colorClass}`}>{cfg.icon} {type} {count}회</span>;
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
