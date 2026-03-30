'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

const EMOTION_OPTIONS = ['기쁨', '불안', '두려움', '혼란', '평온', '슬픔', '설렘', '당혹'];
const THEME_OPTIONS   = ['비행', '추락', '물', '불', '동물', '사람', '죽음', '탈출', '집', '길', '이성', '직장'];

function renderMarkdown(text: string) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  return lines.map((line, i) => {
    const t = line.trim();
    if (t.startsWith('## '))
      return <h2 key={i} className="text-blue-400 font-serif-kr text-base font-semibold mt-7 mb-3 pb-1.5 border-b border-blue-500/20 first:mt-0">{t.slice(3)}</h2>;
    if (t.startsWith('### '))
      return <h3 key={i} className="text-blue-300/80 text-sm font-medium mt-4 mb-2">{t.slice(4)}</h3>;
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

export default function DreamPage() {
  const [dream, setDream] = useState('');
  const [emotions, setEmotions] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [streamText, setStreamText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const calledRef = useRef(false);

  const toggleEmotion = (e: string) =>
    setEmotions(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);

  const toggleTheme = (t: string) =>
    setThemes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim() || calledRef.current) return;
    calledRef.current = true;
    setSubmitted(true);
    setStreaming(true);

    try {
      const res = await fetch('/api/dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream, emotions, themes }),
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
    setDream('');
    setEmotions([]);
    setThemes([]);
    setStreamText('');
    setStreaming(false);
    setDone(false);
    setError('');
    setSubmitted(false);
    calledRef.current = false;
  };

  return (
    <div className="min-h-screen bg-[#0B1326]">

      {/* 헤더 */}
      <header className="flex justify-between items-center px-6 py-5 border-b border-blue-500/15">
        <Link href="/" className="font-serif-kr text-[#E8E4F0]/70 text-sm hover:text-[#E8E4F0] transition-colors">
          ← 운세 에이전트
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-lg">☽</span>
          <span className="font-serif-kr text-[#E8E4F0]/80 text-sm">꿈해몽</span>
        </div>
        {submitted && (
          <button onClick={handleReset} className="text-[10px] font-pixel text-[#E8E4F0]/40 hover:text-[#E8E4F0]/70 transition-colors">
            새 꿈 해석
          </button>
        )}
        {!submitted && <div className="w-16" />}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* ── 입력 폼 ──────────────────────────────────────────── */}
        {!submitted && (
          <div>
            <div className="text-center mb-10">
              <div className="text-5xl text-blue-400 mb-5 float" style={{ textShadow:'0 0 14px rgba(96,165,250,0.8)' }}>☽</div>
              <h1 className="font-serif-kr text-2xl text-white font-semibold mb-3">
                꿈 이야기를 들려주세요
              </h1>
              <p className="text-[#E8E4F0]/45 text-sm leading-relaxed">
                어젯밤 꿈을 자세히 적어주세요<br />
                AI가 심리학적·운세적 관점에서 해석해 드립니다
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 꿈 내용 */}
              <div className="border border-blue-500/20 bg-blue-500/5 p-5">
                <label className="block text-xs text-blue-400/70 font-pixel mb-3 tracking-wider">
                  // 꿈 내용
                </label>
                <textarea
                  value={dream}
                  onChange={e => setDream(e.target.value)}
                  placeholder="꿈에서 무슨 일이 있었나요? 장소, 등장인물, 사건, 느낌 등 기억나는 것을 모두 적어주세요."
                  rows={6}
                  required
                  className="w-full bg-transparent border border-blue-500/25 text-[#E8E4F0] text-sm px-4 py-3 resize-none focus:outline-none focus:border-blue-400 transition-colors placeholder:text-[#E8E4F0]/25 leading-relaxed"
                />
                <p className="text-[#E8E4F0]/25 text-xs mt-2">
                  자세할수록 더 정확한 해몽이 가능합니다
                </p>
              </div>

              {/* 꿈 속 감정 */}
              <div>
                <label className="block text-xs text-blue-400/70 font-pixel mb-3 tracking-wider">
                  // 꿈 속에서 느낀 감정 (복수 선택 가능)
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOTION_OPTIONS.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => toggleEmotion(em)}
                      className={`px-3 py-1.5 text-xs border transition-colors ${
                        emotions.includes(em)
                          ? 'border-blue-400 bg-blue-600/20 text-blue-300'
                          : 'border-blue-500/20 text-[#E8E4F0]/40 hover:border-blue-500/50'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* 꿈 주요 테마 */}
              <div>
                <label className="block text-xs text-blue-400/70 font-pixel mb-3 tracking-wider">
                  // 꿈에 등장한 주요 요소 (복수 선택 가능)
                </label>
                <div className="flex flex-wrap gap-2">
                  {THEME_OPTIONS.map(th => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => toggleTheme(th)}
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

              <button
                type="submit"
                disabled={!dream.trim()}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors mt-2"
              >
                꿈 해석하기
              </button>
            </form>
          </div>
        )}

        {/* ── 결과 영역 ─────────────────────────────────────────── */}
        {submitted && (
          <div>
            {/* 꿈 요약 */}
            <div className="border border-blue-500/20 bg-blue-500/5 p-4 mb-8">
              <div className="text-[10px] font-pixel text-blue-400/50 mb-2">// 꿈 내용</div>
              <p className="text-[#E8E4F0]/60 text-sm leading-relaxed line-clamp-4">{dream}</p>
              {(emotions.length > 0 || themes.length > 0) && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {emotions.map(e => (
                    <span key={e} className="text-[10px] px-2 py-0.5 border border-blue-500/30 bg-blue-600/15 text-blue-300">{e}</span>
                  ))}
                  {themes.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 border border-violet-500/30 bg-violet-600/15 text-violet-300">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* 에러 */}
            {error && (
              <div className="text-center py-8">
                <p className="text-red-400 text-sm mb-4">{error}</p>
                <button onClick={handleReset} className="text-blue-400 text-xs hover:underline">← 다시 시도</button>
              </div>
            )}

            {/* 로딩 */}
            {!streamText && streaming && (
              <div className="flex items-center gap-3 text-[#E8E4F0]/40 text-sm py-8">
                <div className="w-4 h-4 border border-blue-400/30 border-t-blue-400 rounded-full animate-spin shrink-0" />
                <span className="font-pixel text-blue-400/50 animate-pulse text-xs">꿈의 상징을 해석하는 중...</span>
              </div>
            )}

            {/* 스트리밍 텍스트 */}
            {streamText && (
              <div className="leading-relaxed">
                {renderMarkdown(streamText)}
                {!done && (
                  <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1 align-middle" />
                )}
              </div>
            )}

            {/* 다시하기 */}
            {done && (
              <div className="mt-10 pt-6 border-t border-blue-500/15 text-center">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 border border-blue-500/40 text-blue-400 text-sm hover:border-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                  다른 꿈 해석하기
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
