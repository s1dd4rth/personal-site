import React, { useEffect, useState } from 'react';

const INSTAGRAM_USERNAME = 'theproductguy.xyz';
const ACCESS_TOKEN = IGAATd8GZAxJtlBZAE9EaVBMVEdFX3lLeVpHN0hnZA2QzMFIxNFloTzItY0FIYmNzR0FnTlItYXQ3elBTMUlGUnRYTUwyUWM3Sl85eXYtTnVic2RfVElQWkdPc090UHJieFZAoclBhWWFVTDVENXVuVEdjeXBtTUltaVJaWDB4X3IxVQZDZD


export default function InstagramPhotoWall() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInstagramMedia() {
      try {
        // Step 1: Get user ID from username (if needed)
        // Instagram Graph API does not support username lookup directly; you must use the user ID associated with the access token
        // For most personal use, the access token is already scoped to the correct user
        const res = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type,timestamp&access_token=${ACCESS_TOKEN}`
        );
        const data = await res.json();
        if (!data.data) throw new Error('No data returned from Instagram API');
        setPhotos(
          data.data
            .filter(item => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM')
            .map(item => ({
              id: item.id,
              imageUrl: item.media_url,
              caption: item.caption,
              link: item.permalink,
            }))
        );
      } catch (e) {
        setError('Failed to load Instagram photos.');
      } finally {
        setLoading(false);
      }
    }
    fetchInstagramMedia();
  }, []);

  return (
    <div style={{
      position: 'relative',
      padding: '2.5rem 0 3.5rem 0',
      borderRadius: 16,
      minHeight: 300,
      overflow: 'hidden',
    }}>
      {/* Grid canvas background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: 'repeating-radial-gradient(circle, #e5e7eb 1px, transparent 1.8px 32px 32px)',
        pointerEvents: 'none',
      }} />
      <h2 style={{
        fontFamily: 'var(--font-marker)',
        fontSize: 'clamp(1.5rem, 5vw, 2.4rem)',
        fontWeight: 900,
        color: '#222',
        textAlign: 'center',
        marginBottom: '4.5rem',
        marginTop: 0,
        paddingTop: 'clamp(2.5rem, 7vw, 4.5rem)',
        letterSpacing: '-1.5px',
        zIndex: 10,
        position: 'relative',
      }}>
        Gallery
      </h2>
      {loading && <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#888' }}>Loading Instagram photos...</div>}
      {error && <div style={{ textAlign: 'center', color: 'red', fontSize: '1.1rem' }}>{error}</div>}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2.2rem',
        justifyContent: 'center',
        alignItems: 'stretch',
        position: 'relative',
        zIndex: 1,
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        {photos.slice(0, 12).map(photo => (
          <a
            key={photo.id}
            href={photo.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              overflow: 'hidden',
              textDecoration: 'none',
              color: '#222',
              transition: 'box-shadow 0.18s',
            }}
          >
            <img
              src={photo.imageUrl}
              alt={photo.caption}
              style={{
                width: '100%',
                height: 220,
                objectFit: 'cover',
                display: 'block',
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
              }}
              loading="lazy"
            />
          </a>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '2.5rem', position: 'relative', zIndex: 2 }}>
        <a
          href="https://www.instagram.com/theproductguy.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            fontWeight: 700,
            color: '#fff',
            background: '#E1306C',
            fontSize: '1.13rem',
            borderRadius: '999px',
            padding: '0.7em 2.2em',
            textDecoration: 'none',
            letterSpacing: '0.01em',
            boxShadow: '0 2px 8px rgba(225,48,108,0.08)',
            transition: 'background 0.18s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#b91d5a'}
          onMouseOut={e => e.currentTarget.style.background = '#E1306C'}
        >
          View More on Instagram →
        </a>
      </div>
    </div>
  );
} 