import React, { useRef, useLayoutEffect, useState } from "react";
import EvidenceBoard from './EvidenceBoard.jsx';

// Clamp yOffset to [-120, 120] for all activities
const rawActivities = [
  { label: "Problem Framing", pos: 0.01, yOffset: -210, principle: "Design Thinking" },
  { label: "Product Discovery", pos: 0.07, yOffset: -150, principle: "Design Thinking" },
  { label: "Inception", pos: 0.13, yOffset: -90, principle: "Design Thinking" },
  { label: "Product Vision Development", pos: 0.18, yOffset: -30, principle: "Design Thinking" },
  { label: "Idea Generation Workshops", pos: 0.23, yOffset: 60, principle: "Design Thinking" },
  { label: "OOUX", pos: 0.28, yOffset: 120, principle: "Design Thinking" },
  { label: "Design Sprint", pos: 0.33, yOffset: 60, principle: "Design Thinking" },
  { label: "Rapid Prototyping", pos: 0.38, yOffset: -30, principle: "Design Thinking" },
  { label: "User Story Mapping", pos: 0.43, yOffset: -120, principle: "Design Thinking" },
  { label: "User Experience Definition", pos: 0.48, yOffset: -180, principle: "Design Thinking" },
  { label: "User Interface Design", pos: 0.53, yOffset: -120, principle: "Design Thinking" },
  { label: "Release Planning", pos: 0.58, yOffset: -60, principle: "Agile" },
  { label: "Product Roadmap", pos: 0.63, yOffset: 0, principle: "Agile" },
  { label: "Sprint Planning", pos: 0.68, yOffset: 60, principle: "Agile" },
  { label: "Stakeholder Review", pos: 0.73, yOffset: 120, principle: "Agile" },
  { label: "Backlog Management", pos: 0.78, yOffset: 180, principle: "Agile" },
  { label: "Continuous Discovery", pos: 0.83, yOffset: 120, principle: "Agile" },
];

const activities = rawActivities.map(act => ({
  ...act,
  yOffset: Math.max(-120, Math.min(120, act.yOffset)),
}));

const scribbleWidth = typeof window !== 'undefined' ? Math.max(window.innerWidth, 350) : 1200;
const scribbleHeight = 228;
const containerHeight = typeof window !== 'undefined' ? Math.max(window.innerHeight * 0.6, 400) : 600;
const minGap = 24; // Minimum horizontal gap between callouts
const minVerticalGap = 64; // Increased minimum vertical gap between callouts

const principleStyles = {
  "Design Thinking": {
    background: "#e0f0ff",
    border: "2px solid #3b82f6",
    color: "#222"
  },
  "Agile": {
    background: "#e6ffe0",
    border: "2px solid #22c55e",
    color: "#222"
  }
};

function getCalloutEstWidth(label) {
  return Math.max(120, Math.min(260, label.length * 9 + 40));
}

// Robust collision-avoidance adjustment
function adjustCalloutPositions(activities, scribbleWidth) {
  // Calculate initial positions
  let placed = activities.map((act) => {
    const estWidth = getCalloutEstWidth(act.label);
    const x = act.pos * (scribbleWidth - estWidth) + estWidth / 2;
    return { ...act, estWidth, x, yOffset: act.yOffset };
  });
  // Sort by x (horizontal position)
  placed.sort((a, b) => a.x - b.x);
  // Alternate push direction for better distribution
  let pushDirection = 1;
  for (let i = 1; i < placed.length; i++) {
    let curr = placed[i];
    let hasOverlap = true;
    let attempts = 0;
    while (hasOverlap && attempts < 20) { // Prevent infinite loop
      hasOverlap = false;
      for (let j = 0; j < i; j++) {
        const prev = placed[j];
        // Check horizontal overlap
        if (Math.abs(curr.x - prev.x) < (prev.estWidth + curr.estWidth) / 2 + minGap) {
          // Check vertical overlap
          if (Math.abs(curr.yOffset - prev.yOffset) < minVerticalGap) {
            // Overlap detected, push further in alternating direction
            curr.yOffset += pushDirection * minVerticalGap;
            hasOverlap = true;
          }
        }
      }
      attempts++;
    }
    pushDirection *= -1; // Alternate direction for next callout
    placed[i] = curr;
  }
  // Restore original order
  placed.sort((a, b) => activities.findIndex(act => act.label === a.label) - activities.findIndex(act => act.label === b.label));
  return placed;
}

