interface Props {
  imagePath?: string;
  variant?: 'card' | 'hero';
  className?: string;
}

export default function MadameCeleste({ imagePath, variant = 'hero', className = '' }: Props) {
  if (imagePath) {
    return (
      <img
        src={imagePath}
        alt="마담 셀레스트"
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
      aria-label="마담 셀레스트 캐릭터 아트"
    >
      <defs>
        {/* 앰버/골드 오라 */}
        <radialGradient id="mc-aura" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#D97706" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#92400E" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0B0A1A" stopOpacity="0" />
        </radialGradient>
        {/* 수정구슬 글로우 */}
        <radialGradient id="mc-crystal" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#B45309" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#78350F" stopOpacity="0.1" />
        </radialGradient>
        {/* 수정구슬 외부 글로우 */}
        <radialGradient id="mc-crystal-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        {/* 인물 그라디언트 */}
        <linearGradient id="mc-figure" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#92400E" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#1C0A00" stopOpacity="0.9" />
        </linearGradient>
        {/* 드레스 그라디언트 */}
        <linearGradient id="mc-dress" x1="0%" y1="0%" x2="10%" y2="100%">
          <stop offset="0%" stopColor="#7C2D12" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#451A03" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#1C0A00" stopOpacity="1" />
        </linearGradient>
        {/* 소프트 글로우 필터 */}
        <filter id="mc-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="mc-glow2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="mc-sparkle" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* 배경 오라 */}
      <rect width="200" height="300" fill="url(#mc-aura)" />

      {/* 별자리 선들 */}
      <g opacity="0.2" stroke="#FCD34D" strokeWidth="0.5">
        <line x1="15" y1="30" x2="40" y2="55" />
        <line x1="40" y1="55" x2="25" y2="80" />
        <line x1="40" y1="55" x2="65" y2="42" />
        <line x1="170" y1="25" x2="185" y2="50" />
        <line x1="185" y1="50" x2="165" y2="65" />
        <line x1="185" y1="50" x2="195" y2="70" />
      </g>

      {/* 별자리 꼭짓점 */}
      {[
        [15, 30, 1.5, 0.6], [40, 55, 2, 0.7], [25, 80, 1.5, 0.55], [65, 42, 1.2, 0.5],
        [170, 25, 1.8, 0.65], [185, 50, 2.2, 0.75], [165, 65, 1.5, 0.55], [195, 70, 1.2, 0.45],
        [8, 120, 1.2, 0.4], [180, 100, 1.5, 0.5], [10, 200, 1, 0.35], [190, 155, 1, 0.4],
        [55, 15, 1, 0.45], [140, 12, 1.5, 0.6], [175, 180, 1, 0.35],
      ].map(([cx, cy, r, op], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#FCD34D" opacity={op} />
      ))}

      {/* 4방향 별 (♦ 다이아몬드) */}
      {[
        [155, 35, 3, 0.6], [28, 45, 2.5, 0.5], [178, 88, 2, 0.45],
      ].map(([cx, cy, size, op], i) => (
        <g key={`star-${i}`} opacity={op}>
          <polygon
            points={`${cx},${cy - size} ${cx + size * 0.3},${cy} ${cx},${cy + size} ${cx - size * 0.3},${cy}`}
            fill="#FDE68A"
          />
          <polygon
            points={`${cx - size},${cy} ${cx},${cy - size * 0.3} ${cx + size},${cy} ${cx},${cy + size * 0.3}`}
            fill="#FDE68A"
          />
        </g>
      ))}

      {/* ── 인물 ── */}

      {/* 긴 드레스 (아래로 퍼지는 형태) */}
      <path
        d="M 76,170 Q 60,210 52,295 L 148,295 Q 140,210 124,170 Z"
        fill="url(#mc-dress)"
      />
      {/* 드레스 주름선 */}
      <path d="M 82,175 Q 75,220 70,295" fill="none" stroke="#92400E" strokeWidth="0.6" strokeOpacity="0.4" />
      <path d="M 118,175 Q 125,220 130,295" fill="none" stroke="#92400E" strokeWidth="0.6" strokeOpacity="0.4" />
      <path d="M 100,170 Q 100,230 100,295" fill="none" stroke="#92400E" strokeWidth="0.6" strokeOpacity="0.3" />

      {/* 상체 (코르셋 스타일) */}
      <path
        d="M 80,135 Q 75,150 76,170 L 124,170 Q 125,150 120,135 Z"
        fill="#7C2D12" fillOpacity="0.95"
      />
      {/* 코르셋 장식선 */}
      <path d="M 92,138 L 92,170" fill="none" stroke="#D97706" strokeWidth="0.8" strokeOpacity="0.5" />
      <path d="M 108,138 L 108,170" fill="none" stroke="#D97706" strokeWidth="0.8" strokeOpacity="0.5" />
      {[145, 152, 159, 166].map((y, i) => (
        <line key={i} x1="88" y1={y} x2="112" y2={y} stroke="#D97706" strokeWidth="0.6" strokeOpacity="0.35" />
      ))}

      {/* 소매 (벨슬리브) — 왼쪽 */}
      <path
        d="M 80,138 Q 62,148 44,158 Q 38,172 55,175 Q 72,168 82,155 Z"
        fill="#7C2D12" fillOpacity="0.9"
      />
      {/* 소매 끝 장식 레이스 */}
      <path d="M 44,158 Q 38,172 55,175" fill="none" stroke="#FCD34D" strokeWidth="1.2" strokeOpacity="0.5" />

      {/* 소매 (벨슬리브) — 오른쪽 */}
      <path
        d="M 120,138 Q 138,148 156,158 Q 162,172 145,175 Q 128,168 118,155 Z"
        fill="#7C2D12" fillOpacity="0.9"
      />
      <path d="M 156,158 Q 162,172 145,175" fill="none" stroke="#FCD34D" strokeWidth="1.2" strokeOpacity="0.5" />

      {/* 왼손 — 수정구슬 받침 */}
      <ellipse cx="42" cy="175" rx="7" ry="5" fill="#92400E" fillOpacity="0.7" />

      {/* ── 수정구슬 ── */}
      {/* 외부 글로우 */}
      <circle cx="42" cy="162" r="18" fill="url(#mc-crystal-glow)" filter="url(#mc-glow2)" />
      {/* 받침대 */}
      <path d="M 30,173 Q 30,168 42,168 Q 54,168 54,173" fill="#78350F" fillOpacity="0.8" />
      {/* 수정구슬 본체 */}
      <circle cx="42" cy="160" r="14" fill="url(#mc-crystal)" />
      {/* 구슬 하이라이트 */}
      <circle cx="37" cy="154" r="4" fill="white" fillOpacity="0.4" />
      <circle cx="35" cy="152" r="1.5" fill="white" fillOpacity="0.7" />
      {/* 구슬 안 타로 카드 환영 */}
      <rect x="36" y="155" width="12" height="9" rx="1" fill="#D97706" fillOpacity="0.3" transform="rotate(-10 42 159)" />
      <line x1="42" y1="156" x2="42" y2="164" stroke="#FCD34D" strokeWidth="0.5" strokeOpacity="0.4" />
      {/* 구슬 테두리 */}
      <circle cx="42" cy="160" r="14" fill="none" stroke="#FCD34D" strokeWidth="0.8" strokeOpacity="0.4" />

      {/* 머리 */}
      <circle cx="100" cy="115" r="17" fill="#92400E" fillOpacity="0.9" />

      {/* 머리카락 (긴 웨이브) */}
      <path
        d="M 84,113 Q 80,120 78,135 Q 76,150 80,165"
        fill="none" stroke="#451A03" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.9"
      />
      <path
        d="M 116,113 Q 120,120 122,135 Q 124,150 120,165"
        fill="none" stroke="#451A03" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.9"
      />
      {/* 머리카락 하이라이트 */}
      <path d="M 85,113 Q 82,125 80,140" fill="none" stroke="#92400E" strokeWidth="2" strokeOpacity="0.5" />

      {/* 넓은 챙 모자 */}
      <ellipse cx="100" cy="104" rx="32" ry="8" fill="#1C0A00" fillOpacity="0.97" />
      {/* 모자 크라운 */}
      <rect x="85" y="76" width="30" height="29" rx="4" fill="#1C0A00" fillOpacity="0.97" />
      <ellipse cx="100" cy="76" rx="15" ry="4" fill="#2D1306" fillOpacity="0.97" />
      {/* 모자 리본 */}
      <rect x="85" y="100" width="30" height="5" rx="1" fill="#D97706" fillOpacity="0.8" />
      {/* 모자 별 장식 */}
      <polygon
        points="100,79 101.5,83 106,83 102.5,86 104,90 100,87.5 96,90 97.5,86 94,83 98.5,83"
        fill="#FCD34D" fillOpacity="0.9"
      />

      {/* 눈 (가늘고 신비로운) */}
      <ellipse cx="94" cy="118" rx="4" ry="1.5" fill="#1C0A00" />
      <ellipse cx="106" cy="118" rx="4" ry="1.5" fill="#1C0A00" />
      <circle cx="95" cy="118" r="1.5" fill="#D97706" fillOpacity="0.7" />
      <circle cx="107" cy="118" r="1.5" fill="#D97706" fillOpacity="0.7" />

      {/* 목 걸이 */}
      <path
        d="M 88,130 Q 100,136 112,130"
        fill="none" stroke="#D97706" strokeWidth="1" strokeOpacity="0.7"
      />
      <circle cx="100" cy="135" r="2.5" fill="#FCD34D" fillOpacity="0.8" />

      {/* ── 장식 요소 ── */}

      {/* 떠다니는 타로 카드들 */}
      {isHero && (
        <>
          <g transform="rotate(-15 170 70)" opacity="0.5">
            <rect x="163" y="55" width="14" height="22" rx="1.5" fill="#92400E" />
            <rect x="164" y="56" width="12" height="20" rx="1" fill="#B45309" />
            <line x1="170" y1="58" x2="170" y2="74" stroke="#FCD34D" strokeWidth="0.5" strokeOpacity="0.6" />
            <line x1="165" y1="66" x2="175" y2="66" stroke="#FCD34D" strokeWidth="0.5" strokeOpacity="0.6" />
          </g>
          <g transform="rotate(12 25 90)" opacity="0.4">
            <rect x="18" y="78" width="14" height="22" rx="1.5" fill="#92400E" />
            <rect x="19" y="79" width="12" height="20" rx="1" fill="#B45309" />
            <text x="25" y="92" fontSize="8" textAnchor="middle" fill="#FCD34D" fillOpacity="0.7">★</text>
          </g>
        </>
      )}

      {/* ✦ 스파클 */}
      {[
        [145, 45, 0.65], [28, 35, 0.55], [172, 140, 0.5], [12, 165, 0.4],
      ].map(([cx, cy, op], i) => (
        <text key={`sparkle-${i}`} x={cx} y={cy} fontSize="10" textAnchor="middle" fill="#FCD34D" fillOpacity={op} filter="url(#mc-sparkle)">✦</text>
      ))}

      {/* 바닥 글로우 */}
      <ellipse cx="100" cy="293" rx="55" ry="7" fill="#D97706" fillOpacity="0.18" />

      {/* 수정구슬 하단 테이블 글로우 */}
      <ellipse cx="42" cy="178" rx="18" ry="4" fill="#F59E0B" fillOpacity="0.15" />
    </svg>
  );
}
