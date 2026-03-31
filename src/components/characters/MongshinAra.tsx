interface Props {
  imagePath?: string;
  variant?: 'card' | 'hero';
  className?: string;
}

export default function MongshinAra({ imagePath, variant = 'hero', className = '' }: Props) {
  if (imagePath) {
    return (
      <img
        src={imagePath}
        alt="몽신 아라"
        className={`object-cover object-top w-full h-full ${className}`}
        draggable={false}
      />
    );
  }

  const isHero = variant === 'hero';

  return (
    <svg
      viewBox="0 0 200 300"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      aria-label="몽신 아라 캐릭터 아트"
    >
      <defs>
        {/* 달빛 블루 오라 */}
        <radialGradient id="ma-aura" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#1E3A5F" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#030712" stopOpacity="0" />
        </radialGradient>
        {/* 달 그라디언트 */}
        <radialGradient id="ma-moon" cx="38%" cy="32%" r="55%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#BAE6FD" stopOpacity="0.85" />
          <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.3" />
        </radialGradient>
        {/* 달 글로우 */}
        <radialGradient id="ma-moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
        </radialGradient>
        {/* 인물 그라디언트 */}
        <linearGradient id="ma-figure" x1="0%" y1="0%" x2="10%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0C1445" stopOpacity="0.95" />
        </linearGradient>
        {/* 구름 그라디언트 */}
        <radialGradient id="ma-cloud" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
        {/* 오브 그라디언트 */}
        <radialGradient id="ma-orb" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.3" />
        </radialGradient>
        {/* 소프트 글로우 필터 */}
        <filter id="ma-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="ma-glow2" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="ma-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* 배경 오라 */}
      <rect width="200" height="300" fill="url(#ma-aura)" />

      {/* 큰 달 글로우 */}
      <circle cx="140" cy="72" r="50" fill="url(#ma-moon-glow)" filter="url(#ma-glow2)" />
      {/* 달 본체 */}
      <circle cx="140" cy="72" r="36" fill="url(#ma-moon)" />
      {/* 달 표면 질감 */}
      <circle cx="132" cy="65" r="6" fill="#93C5FD" fillOpacity="0.15" />
      <circle cx="148" cy="78" r="4" fill="#93C5FD" fillOpacity="0.12" />
      <circle cx="138" cy="80" r="3" fill="#93C5FD" fillOpacity="0.1" />
      {/* 달 테두리 링 */}
      <circle cx="140" cy="72" r="36" fill="none" stroke="#E0F2FE" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="140" cy="72" r="42" fill="none" stroke="#BAE6FD" strokeWidth="0.5" strokeOpacity="0.2" />

      {/* 구름들 */}
      {[
        { cx: 30, cy: 230, rx: 35, ry: 12 },
        { cx: 80, cy: 250, rx: 28, ry: 9 },
        { cx: 160, cy: 240, rx: 32, ry: 10 },
        { cx: 15, cy: 270, rx: 20, ry: 7 },
        { cx: 170, cy: 265, rx: 25, ry: 8 },
      ].map((c, i) => (
        <ellipse key={i} cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} fill="url(#ma-cloud)" />
      ))}

      {/* 떠다니는 오브들 */}
      {[
        { cx: 25, cy: 155, r: 5 },
        { cx: 172, cy: 170, r: 6 },
        { cx: 15, cy: 195, r: 3.5 },
        { cx: 180, cy: 210, r: 4 },
      ].map((o, i) => (
        <g key={`orb-${i}`}>
          <circle cx={o.cx} cy={o.cy} r={o.r * 2.5} fill="#38BDF8" fillOpacity="0.08" />
          <circle cx={o.cx} cy={o.cy} r={o.r} fill="url(#ma-orb)" />
          <circle cx={o.cx - o.r * 0.3} cy={o.cy - o.r * 0.3} r={o.r * 0.3} fill="white" fillOpacity="0.7" />
        </g>
      ))}

      {/* ── 인물 ── */}

      {/* 하의 (흐르는 드레스/가운) */}
      <path
        d="M 78,172 Q 55,215 48,295 L 152,295 Q 145,215 122,172 Z"
        fill="url(#ma-figure)"
      />
      {/* 가운 흐름 주름선 */}
      <path d="M 86,175 Q 74,218 68,295" fill="none" stroke="#3B82F6" strokeWidth="0.6" strokeOpacity="0.35" />
      <path d="M 114,175 Q 126,218 132,295" fill="none" stroke="#3B82F6" strokeWidth="0.6" strokeOpacity="0.35" />
      <path d="M 100,172 Q 100,233 100,295" fill="none" stroke="#60A5FA" strokeWidth="0.5" strokeOpacity="0.25" />

      {/* 상체 */}
      <path
        d="M 82,135 Q 78,152 78,172 L 122,172 Q 122,152 118,135 Z"
        fill="#1E3A8A" fillOpacity="0.92"
      />

      {/* 긴 소매 — 왼쪽 (반투명 흐르는 느낌) */}
      <path
        d="M 82,140 Q 60,152 40,162 Q 35,175 58,172 Q 76,165 85,152 Z"
        fill="#1E3A8A" fillOpacity="0.85"
      />
      {/* 소매 끝 달빛 선 */}
      <path d="M 40,162 Q 35,175 58,172" fill="none" stroke="#7DD3FC" strokeWidth="1.2" strokeOpacity="0.55" />

      {/* 긴 소매 — 오른쪽 */}
      <path
        d="M 118,140 Q 140,152 160,162 Q 165,175 142,172 Q 124,165 115,152 Z"
        fill="#1E3A8A" fillOpacity="0.85"
      />
      <path d="M 160,162 Q 165,175 142,172" fill="none" stroke="#7DD3FC" strokeWidth="1.2" strokeOpacity="0.55" />

      {/* 왼손 — 오브 받침 */}
      <ellipse cx="36" cy="174" rx="8" ry="5" fill="#1E3A8A" fillOpacity="0.7" />

      {/* ── 꿈의 오브 (왼손) ── */}
      {/* 외부 대형 글로우 */}
      <circle cx="36" cy="160" r="22" fill="#38BDF8" fillOpacity="0.08" filter="url(#ma-glow2)" />
      {/* 오브 본체 */}
      <circle cx="36" cy="160" r="13" fill="url(#ma-orb)" />
      {/* 오브 안 별 패턴 */}
      <text x="36" y="165" fontSize="10" textAnchor="middle" fill="#E0F2FE" fillOpacity="0.6">✦</text>
      {/* 오브 하이라이트 */}
      <circle cx="31" cy="154" r="3.5" fill="white" fillOpacity="0.45" />
      <circle cx="30" cy="153" r="1.5" fill="white" fillOpacity="0.75" />
      {/* 오브 테두리 */}
      <circle cx="36" cy="160" r="13" fill="none" stroke="#7DD3FC" strokeWidth="0.8" strokeOpacity="0.5" />
      {/* 오브 주위 고리 */}
      <ellipse cx="36" cy="160" rx="18" ry="5" fill="none" stroke="#38BDF8" strokeWidth="0.7" strokeOpacity="0.3" transform="rotate(-20 36 160)" />

      {/* 머리 */}
      <circle cx="100" cy="113" r="18" fill="#1E3A8A" fillOpacity="0.88" />

      {/* 긴 은발/청발 머리카락 */}
      <path
        d="M 84,110 Q 80,125 76,145 Q 74,162 78,178"
        fill="none" stroke="#BAE6FD" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.8"
      />
      <path
        d="M 116,110 Q 120,125 124,145 Q 126,162 122,178"
        fill="none" stroke="#BAE6FD" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.8"
      />
      {/* 머리카락 하이라이트 */}
      <path d="M 85,112 Q 82,130 80,148" fill="none" stroke="#E0F2FE" strokeWidth="2" strokeOpacity="0.5" />
      <path d="M 115,112 Q 118,130 120,148" fill="none" stroke="#E0F2FE" strokeWidth="2" strokeOpacity="0.5" />

      {/* 정수리 장식 — 초승달 머리핀 */}
      <path
        d="M 93,95 Q 93,86 100,85 Q 107,86 107,95"
        fill="none" stroke="#7DD3FC" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9"
      />
      {/* 별 머리핀 */}
      <circle cx="100" cy="84" r="2.5" fill="#E0F2FE" fillOpacity="0.95" />
      <circle cx="91" cy="97" r="1.5" fill="#7DD3FC" fillOpacity="0.8" />
      <circle cx="109" cy="97" r="1.5" fill="#7DD3FC" fillOpacity="0.8" />

      {/* 얼굴 — 반쯤 감긴 눈 (꿈꾸는 표정) */}
      <path d="M 90,117 Q 94,114 98,117" fill="none" stroke="#E0F2FE" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
      <path d="M 102,117 Q 106,114 110,117" fill="none" stroke="#E0F2FE" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
      {/* 눈 밑 달빛 반사 */}
      <path d="M 90,119 Q 94,121 98,119" fill="none" stroke="#7DD3FC" strokeWidth="0.7" strokeOpacity="0.4" />
      <path d="M 102,119 Q 106,121 110,119" fill="none" stroke="#7DD3FC" strokeWidth="0.7" strokeOpacity="0.4" />

      {/* ── 장식 ── */}

      {/* 떠다니는 꿈 글자 */}
      <text
        x="22" y="100"
        fontSize="20" fontFamily="'Noto Serif KR', serif" fontWeight="bold"
        fill="#7DD3FC" fillOpacity="0.4" textAnchor="middle"
        filter="url(#ma-glow)"
      >夢</text>

      {/* 작은 별들 */}
      {[
        [12, 30, 1.5, 0.6], [45, 18, 1, 0.5], [70, 35, 1.2, 0.55],
        [175, 15, 1.8, 0.65], [190, 40, 1.2, 0.5], [10, 65, 1, 0.4],
        [185, 130, 1, 0.4], [8, 155, 1.2, 0.45], [192, 185, 1, 0.35],
        [55, 8, 1, 0.45], [130, 10, 1.5, 0.55], [165, 100, 1, 0.4],
      ].map(([cx, cy, r, op], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#BAE6FD" opacity={op} />
      ))}

      {/* 반짝임 (✦) */}
      {[
        [160, 55, 0.5], [18, 75, 0.45], [178, 105, 0.4],
      ].map(([cx, cy, op], i) => (
        <text key={`sp-${i}`} x={cx} y={cy} fontSize="9" textAnchor="middle" fill="#7DD3FC" fillOpacity={op} filter="url(#ma-soft)">✦</text>
      ))}

      {/* 흐르는 안개 (가운 아래) */}
      {isHero && (
        <>
          <ellipse cx="90" cy="292" rx="30" ry="6" fill="#38BDF8" fillOpacity="0.1" />
          <ellipse cx="115" cy="295" rx="25" ry="5" fill="#38BDF8" fillOpacity="0.08" />
        </>
      )}

      {/* 바닥 글로우 */}
      <ellipse cx="100" cy="293" rx="55" ry="7" fill="#3B82F6" fillOpacity="0.15" />

      {/* 오브 하단 테이블 글로우 */}
      <ellipse cx="36" cy="177" rx="18" ry="4" fill="#38BDF8" fillOpacity="0.15" />
    </svg>
  );
}