export default function ProcessDiagram() {
  const scribbleY = scribbleHeight / 2;
  const placedActivities = adjustCalloutPositions(activities, scribbleWidth);
  // Calculate the maximum right edge of all callouts
  const maxRightEdge = Math.max(
    ...placedActivities.map(act => act.x + (act.estWidth ? act.estWidth / 2 : 0))
  );
  const diagramWidth = Math.max(scribbleWidth, maxRightEdge + 40); // 40px padding
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(1.5rem, 4vw, 3rem) clamp(0.5rem, 4vw, 2rem)',
        boxSizing: 'border-box',
        minHeight: 'min(80vh, 600px)',
      }}
    >
      {/* Heading at the very top */}
      <div style={{ width: '100%', textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
        <h2 style={{
          fontFamily: 'var(--font-marker)',
          fontSize: 'clamp(2rem, 8vw, 3.6rem)',
          fontWeight: 900,
          color: '#222',
          marginBottom: 0,
          letterSpacing: '-2px',
          lineHeight: 1.08,
          textShadow: '2px 4px 0 #fffbe7, 0 2px 0 #e0f0ff',
          background: 'none',
          border: 'none',
          padding: 0,
        }}>What I do</h2>
      </div>
      {/* Marker-style legend below heading */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 64,
        marginBottom: 'clamp(2rem, 5vw, 3.5rem)',
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 1200,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <span style={{
          fontFamily: 'var(--font-marker), "Comic Sans MS", cursive',
          fontSize: '2.6rem',
          fontWeight: 900,
          color: '#3b82f6',
          letterSpacing: '-2px',
          lineHeight: 1.1,
          textShadow: '1px 2px 0 #e0f0ff',
          padding: 0,
          background: 'none',
          border: 'none',
        }}>Design Thinking</span>
        <span style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 40
        }}>
          <span style={{
            fontFamily: 'var(--font-marker), "Comic Sans MS", cursive',
            fontSize: '2.6rem',
            fontWeight: 900,
            color: '#22c55e',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            textShadow: '1px 2px 0 #e6ffe0',
            padding: 0,
            background: 'none',
            border: 'none',
          }}>Agile</span>
          <ScrumHighlighter />
        </span>
      </div>
      {/* Diagram area, horizontally scrollable if needed */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 'clamp(3rem, 8vw, 6rem)',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
        className="hide-scrollbar"
      >
        <div
          style={{
            width: diagramWidth,
            minWidth: diagramWidth,
            minHeight: 'clamp(320px, 40vw, 520px)',
            position: 'relative',
            paddingTop: 'clamp(4rem, 10vw, 8rem)',
            boxSizing: 'border-box',
          }}
        >
          {/* Scribble */}
          <img
            src="/scribble.svg"
            alt="Hand-drawn process scribble"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: scribbleWidth,
              height: 'auto',
              zIndex: 1,
              pointerEvents: 'none',
              filter: 'grayscale(1) brightness(2) opacity(0.18)',
            }}
            loading="lazy"
          />
          {/* Callouts and curved arrows */}
          {placedActivities.map((act, i) => {
            const x = act.x;
            const y = scribbleY + act.yOffset - 30;
            const startY = act.yOffset < 0 ? y + 38 : y;
            const endY = scribbleY;
            const controlY = (startY + endY) / 2 + (act.yOffset < 0 ? 60 : -60);
            const path = `M0,${startY} Q0,${controlY} 0,${endY}`;
            // Set text color by principle
            const textColor = act.principle === 'Agile' ? '#22c55e' : '#3b82f6';
            if (act.sticky) {
              // Render sticky note
              return (
                <div
                  key={act.label}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    minWidth: 'min(32vw, 140px)',
                    maxWidth: 'min(60vw, 220px)',
                    background: act.color || '#ffe066',
                    color: '#222',
                    fontFamily: 'var(--font-marker), "Comic Sans MS", cursive',
                    fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                    fontWeight: 700,
                    borderRadius: '0.5em 0.6em 0.4em 0.7em',
                    boxShadow: '2px 6px 18px 0 rgba(0,0,0,0.10)',
                    padding: 'clamp(10px, 3vw, 18px) clamp(10px, 3vw, 20px)',
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    transform: 'rotate(-3deg)',
                    zIndex: 10,
                    userSelect: 'none',
                  }}
                >
                  {act.label}
                </div>
              );
            }
            // Default: render as before
            return (
              <React.Fragment key={act.label}>
                {/* Curved arrow/line */}
                <svg
                  style={{
                    position: 'absolute',
                    left: x + act.estWidth / 2 - 8,
                    top: 0,
                    pointerEvents: 'none',
                    zIndex: 2,
                  }}
                  width={0}
                  height={scribbleHeight}
                  viewBox={`0 0 1 ${scribbleHeight}`}
                >
                  <path
                    d={path}
                    stroke="#222"
                    strokeWidth={2}
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                  <defs>
                    <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L6,3 L0,6" fill="#222" />
                    </marker>
                  </defs>
                </svg>
                {/* Transparent callout with colored text */}
                <div
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    minWidth: 120,
                    maxWidth: 260,
                    display: 'inline-block',
                    fontFamily: 'var(--font-marker), "Comic Sans MS", cursive',
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    letterSpacing: '-1px',
                    zIndex: 3,
                    textAlign: 'center',
                    userSelect: 'none',
                    padding: '10px 18px',
                    whiteSpace: 'nowrap',
                    background: 'none',
                    border: 'none',
                    boxShadow: 'none',
                    color: textColor,
                  }}
                >
                  {act.label}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScrumHighlighter() {
  const textRef = useRef(null);
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });
  const fontSize = 24; // px, should match 1.5rem
  const svgBaseWidth = 200; // from provided SVG
  const svgBaseHeight = 42; // from provided SVG
  const verticalPadding = 6; // px, extra space above/below
  const defaultWidth = 60; // px fallback if measurement fails
  const defaultHeight = 28; // px fallback if measurement fails

  // Function to measure and set text size
  const measure = () => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setTextSize({
        width: rect.width > 0 ? rect.width : defaultWidth,
        height: rect.height > 0 ? rect.height : defaultHeight,
      });
    } else {
      setTextSize({ width: defaultWidth, height: defaultHeight });
    }
  };

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    if (document.fonts) {
      document.fonts.addEventListener('loadingdone', measure);
      document.fonts.addEventListener('loading', measure);
    }
    return () => {
      window.removeEventListener('resize', measure);
      if (document.fonts) {
        document.fonts.removeEventListener('loadingdone', measure);
        document.fonts.removeEventListener('loading', measure);
      }
    };
  }, []);

  // Calculate scale to fit the text width
  const scaleX = (textSize.width + 120) / svgBaseWidth; // 60px padding left/right
  const scaleY = (textSize.height + 120) / svgBaseHeight; // 60px padding top/bottom

  return (
    <span style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      marginLeft: 4,
      verticalAlign: 'middle',
    }}>
      {/* Hand-drawn SVG highlighter */}
      <svg
        width={svgBaseWidth * scaleX}
        height={svgBaseHeight * scaleY}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          pointerEvents: 'none',
          display: 'block',
        }}
        viewBox={`0 0 ${svgBaseWidth} ${svgBaseHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_6171_16150)">
          <path d="M190.276 34.0098C195.894 33.7601 197.412 27.4844 194.72 24.255C194.757 24.0053 194.775 23.7557 194.792 23.506C201.838 22.5571 201.802 11.7535 194.269 11.9533C193.473 11.97 192.679 11.97 191.866 12.0033C196.78 9.57294 195.931 0.800305 189.264 0.983415C130.765 2.54818 72.2839 4.11294 13.7848 5.67771C6.55818 5.87746 6.28715 15.0995 12.2852 16.9972C10.0992 16.9972 7.93119 16.9972 5.74517 16.9806C-1.95115 16.9306 -1.87888 28.2668 5.74517 28.6164C13.9654 28.9992 22.1676 29.3488 30.3878 29.6318C27.7863 29.7483 25.1847 29.8649 22.565 29.9814C14.941 30.3309 14.8868 41.9667 22.565 41.6172C78.4804 39.087 134.378 36.5401 190.294 34.0098H190.276Z" fill="#22c55e"/>
        </g>
        <defs>
          <clipPath id="clip0_6171_16150">
            <rect width="200" height="41" fill="white" transform="translate(0 0.818359)"/>
          </clipPath>
        </defs>
      </svg>
      <span
        ref={textRef}
        style={{
          position: 'relative',
          fontFamily: 'var(--font-marker), "Comic Sans MS", cursive',
          fontSize: `${fontSize}px`,
          fontWeight: 900,
          color: '#111',
          lineHeight: 1.1,
          zIndex: 1,
          padding: 0,
          whiteSpace: 'nowrap',
        }}
      >
        Scrum
      </span>
    </span>
  );
}