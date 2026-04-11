import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request, { params }) {
  // Extract the size from the dynamic route parameter (e.g., /api/icon/150 -> 150)
  const sizeParam = params.size || '512';
  const size = parseInt(sizeParam, 10);
  
  // Calculate proportionate font size and borders
  const fontSize = Math.floor(size * 0.5);
  const borderRadius = Math.floor(size * 0.2); // 20% border radius
  
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#C62828', // Brand Theme Color
          color: 'white',
          fontSize: fontSize,
          fontWeight: 900,
          fontFamily: 'sans-serif',
          borderRadius: borderRadius,
        }}
      >
        SG
      </div>
    ),
    {
      width: size,
      height: size,
    }
  )
}
