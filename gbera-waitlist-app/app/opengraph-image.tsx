import { ImageResponse } from 'next/og';

export const alt = 'Gbera — Campus transit, finally sorted. Flat-rate keke rides at the University of Ibadan.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#FFC300',
          color: '#121212',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 44, fontWeight: 700, letterSpacing: -2 }}>
          <div style={{ width: 48, height: 48, borderRadius: 48, background: '#121212', border: '12px solid #FFC300', boxShadow: '0 0 0 3px #121212' }} />
          Gbera
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 104, fontWeight: 700, letterSpacing: -5, lineHeight: 0.95 }}>
          <span>Campus transit,</span>
          <span>finally sorted.</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 30 }}>
          <span>Flat-rate keke rides · University of Ibadan</span>
          <span style={{ background: '#121212', color: '#FFC300', padding: '10px 26px', borderRadius: 999 }}>Join the waitlist</span>
        </div>
      </div>
    ),
    size,
  );
}
