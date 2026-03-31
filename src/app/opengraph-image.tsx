import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '운세 에이전트 — AI 사주·타로·꿈해몽';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0B1326 0%, #1a0b3d 50%, #0B1326 100%)',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 별들 */}
        {[
          [80, 60], [200, 120], [350, 40], [500, 90], [700, 30],
          [900, 80], [1050, 55], [1150, 130], [130, 200], [450, 180],
          [620, 250], [820, 170], [980, 220], [1100, 300], [60, 350],
          [280, 400], [750, 380], [1020, 420], [170, 520], [600, 490],
        ].map(([x, y], i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              borderRadius: '50%',
              background: '#C4B5FD',
              opacity: 0.4 + (i % 4) * 0.1,
            }}
          />
        ))}

        {/* 중앙 글로우 */}
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
          }}
        />

        {/* 링 */}
        <div
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            border: '1px solid rgba(124,58,237,0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 240,
            height: 240,
            borderRadius: '50%',
            border: '1px solid rgba(167,139,250,0.25)',
          }}
        />

        {/* 심볼 ✦ */}
        <div
          style={{
            fontSize: 72,
            color: '#A78BFA',
            marginBottom: 16,
            lineHeight: 1,
            textShadow: '0 0 30px rgba(124,58,237,0.8)',
          }}
        >
          ✦
        </div>

        {/* 서비스명 */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            marginBottom: 12,
            textShadow: '0 0 40px rgba(124,58,237,0.5)',
          }}
        >
          운세 에이전트
        </div>

        {/* 부제목 */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(232,228,240,0.65)',
            letterSpacing: '0.05em',
            marginBottom: 40,
          }}
        >
          AI 사주 · 타로 · 꿈해몽
        </div>

        {/* 3 서비스 배지 */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { symbol: '仙', label: '사주', color: '#7C3AED' },
            { symbol: '✦', label: '타로', color: '#D97706' },
            { symbol: '☽', label: '꿈해몽', color: '#3B82F6' },
          ].map(({ symbol, label, color }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 24px',
                border: `1px solid ${color}60`,
                borderRadius: 4,
                background: `${color}18`,
              }}
            >
              <span style={{ fontSize: 22, color }}>{symbol}</span>
              <span style={{ fontSize: 20, color: 'rgba(232,228,240,0.8)' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* 하단 태그라인 */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            fontSize: 18,
            color: 'rgba(232,228,240,0.3)',
            letterSpacing: '0.15em',
          }}
        >
          당신의 운명을 AI가 읽습니다
        </div>
      </div>
    ),
    { ...size },
  );
}
