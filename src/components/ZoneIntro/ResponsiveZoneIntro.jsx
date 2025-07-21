// RESTORATION POINT: Clean, robust, non-draggable sticky layout. Safe to restore to this version if needed.
// Stickies are distributed in a visually balanced, organic ellipse around the hero.

import React, { useEffect, useState, useRef } from 'react';
import StickyNote from './StickyNote.jsx';

const stickies = [
  { color: "pink", text: "Design Thinking" },
  { color: "yellow", text: "Design Sprint" },
  { color: "blue", text: "Scrum" },
  { color: "green", text: "Agile" },
  { color: "orange", text: "Strategy" },
  { color: "yellow", text: "Discovery" },
  { color: "pink", text: "Facilitation" },
  { color: "blue", text: "AI" },
  { color: "green", text: "XR" },
  { color: "orange", text: "IoT" },
  { color: "lightblue", text: "Mobile" },
  { color: "yellow", text: "Web" },
  { color: "purple", text: "Interaction Design" },
  { color: "teal", text: "User Experience" },
  { color: "red", text: "Research" },
];

const getStickySize = (vw) => {
  if (vw < 500) return 90;
  if (vw < 900) return 120;
  return 140;
};

const MARGIN = 32; // px, margin from viewport edge
const MAX_JITTER = 18; // px (increased for more organic look)

// Simple seeded random number generator (Mulberry32)
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function shuffleArray(array, rand) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ellipseAroundCenter(idx, total, rx, ry, angleJitter, jitterX, jitterY) {
  const angle = (2 * Math.PI * idx) / total + angleJitter;
  let x = rx * Math.cos(angle) + jitterX;
  let y = ry * Math.sin(angle) + jitterY;
  return { x, y };
}

export default function ResponsiveZoneIntro() {
  // --- Layout state and refs ---
  const [heroBox, setHeroBox] = useState(null);
  const heroRef = useRef(null);
  const heroWrapperRef = useRef(null); // For future extensibility
  const containerRef = useRef(null);
  const [shuffledStickies, setShuffledStickies] = useState(stickies);
  const [stickyPositions, setStickyPositions] = useState([]);
  const [seed] = useState(() => Date.now()); // New seed on every reload
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  // For organic ellipse aspect ratio
  const [ellipseAspect, setEllipseAspect] = useState(1);

  // --- Shuffle stickies and set ellipse aspect ratio on mount ---
  useEffect(() => {
    const rand = mulberry32(seed);
    setShuffledStickies(shuffleArray(stickies, rand));
    // Random aspect ratio between 0.85 and 1.15 for ellipse
    setEllipseAspect(0.85 + rand() * 0.3);
  }, [seed]);

  // --- Track viewport size ---
  useEffect(() => {
    function handleResize() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize(); // Set initial value on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Measure hero box relative to container ---
  useEffect(() => {
    function measure() {
      if (heroRef.current && containerRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        // Get hero center relative to container
        const left = heroRect.left - containerRect.left;
        const top = heroRect.top - containerRect.top;
        setHeroBox({
          left,
          top,
          width: heroRect.width,
          height: heroRect.height,
        });
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // --- Precompute sticky positions around hero center, using viewport-proportional ellipse ---
  useEffect(() => {
    if (!heroBox || heroBox.width === 0 || heroBox.height === 0) return;
    const { width: viewportWidth, height: viewportHeight } = viewport;
    // Center of hero relative to container
    const centerX = heroBox.left + heroBox.width / 2;
    const centerY = heroBox.top + heroBox.height / 2;
    const stickySize = getStickySize(viewportWidth);
    // Proportional ellipse radii (spread out more)
    const propRx = viewportWidth * 0.32;
    const propRy = viewportHeight * 0.28 * ellipseAspect;
    // Minimum radii based on hero size
    const minRx = heroBox.width / 2 + stickySize * 0.85;
    const minRy = heroBox.height / 2 + stickySize * 0.7;
    // Clamp radii so stickies never go off-screen
    const maxRx = Math.min(centerX, viewportWidth - centerX) - stickySize / 2 - MARGIN;
    const maxRy = Math.min(centerY, viewportHeight - centerY) - stickySize / 2 - MARGIN;
    const rx = Math.max(Math.min(propRx, maxRx), minRx);
    const ry = Math.max(Math.min(propRy, maxRy), minRy);
    // Use seeded RNG for jitter and angle
    const rand = mulberry32(seed + 1); // Different stream from shuffle
    const positions = shuffledStickies.map((_, i) => {
      const angleJitter = (rand() - 0.5) * 0.09;
      const jitterX = (rand() - 0.5) * 2 * MAX_JITTER;
      const jitterY = (rand() - 0.5) * 2 * MAX_JITTER;
      const { x, y } = ellipseAroundCenter(i, shuffledStickies.length, rx, ry, angleJitter, jitterX, jitterY);
      return {
        x: centerX + x - stickySize / 2,
        y: centerY + y - stickySize / 2,
      };
    });
    setStickyPositions(positions);
  }, [heroBox, shuffledStickies, seed, viewport, ellipseAspect]);

  // --- Render ---
  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100vw', height: '100vh', minHeight: 600, minWidth: '100vw', overflow: 'hidden' }}>
      {/* HERO SECTION: Wrap for future extensibility (e.g., add nav, actions, etc.) */}
      <div ref={heroWrapperRef} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 20, width: 'max-content', pointerEvents: 'auto' }}>
        {/* Hero Title & Subtitle */}
        <div
          ref={heroRef}
          style={{
            textAlign: 'center',
          }}
        >
          <h1 style={{
            fontFamily: 'var(--font-marker)',
            fontSize: '3rem',
            fontWeight: 800,
            marginBottom: '1rem',
            color: '#222',
            letterSpacing: '-1px'
          }}>
            Siddarth Kengadaran
          </h1>
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.35rem',
            fontWeight: 400,
            color: '#444',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.4
          }}>
            With over a decade of experience, I blend the craft of user-centric design with the discipline of product management to shape and execute clear product strategies.
          </h2>
        </div>
      </div>

      {/* STICKY NOTES: Surround the hero in an organic ellipse */}
      {stickyPositions.length === shuffledStickies.length && shuffledStickies.map(({ color, text }, i) => {
        const pos = stickyPositions[i];
        if (!pos) return null;
        return (
          <StickyNote
            key={i}
            color={color}
            x={pos.x}
            y={pos.y}
            draggable={true}
            style={{
              width: 'min(40vw, 140px)',
              height: 'min(40vw, 140px)',
              minWidth: '70px',
              minHeight: '70px',
              maxWidth: '140px',
              maxHeight: '140px',
              fontSize: 'clamp(0.8rem, 2.5vw, 1.25rem)',
            }}
          >
            {text}
          </StickyNote>
        );
      })}

      {/* TODO: Add next section here (e.g., About, Timeline, etc.) */}
    </div>
  );
} 