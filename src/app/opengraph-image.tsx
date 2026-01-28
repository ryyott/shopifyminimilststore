import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'YZY - Minimalist E-Commerce'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          backgroundImage: 'linear-gradient(to bottom right, #000 0%, #1a1a1a 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 120,
              fontWeight: 'bold',
              background: 'linear-gradient(to bottom right, #fff 0%, #999 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.05em',
              margin: 0,
              padding: 0,
            }}
          >
            YZY
          </h1>
          <p
            style={{
              fontSize: 32,
              color: '#999',
              marginTop: 20,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Minimalist E-Commerce
          </p>
          <p
            style={{
              fontSize: 24,
              color: '#666',
              marginTop: 40,
              maxWidth: 800,
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            Premium streetwear and accessories
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
