import Link from 'next/link';
import Spline from '@splinetool/react-spline/next';

const features = [
  { icon: '◈', title: '타고난 기질', desc: '일간을 중심으로 타고난 성격과 잠재력 분석' },
  { icon: '◈', title: '직업/이직운', desc: '적성에 맞는 커리어와 최적의 시기' },
  { icon: '◈', title: '연애운', desc: '이상적인 배우자상과 연애 패턴 분석' },
  { icon: '◈', title: '재물운', desc: '금전 흐름과 재물을 모으는 방식' },
  { icon: '◈', title: '건강운', desc: '체질적 특성과 주의해야 할 건강 포인트' },
  { icon: '◈', title: '올해 운세', desc: '대운·세운 기반 올해 총평' },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0f] overflow-x-hidden">

      {/* Spline 3D 배경 — Server Component에서 직접 사용 */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <Spline
          scene="https://prod.spline.design/xO9daeBza9f-8Vl8/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* 그라디언트 오버레이: 왼쪽 어둡게 → 오른쪽 투명 */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/85 to-[#0a0a0f]/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/70 via-transparent to-[#0a0a0f]" />
      </div>

      {/* 콘텐츠 레이어 */}
      <div className="relative z-[2] flex flex-col min-h-screen pointer-events-none">

        {/* 헤더 */}
        <header className="pointer-events-auto flex justify-between items-center px-8 py-6">
          <span className="font-pixel text-green-400 text-sm glow-green-sm tracking-wider">AI사주</span>
          <nav className="flex items-center gap-6">
            <Link href="/input?mode=standard" className="text-xs text-gray-400 hover:text-green-400 transition-colors">
              사주분석
            </Link>
            <Link href="/input?mode=daily" className="text-xs text-gray-400 hover:text-green-400 transition-colors">
              오늘의 운세
            </Link>
          </nav>
        </header>

        {/* 히어로 */}
        <section className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-10">
          <div className="max-w-lg">
            <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 border border-green-400/30 rounded-full text-green-400/80 text-[11px] mb-8 bg-green-400/5 font-pixel">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
              AI 기반 만세력 사주팔자 분석
            </div>

            <h1 className="font-pixel text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6">
              <span className="text-white">AI</span>
              <span className="text-green-400 glow-green">사주</span>
            </h1>

            <p className="text-green-400/80 text-base md:text-xl font-pixel mb-5 tracking-wider leading-relaxed">
              AI가 당신의 사주를<br />해킹합니다
            </p>

            <p className="text-gray-500 text-sm mb-10 leading-loose max-w-sm">
              절기 기반 정확한 만세력으로 타고난 기질부터<br />
              재물운까지 AI가 사주팔자를 심층 분석합니다
            </p>

            <div className="pointer-events-auto flex flex-col sm:flex-row gap-3">
              <Link
                href="/input?mode=standard"
                className="inline-block px-8 py-3.5 bg-green-400 text-black font-bold text-sm hover:bg-green-300 active:bg-green-500 transition-colors font-pixel text-center"
              >
                사주 분석 시작
              </Link>
              <Link
                href="/input?mode=daily"
                className="inline-block px-8 py-3.5 border border-green-400/40 text-green-400 text-sm hover:border-green-400 hover:bg-green-400/10 active:bg-green-400/20 transition-colors font-pixel text-center"
              >
                오늘의 운세
              </Link>
            </div>
          </div>
        </section>

        {/* 기능 카드 */}
        <section className="pointer-events-auto px-8 md:px-16 lg:px-24 pb-10">
          <div className="max-w-2xl">
            <div className="mb-4">
              <span className="text-green-400/30 text-[10px] font-pixel tracking-[0.3em]">// FEATURES</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="border border-green-400/15 bg-[#0a0a0f]/80 backdrop-blur-sm p-3 hover:border-green-400/40 hover:bg-green-400/5 transition-all duration-200 cursor-default group"
                >
                  <div className="text-green-400/60 text-xs mb-1.5 group-hover:text-green-400 transition-colors">{f.icon}</div>
                  <h3 className="text-white/80 text-[11px] font-bold mb-1 leading-tight">{f.title}</h3>
                  <p className="text-gray-600 text-[10px] leading-relaxed hidden md:block">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="px-8 pb-6 text-gray-700 text-[10px] font-pixel">
          AI사주 · 만세력 기반 사주팔자 분석
        </footer>
      </div>
    </main>
  );
}
