import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'Samachar Gujrati | Latest Gujarati News, Local & Breaking News';
    const category = searchParams.get('category') || 'Breaking News';
    let image = searchParams.get('image');
    
    // Ensure image is a valid absolute URL
    if (image && !image.startsWith('http')) {
       image = null;
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            position: 'relative',
            backgroundColor: '#111111',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Background Image */}
          {image ? (
            <img
              src={image}
              alt="bg"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.6,
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'linear-gradient(135deg, #2b0d0d 0%, #111111 100%)',
              }}
            />
          )}

          {/* Gradient Overlay for Text Readability */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'linear-gradient(to bottom, rgba(17,17,17,0.1) 0%, rgba(17,17,17,0.95) 100%)',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              padding: '60px',
              width: '100%',
              height: '100%',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Category / Badge */}
            <div
              style={{
                background: '#C62828',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '24px',
                fontWeight: 700,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '32px',
                boxShadow: '0 4px 20px rgba(198, 40, 40, 0.4)',
              }}
            >
              {category}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '64px',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.25,
                marginBottom: '48px',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              }}
            >
              {title.length > 100 ? `${title.substring(0, 100)}...` : title}
            </div>

            {/* Footer / Branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderTop: '2px solid rgba(255,255,255,0.15)',
                paddingTop: '32px',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#C62828', letterSpacing: '-1px' }}>
                  SAMACHAR
                </div>
                <div style={{ fontSize: '32px', fontWeight: 400, color: 'white', marginLeft: '10px', letterSpacing: '1px' }}>
                  GUJRATI
                </div>
              </div>
              <div style={{ fontSize: '24px', color: '#aaaaaa', fontWeight: 500 }}>
                samarchar-gujrati.vercel.app
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
