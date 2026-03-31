import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // Vercel CDN 캐시 방지
export const alt = '혜안(HYEAN) — AI 사주·타로·꿈해몽';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// SVG를 img data URL로 변환 (Satori에서 가장 안정적인 SVG 렌더링 방식)
function svgUrl(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const STAR_SVG = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <polygon points="32,2 37,27 62,32 37,37 32,62 27,37 2,32 27,27" fill="#A78BFA"/>
    <circle cx="32" cy="32" r="5" fill="#EDE9FE"/>
  </svg>`
);

const DIAMOND_SVG = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <polygon points="11,1 21,11 11,21 1,11" fill="#D97706"/>
  </svg>`
);

const MOON_SVG = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <circle cx="11" cy="11" r="9" fill="#3B82F6"/>
    <circle cx="14" cy="11" r="7" fill="#0d1b3e"/>
  </svg>`
);

async function loadGoogleFont(text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`;
  const css = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  }).then((r) => r.text());

  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]?(woff2|opentype|truetype)['"]?\)/);
  if (!match) throw new Error('Font URL not found');
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export default async function OGImage() {
  const ALL_TEXT = '仙혜안사주타로꿈해몽당신의운명을AI기반통합운세서비스읽습니다';

  let fontData: ArrayBuffer | undefined;
  try {
    fontData = await loadGoogleFont(ALL_TEXT);
  } catch {
    // fallback without Korean font
  }

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
        {([
          [80, 60], [200, 120], [350, 40], [500, 90], [700, 30],
          [900, 80], [1050, 55], [1150, 130], [130, 200], [450, 180],
          [620, 250], [820, 170], [980, 220], [1100, 300], [60, 350],
          [280, 400], [750, 380], [1020, 420], [170, 520], [600, 490],
        ] as [number, number][]).map(([x, y], i) => (
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
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)' }} />

        {/* 링 */}
        <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(124,58,237,0.4)' }} />
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(167,139,250,0.25)' }} />

        {/* 심볼 ✦ — img + SVG data URL */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STAR_SVG} width={64} height={64} alt="" style={{ marginBottom: 16 }} />

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
          {/* 사주 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 24px', border: '1px solid rgba(124,58,237,0.38)', borderRadius: 4, background: 'rgba(124,58,237,0.1)' }}>
            <span style={{ fontSize: 22, color: '#7C3AED', fontFamily }}>仙</span>
            <span style={{ fontSize: 20, color: 'rgba(232,228,240,0.8)', fontFamily }}>사주</span>
          </div>
          {/* 타로 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 24px', border: '1px solid rgba(217,119,6,0.38)', borderRadius: 4, background: 'rgba(217,119,6,0.1)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={DIAMOND_SVG} width={22} height={22} alt="" />
            <span style={{ fontSize: 20, color: 'rgba(232,228,240,0.8)', fontFamily }}>타로</span>
          </div>
          {/* 꿈해몽 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 24px', border: '1px solid rgba(59,130,246,0.38)', borderRadius: 4, background: 'rgba(59,130,246,0.1)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MOON_SVG} width={22} height={22} alt="" />
            <span style={{ fontSize: 20, color: 'rgba(232,228,240,0.8)', fontFamily }}>꿈해몽</span>
          </div>
        </div>

        {/* 하단 태그라인 */}
        <div style={{ position: 'absolute', bottom: 36, fontSize: 18, color: 'rgba(232,228,240,0.3)', letterSpacing: '0.15em', fontFamily }}>
          당신의 운명을 AI가 읽습니다
        </div>
      </div>
    ),
    {
      ...size,
      ...(fontData ? { fonts: [{ name: 'NotoSansKR', data: fontData, weight: 700 as const, style: 'normal' as const }] } : {}),
    },
  );
}
