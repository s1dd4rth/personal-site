import React, { useEffect, useState } from 'react';

// Simple color palette for chips
const chipColors = [
  '#E0E7FF', '#FDE68A', '#BBF7D0', '#FCA5A5', '#FBCFE8', '#A7F3D0', '#FCD34D', '#C7D2FE'
];

// Mapping of common tags to broader categories
const CATEGORY_MAP = {
  technology: ['tech', 'technology', 'programming', 'software', 'hardware', 'web', 'ai', 'machine-learning', 'data', 'cloud', 'iot', 'esp32', 'windows', 'linux', 'automation', 'devops', 'python', 'javascript', 'coding', 'development', 'wsl', 'windows-subsystem-linux'],
  design: ['design', 'ux', 'ui', 'product-design', 'user-experience', 'ux-design', 'ui-design', 'prototyping', 'usability', 'interface', 'visual-design'],
  leadership: ['leadership', 'team', 'team-building', 'management', 'coaching', 'mentoring', 'strategy', 'agile', 'teamwork', 'collaboration'],
  business: ['business', 'startup', 'entrepreneurship', 'product-management', 'marketing', 'growth', 'business-strategy', 'ecommerce', 'saas', 'b2b', 'b2c', 'market', 'finance'],
};
const CATEGORY_LABELS = {
  technology: 'Technology',
  design: 'Design',
  leadership: 'Leadership',
  business: 'Business',
  other: 'Other',
};
const CATEGORY_ORDER = ['technology', 'design', 'leadership', 'business', 'other'];

// Helper to fetch and parse RSS feed
async function fetchMediumFeed() {
  const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@siddarthkengadaran');
  const data = await res.json();
  return data.items.map(item => ({
    title: item.title,
    link: item.link,
    summary: item.description.replace(/<[^>]+>/g, '').slice(0, 180) + '...',
    topics: item.categories || [],
    pubDate: item.pubDate,
  }));
}

function getCategoryForArticle(article) {
  const tags = (article.topics || []).map(t => t.toLowerCase());
  for (const [cat, tagList] of Object.entries(CATEGORY_MAP)) {
    if (tags.some(tag => tagList.includes(tag))) {
      return cat;
    }
  }
  return 'other';
}

function groupByCategory(articles) {
  const groups = { technology: [], design: [], leadership: [], business: [], other: [] };
  articles.forEach(article => {
    const cat = getCategoryForArticle(article);
    groups[cat].push(article);
  });
  return groups;
}

export default function MediumAffinityWall() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMediumFeed()
      .then(setArticles)
      .catch(e => setError('Failed to load Medium articles.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading Medium articles...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  const grouped = groupByCategory(articles);

  return (
    <div style={{
      position: 'relative',
      padding: '2.5rem 0 3.5rem 0',
      borderRadius: 16,
      minHeight: 400,
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
        My Thoughts
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'center', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        {CATEGORY_ORDER.map((cat, i) => (
          grouped[cat] && grouped[cat].length > 0 && (
            <div key={cat} style={{ minWidth: 260, maxWidth: 340 }}>
              <div style={{
                fontWeight: 700,
                fontSize: '1.18rem',
                marginBottom: '1.1rem',
                color: '#222',
                background: chipColors[i % chipColors.length],
                borderRadius: '999px',
                padding: '0.38em 1.2em',
                display: 'inline-block',
                letterSpacing: '0.01em',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}>{CATEGORY_LABELS[cat]}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {grouped[cat].map((art, j) => (
                  <div key={art.link} style={{
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    padding: '1.1em 1.2em',
                    borderLeft: `5px solid ${chipColors[(i+j) % chipColors.length]}`,
                    minHeight: 120,
                    display: 'flex', flexDirection: 'column',
                    gap: '0.5em',
                  }}>
                    <a href={art.link} target="_blank" rel="noopener noreferrer" style={{
                      fontWeight: 700,
                      fontSize: '1.08rem',
                      color: '#222',
                      textDecoration: 'none',
                      marginBottom: '0.2em',
                    }}>{art.title}</a>
                    <div style={{ fontSize: '0.98rem', color: '#444', marginBottom: '0.3em' }}>{art.summary}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em' }}>
                      {art.topics.map((t, k) => (
                        <span key={t} style={{
                          background: chipColors[(i+k) % chipColors.length],
                          color: '#222',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          borderRadius: '999px',
                          padding: '0.18em 0.8em',
                          border: '1px solid #e0e0e0',
                        }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.2em' }}>{new Date(art.pubDate).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '2.5rem', position: 'relative', zIndex: 2 }}>
        <a
          href="https://medium.com/@siddarthkengadaran"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            fontWeight: 700,
            color: '#fff',
            background: '#3245FF',
            fontSize: '1.13rem',
            borderRadius: '999px',
            padding: '0.7em 2.2em',
            textDecoration: 'none',
            letterSpacing: '0.01em',
            boxShadow: '0 2px 8px rgba(50,69,255,0.08)',
            transition: 'background 0.18s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#1e2bb8'}
          onMouseOut={e => e.currentTarget.style.background = '#3245FF'}
        >
          View More on Medium →
        </a>
      </div>
    </div>
  );
} 