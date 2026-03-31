import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '혜안(HYEAN) — AI 사주·타로·꿈해몽';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadGoogleFont(text: string) {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&text=${encodeURIComponent(text)}`;
  const css = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  }).then((r) => r.text());

  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]?(woff2|opentype|truetype)['"]?\)/);
  if (!match) throw new Error('Font URL not found in CSS');
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export default async function OGImage() {
  const ALL_TEXT = '혜안사주타로꿈해몽당신의운명을AI기반통합운세서비스읽습니다';

  let fontData: ArrayBuffer | null = null;
  try {
    fontData = await loadGoogleFont(ALL_TEXT);
  } catch {
    // 폰트 로드 실패 시 영문만 표시
  }

  const fonts: ConstructorParameters<typeof ImageResponse>[1]['fonts'] = fontData
    ? [{ name: 'NotoSansKR', data: fontData, weight: 700, style: 'normal' }]
    : [];

  const fontFamily = fontData ? 'NotoSansKR, serif' : 'serif';

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
          fontFamily,
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
        <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(124,58,237,0.4)' }} />
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(167,139,250,0.25)' }} />

        {/* 심볼 ✦ — CSS로 렌더링 (유니코드 폰트 의존 제거) */}
        <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: 8, height: 64, background: '#A78BFA', borderRadius: 4, boxShadow: '0 0 20px rgba(124,58,237,0.9)' }} />
          <div style={{ position: 'absolute', width: 8, height: 64, background: '#A78BFA', borderRadius: 4, transform: 'rotate(90deg)', boxShadow: '0 0 20px rgba(124,58,237,0.9)' }} />
          <div style={{ position: 'absolute', width: 4, height: 46, background: '#A78BFA', borderRadius: 4, transform: 'rotate(45deg)', opacity: 0.7 }} />
          <div style={{ position: 'absolute', width: 4, height: 46, background: '#A78BFA', borderRadius: 4, transform: 'rotate(135deg)', opacity: 0.7 }} />
          <div style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: '#EDE9FE' }} />
        </div>

        {/* 브랜드명 한글 */}
        <div style={{ fontSize: 80, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: 4, textShadow: '0 0 40px rgba(124,58,237,0.6)', fontFamily }}>
          혜안
        </div>

        {/* 브랜드명 영문 */}
        <div style={{ fontSize: 32, fontWeight: 400, color: '#A78BFA', letterSpacing: '0.35em', marginBottom: 20 }}>
          HYEAN
        </div>

        {/* 부제목 */}
        <div style={{ fontSize: 24, color: 'rgba(232,228,240,0.55)', letterSpacing: '0.08em', marginBottom: 40, fontFamily }}>
          AI 사주 · 타로 · 꿈해몽
        </div>

        {/* 3 서비스 배지 */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { symbol: '仙', label: '사주', color: '#7C3AED' },
            { symbol: '★', label: '타로', color: '#D97706' },
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
              <span style={{ fontSize: 20, color: 'rgba(232,228,240,0.8)', fontFamily }}>{label}</span>
            </div>
          ))}
        </div>

        {/* 하단 태그라인 */}
        <div style={{ position: 'absolute', bottom: 36, fontSize: 18, color: 'rgba(232,228,240,0.3)', letterSpacing: '0.15em', fontFamily }}>
          당신의 운명을 AI가 읽습니다
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
