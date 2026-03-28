'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const HOURS = [
  { value: '0',  label: '자시 (23:00 - 01:00)' },
  { value: '2',  label: '축시 (01:00 - 03:00)' },
  { value: '4',  label: '인시 (03:00 - 05:00)' },
  { value: '6',  label: '묘시 (05:00 - 07:00)' },
  { value: '8',  label: '진시 (07:00 - 09:00)' },
  { value: '10', label: '사시 (09:00 - 11:00)' },
  { value: '12', label: '오시 (11:00 - 13:00)' },
  { value: '14', label: '미시 (13:00 - 15:00)' },
  { value: '16', label: '신시 (15:00 - 17:00)' },
  { value: '18', label: '유시 (17:00 - 19:00)' },
  { value: '20', label: '술시 (19:00 - 21:00)' },
  { value: '22', label: '해시 (21:00 - 23:00)' },
];

function InputForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'standard';
  const isDaily = mode === 'daily';

  const [form, setForm] = useState({
    name: '',
    gender: 'male',
    year: '',
    month: '',
    day: '',
    hour: '12',
    unknownTime: false,
  });

  const set = (k: string, v: string | boolean) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.year || !form.month || !form.day) return;

    const params = new URLSearchParams({
      name: form.name,
      gender: form.gender,
      year: form.year,
      month: form.month,
      day: form.day,
      hour: form.unknownTime ? '12' : form.hour,
      unknownTime: form.unknownTime ? '1' : '0',
      mode,
    });
    router.push(`/result?${params.toString()}`);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* 헤더 */}
      <header className="flex justify-between items-center px-6 py-5">
        <Link href="/" className="font-pixel text-green-400 text-sm glow-green-sm hover:text-green-300 transition-colors">
          ← AI사주
        </Link>
        <span className="text-green-400/60 text-xs font-pixel">
          {isDaily ? '오늘의 운세' : '사주 분석'}
        </span>
      </header>

      {/* 폼 */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="text-green-400/50 text-xs font-pixel tracking-widest mb-3">
              {isDaily ? '// TODAY FORTUNE' : '// SAJU ANALYSIS'}
            </div>
            <h1 className="font-pixel text-2xl text-white mb-2">
              {isDaily ? '오늘의 운세' : '사주 분석'}
            </h1>
            <p className="text-gray-500 text-xs">
              {isDaily
                ? '오늘 하루의 운세를 AI가 분석해드립니다'
                : '만세력 기반으로 사주팔자를 정확하게 분석합니다'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이름 */}
            <div>
              <label className="block text-xs text-green-400/70 font-pixel mb-2">이름</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="이름을 입력하세요"
                required
                className="w-full bg-transparent border border-green-400/30 text-white text-sm px-4 py-3 focus:outline-none focus:border-green-400 transition-colors placeholder:text-gray-600"
              />
            </div>

            {/* 성별 */}
            <div>
              <label className="block text-xs text-green-400/70 font-pixel mb-2">성별</label>
              <div className="flex gap-3">
                {[['male', '남성'], ['female', '여성']].map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => set('gender', val)}
                    className={`flex-1 py-3 text-sm font-pixel border transition-colors ${
                      form.gender === val
                        ? 'border-green-400 bg-green-400/15 text-green-400'
                        : 'border-green-400/20 text-gray-500 hover:border-green-400/50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 생년월일 */}
            <div>
              <label className="block text-xs text-green-400/70 font-pixel mb-2">생년월일</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={form.year}
                  onChange={e => set('year', e.target.value)}
                  required
                  className="bg-[#0a0a0f] border border-green-400/30 text-white text-sm px-3 py-3 focus:outline-none focus:border-green-400 transition-colors appearance-none"
                >
                  <option value="">년</option>
                  {years.map(y => <option key={y} value={y}>{y}년</option>)}
                </select>
                <select
                  value={form.month}
                  onChange={e => set('month', e.target.value)}
                  required
                  className="bg-[#0a0a0f] border border-green-400/30 text-white text-sm px-3 py-3 focus:outline-none focus:border-green-400 transition-colors appearance-none"
                >
                  <option value="">월</option>
                  {months.map(m => <option key={m} value={m}>{m}월</option>)}
                </select>
                <select
                  value={form.day}
                  onChange={e => set('day', e.target.value)}
                  required
                  className="bg-[#0a0a0f] border border-green-400/30 text-white text-sm px-3 py-3 focus:outline-none focus:border-green-400 transition-colors appearance-none"
                >
                  <option value="">일</option>
                  {days.map(d => <option key={d} value={d}>{d}일</option>)}
                </select>
              </div>
            </div>

            {/* 태어난 시간 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-green-400/70 font-pixel">태어난 시간</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.unknownTime}
                    onChange={e => set('unknownTime', e.target.checked)}
                    className="accent-green-400"
                  />
                  <span className="text-xs text-gray-500">모름</span>
                </label>
              </div>
              <select
                value={form.hour}
                onChange={e => set('hour', e.target.value)}
                disabled={form.unknownTime}
                className="w-full bg-[#0a0a0f] border border-green-400/30 text-white text-sm px-3 py-3 focus:outline-none focus:border-green-400 transition-colors appearance-none disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {HOURS.map(h => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
              {form.unknownTime && (
                <p className="text-gray-600 text-xs mt-1.5">시주는 낮 12시 기준으로 계산됩니다</p>
              )}
            </div>

            {/* 제출 */}
            <button
              type="submit"
              className="w-full py-4 bg-green-400 text-black font-bold text-sm font-pixel hover:bg-green-300 transition-colors mt-6"
            >
              {isDaily ? '오늘의 운세 분석하기' : '사주 분석 시작하기'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function InputPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <span className="font-pixel text-green-400 text-sm animate-pulse">Loading...</span>
      </div>
    }>
      <InputForm />
    </Suspense>
  );
}
