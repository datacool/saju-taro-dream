interface Props {
  /** 실제 이미지 경로 — 준비되면 이 prop을 넘기면 SVG 대신 이미지 표시 */
  imagePath?: string;
  variant?: 'card' | 'hero';
  className?: string;
}

export default function BakJinin({ imagePath, variant = 'hero', className = '' }: Props) {
  if (imagePath) {
    return (
      <img
        src={imagePath}
        alt="박진인"
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
      aria-label="박진인 캐릭터 아트"
    >
      <defs>
        {/* 보라 배경 오라 */}
        <radialGradient id="bj-aura" cx="50%" cy="58%" r="55%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#4C1D95" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0B1326" stopOpacity="0" />
        </radialGradient>
        {/* 달 글로우 */}
        <radialGradient id="bj-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#7C3AED" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
        {/* 인물 그라디언트 */}
        <linearGradient id="bj-figure" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#2E1065" stopOpacity="0.9" />
        </linearGradient>
        {/* 부드러운 글로우 필터 */}
        <filter id="bj-softglow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="bj-glow2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* 배경 오라 */}
      <rect width="200" height="300" fill="url(#bj-aura)" />

      {/* 달 — 뒤쪽 글로우 */}
      <circle cx="118" cy="88" r="60" fill="url(#bj-moon)" />
      {/* 달 테두리 */}
      <circle cx="118" cy="88" r="46" fill="none" stroke="#C4B5FD" strokeWidth="1" strokeOpacity="0.2" />
      <circle cx="118" cy="88" r="40" fill="none" stroke="#A78BFA" strokeWidth="0.5" strokeOpacity="0.15" />
      {/* 초승달 효과 (안쪽 어두운 원) */}
      <circle cx="124" cy="85" r="36" fill="#0B1326" fillOpacity="0.55" />

      {/* 산 실루엣 */}
      <polygon points="0,300 50,225 100,300" fill="#1E0A4E" opacity="0.85" />
      <polygon points="35,300 105,195 178,300" fill="#130830" opacity="0.9" />
      <polygon points="115,300 175,215 235,300" fill="#1E0A4E" opacity="0.8" />
      {/* 산 안개선 */}
      <line x1="0" y1="265" x2="200" y2="265" stroke="#4C1D95" strokeWidth="0.5" strokeOpacity="0.2" />
      <line x1="0" y1="275" x2="200" y2="275" stroke="#4C1D95" strokeWidth="0.5" strokeOpacity="0.15" />

      {/* ── 인물 실루엣 ── */}

      {/* 도포 하의 (넓은 종 모양) */}
      <path
        d="M 72,175 Q 58,220 52,295 L 148,295 Q 142,220 128,175 Z"
        fill="url(#bj-figure)"
      />
      {/* 도포 상의 */}
      <path
        d="M 78,135 Q 72,148 72,175 L 128,175 Q 128,148 122,135 Z"
        fill="#5B21B6" fillOpacity="0.95"
      />
      {/* 넓은 소매 — 왼쪽 */}
      <path
        d="M 78,142 Q 55,155 36,165 Q 40,177 62,172 Q 76,162 84,150 Z"
        fill="#4C1D95" fillOpacity="0.9"
      />
      {/* 넓은 소매 — 오른쪽 */}
      <path
        d="M 122,142 Q 145,155 164,165 Q 160,177 138,172 Q 124,162 116,150 Z"
        fill="#4C1D95" fillOpacity="0.9"
      />
      {/* 소매 끝 흰 선 장식 */}
      <path d="M 36,165 Q 40,177 62,172" fill="none" stroke="#A78BFA" strokeWidth="1.2" strokeOpacity="0.4" />
      <path d="M 164,165 Q 160,177 138,172" fill="none" stroke="#A78BFA" strokeWidth="1.2" strokeOpacity="0.4" />

      {/* 두루마리 (왼손) */}
      <rect x="28" y="168" width="11" height="22" rx="2.5" fill="#7C3AED" fillOpacity="0.6" />
      <rect x="26" y="165" width="15" height="5" rx="1.5" fill="#9333EA" fillOpacity="0.5" />
      <rect x="26" y="185" width="15" height="5" rx="1.5" fill="#9333EA" fillOpacity="0.5" />
      <line x1="33.5" y1="168" x2="33.5" y2="190" stroke="#C4B5FD" strokeWidth="0.8" strokeOpacity="0.4" />

      {/* 머리 */}
      <circle cx="100" cy="115" r="18" fill="#5B21B6" fillOpacity="0.95" />

      {/* 갓 (한국 전통 모자) — 챙 */}
      <ellipse cx="100" cy="102" rx="26" ry="7" fill="#2E0B5F" fillOpacity="0.95" />
      {/* 갓 — 상단 */}
      <ellipse cx="100" cy="96" rx="14" ry="4" fill="#3B0764" fillOpacity="0.95" />
      <rect x="87" y="79" width="26" height="18" rx="3" fill="#2E0B5F" fillOpacity="0.95" />
      <ellipse cx="100" cy="79" rx="13" ry="3.5" fill="#4B1AA3" fillOpacity="0.9" />

      {/* 수염 */}
      <path
        d="M 92,129 C 89,140 88,152 91,168 C 96,162 100,172 104,162 C 107,152 111,140 108,129"
        fill="#3B0764" fillOpacity="0.85"
      />
      {/* 수염 세부선 */}
      <path d="M 96,130 C 94,145 94,158 96,168" fill="none" stroke="#6D28D9" strokeWidth="0.8" strokeOpacity="0.3" />
      <path d="M 104,130 C 106,145 106,158 104,168" fill="none" stroke="#6D28D9" strokeWidth="0.8" strokeOpacity="0.3" />

      {/* ── 장식 요소 ── */}

      {/* 부유하는 仙 한자 */}
      <text
        x="162" y="76"
        fontSize="26" fontFamily="'Noto Serif KR', serif" fontWeight="bold"
        fill="#A78BFA" fillOpacity="0.55" textAnchor="middle"
        filter="url(#bj-softglow)"
      >仙</text>

      {/* 팔괘 기호들 */}
      <text x="22" y="110" fontSize="11" fontFamily="monospace" fill="#8B5CF6" fillOpacity="0.35">☰</text>
      <text x="170" y="130" fontSize="11" fontFamily="monospace" fill="#8B5CF6" fillOpacity="0.3">☵</text>
      <text x="18" y="150" fontSize="11" fontFamily="monospace" fill="#8B5CF6" fillOpacity="0.25">☷</text>
      <text x="168" y="168" fontSize="11" fontFamily="monospace" fill="#8B5CF6" fillOpacity="0.25">☳</text>

      {/* 별 */}
      {[
        [20, 24, 1.5, 0.65], [58, 13, 1, 0.5], [172, 20, 2, 0.7],
        [185, 50, 1.2, 0.45], [35, 60, 1.5, 0.55], [160, 42, 1.5, 0.5],
        [143, 15, 1, 0.4], [8, 78, 1, 0.35], [188, 95, 1.2, 0.4],
      ].map(([cx, cy, r, op], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity={op} />
      ))}

      {/* 바닥 글로우 */}
      <ellipse cx="100" cy="293" rx="52" ry="7" fill="#7C3AED" fillOpacity="0.2" />

      {/* 랜턴 글로우 */}
      <circle cx="35" cy="172" r="14" fill="#FFB95F" fillOpacity="0.06" filter="url(#bj-glow2)" />
      <circle cx="35" cy="172" r="5" fill="#FFB95F" fillOpacity="0.25" />

      {/* 인물 외곽 엣지 글로우 */}
      {isHero && (
        <>
          <path
            d="M 78,135 Q 55,155 36,165 Q 40,177 62,172 Q 76,162 84,150 Q 78,142 78,135"
            fill="none" stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.3"
          />
          <path
            d="M 122,135 Q 145,155 164,165 Q 160,177 138,172 Q 124,162 116,150 Q 122,142 122,135"
            fill="none" stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.3"
          />
        </>
      )}
    </svg>
  );
}
