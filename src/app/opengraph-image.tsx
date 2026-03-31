import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '혜안(HYEAN) — AI 사주·타로·꿈해몽';
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
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 별들 */}
        {([
          [80,60],[200,120],[350,40],[500,90],[700,30],
          [900,80],[1050,55],[1150,130],[130,200],[450,180],
          [620,250],[820,170],[980,220],[1100,300],[60,350],
          [280,400],[750,380],[1020,420],[170,520],[600,490],
        ] as [number,number][]).map(([x,y],i) => (
          <div key={i} style={{
            position:'absolute', left:x, top:y,
            width: i%3===0 ? 3 : 2, height: i%3===0 ? 3 : 2,
            borderRadius:'50%', background:'#C4B5FD',
            opacity: 0.4+(i%4)*0.1,
          }} />
        ))}

        {/* 중앙 글로우 */}
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)' }} />

        {/* 링 */}
        <div style={{ position:'absolute', width:320, height:320, borderRadius:'50%', border:'1px solid rgba(124,58,237,0.4)' }} />
        <div style={{ position:'absolute', width:240, height:240, borderRadius:'50%', border:'1px solid rgba(167,139,250,0.25)' }} />

        {/* 심볼 — CSS 십자 (rotation 없이 + 모양) */}
        <div style={{ position:'relative', width:60, height:60, marginBottom:20, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ position:'absolute', top:0, left:26, width:8, height:60, background:'#A78BFA', borderRadius:4 }} />
          <div style={{ position:'absolute', top:26, left:0, width:60, height:8, background:'#A78BFA', borderRadius:4 }} />
          <div style={{ position:'absolute', width:12, height:12, borderRadius:'50%', background:'#EDE9FE' }} />
        </div>

        {/* 브랜드명 한글 */}
        <div style={{ fontSize:80, fontWeight:700, color:'#FFFFFF', letterSpacing:'-0.02em', marginBottom:4, textShadow:'0 0 40px rgba(124,58,237,0.6)' }}>
          혜안
        </div>

        {/* 브랜드명 영문 */}
        <div style={{ fontSize:32, fontWeight:300, color:'#A78BFA', letterSpacing:'0.35em', marginBottom:20 }}>
          HYEAN
        </div>

        {/* 부제목 */}
        <div style={{ fontSize:24, color:'rgba(232,228,240,0.55)', letterSpacing:'0.08em', marginBottom:40 }}>
          AI 사주 · 타로 · 꿈해몽
        </div>

        {/* 3 서비스 배지 */}
        <div style={{ display:'flex', gap:20 }}>
          {([
            { dot:'#7C3AED', label:'사주', border:'rgba(124,58,237,0.38)', bg:'rgba(124,58,237,0.1)' },
            { dot:'#D97706', label:'타로', border:'rgba(217,119,6,0.38)',   bg:'rgba(217,119,6,0.1)'   },
            { dot:'#3B82F6', label:'꿈해몽', border:'rgba(59,130,246,0.38)',  bg:'rgba(59,130,246,0.1)'  },
          ]).map(({ dot, label, border, bg }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 28px', border:`1px solid ${border}`, borderRadius:4, background:bg }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:dot }} />
              <span style={{ fontSize:20, color:'rgba(232,228,240,0.85)' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* 하단 태그라인 */}
        <div style={{ position:'absolute', bottom:36, fontSize:18, color:'rgba(232,228,240,0.3)', letterSpacing:'0.15em' }}>
          당신의 운명을 AI가 읽습니다
        </div>
      </div>
    ),
    { ...size },
  );
}
