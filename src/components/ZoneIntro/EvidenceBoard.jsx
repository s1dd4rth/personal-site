import React, { useState, useRef } from 'react';
import StickyNote from './StickyNote.jsx';

// Skill areas: all yellow, large
const skills = [
  { id: 'strategic', label: 'Strategic Thinking & Vision' },
  { id: 'ideation', label: 'Ideation & Creativity' },
  { id: 'research', label: 'Research & Knowledge' },
  { id: 'execution', label: 'Execution & Decision Making' },
  { id: 'leadership', label: 'Leadership & Influence' },
];

// Strengths: color by source, small
const strengths = [
  // Strategic Thinking & Vision
  { id: 'strategic', label: 'Strategic', color: 'green', source: 'CliftonStrengths', skills: ['strategic'] },
  { id: 'connectedness', label: 'Connectedness', color: 'green', source: 'CliftonStrengths', skills: ['strategic'] },
  { id: 'perspective', label: 'Perspective', color: 'blue', source: 'VIA Strengths', skills: ['strategic'] },
  { id: 'futuristic', label: 'Futuristic', color: 'green', source: 'CliftonStrengths', skills: ['strategic'] },
  // Ideation & Creativity
  { id: 'creativity', label: 'Creativity', color: 'blue', source: 'VIA Strengths', skills: ['ideation'] },
  { id: 'ideation', label: 'Ideation', color: 'green', source: 'CliftonStrengths', skills: ['ideation'] },
  { id: 'disruptor', label: 'Disruptor', color: 'red', source: 'Gallup BP10', skills: ['ideation'] },
  { id: 'curiosity', label: 'Curiosity', color: 'blue', source: 'VIA Strengths', skills: ['ideation'] },
  // Research & Knowledge
  { id: 'knowledge', label: 'Knowledge', color: 'red', source: 'Gallup BP10', skills: ['research'] },
  { id: 'loveoflearning', label: 'Love of Learning', color: 'blue', source: 'VIA Strengths', skills: ['research'] },
  { id: 'analytical', label: 'Analytical', color: 'green', source: 'CliftonStrengths', skills: ['research'] },
  // Execution & Decision Making
  { id: 'deliberative', label: 'Deliberative', color: 'green', source: 'CliftonStrengths', skills: ['execution'] },
  { id: 'focus', label: 'Focus', color: 'green', source: 'CliftonStrengths', skills: ['execution'] },
  { id: 'determination', label: 'Determination', color: 'red', source: 'Gallup BP10', skills: ['execution'] },
  { id: 'selfassurance', label: 'Self-Assurance', color: 'green', source: 'CliftonStrengths', skills: ['execution'] },
  // Leadership & Influence
  { id: 'significance', label: 'Significance', color: 'green', source: 'CliftonStrengths', skills: ['leadership'] },
  { id: 'relationship', label: 'Relationship', color: 'red', source: 'Gallup BP10', skills: ['leadership'] },
  { id: 'hope', label: 'Hope', color: 'blue', source: 'VIA Strengths', skills: ['leadership'] },
];

// Layout constants
const boardWidth = 1400;
const boardHeight = 900;
const centerX = boardWidth / 2;
const centerY = boardHeight / 2;
const skillCircleRadius = 220;
const strengthCircleRadius = 470; // increased from 370
const stickyWidthLarge = 140;
const stickyHeightLarge = 140;
const stickyWidthSmall = 120;
const stickyHeightSmall = 120;
const centerStickySize = 170;

// Group strengths by source
const viaStrengths = strengths.filter(s => s.source === 'VIA Strengths');
const cliftonStrengths = strengths.filter(s => s.source === 'CliftonStrengths');
const bp10Strengths = strengths.filter(s => s.source === 'Gallup BP10');

// Strengths group positions
const groupMargin = 60;
const groupGap = 24;
const viaGroupOrigin = { x: groupMargin, y: groupMargin };
const cliftonGroupOrigin = { x: boardWidth - groupMargin - cliftonStrengths.length * (stickyWidthSmall + groupGap), y: groupMargin };
const bp10GroupOrigin = { x: centerX - (bp10Strengths.length * (stickyWidthSmall + groupGap) - groupGap) / 2, y: boardHeight - groupMargin - stickyHeightSmall };

export default function EvidenceBoard() {
  // --- DRAGGABLE STATE ---
  // Helper to get default positions for all stickies
  function getDefaultPositions() {
    // Skills: arrange in a circle around Product Guy
    const skillPositions = skills.map((s, i) => {
      const angle = (2 * Math.PI * i) / skills.length - Math.PI / 2;
      const x = centerX + skillCircleRadius * Math.cos(angle) - stickyWidthLarge / 2;
      const y = centerY + skillCircleRadius * Math.sin(angle) - stickyHeightLarge / 2;
      return { ...s, x, y, type: 'skill', angle };
    });
    // Strengths: arrange in a larger circle, each closest to its mapped skill
    const strengthsWithAngles = strengths.map(str => {
      // If mapped to multiple skills, use the first for angle
      const skillIdx = skills.findIndex(s => s.id === str.skills[0]);
      const skillAngle = skillIdx >= 0 ? (2 * Math.PI * skillIdx) / skills.length - Math.PI / 2 : 0;
      return { ...str, skillAngle };
    });
    // Sort strengths by angle for even spacing
    const sortedStrengths = [...strengthsWithAngles].sort((a, b) => a.skillAngle - b.skillAngle);
    const strengthPositions = sortedStrengths.map((str, i) => {
      // Spread strengths a bit around their mapped skill's angle
      const skillIdx = skills.findIndex(s => s.id === str.skills[0]);
      const baseAngle = skillIdx >= 0 ? (2 * Math.PI * skillIdx) / skills.length - Math.PI / 2 : 0;
      // Offset by larger increments for strengths mapped to the same skill
      const siblings = strengths.filter(s => s.skills[0] === str.skills[0]);
      const siblingIdx = siblings.findIndex(s => s.id === str.id);
      const siblingCount = siblings.length;
      const angleOffset = siblingCount > 1 ? ((siblingIdx - (siblingCount - 1) / 2) * (Math.PI / 10)) : 0; // spread by ~18deg
      const angle = baseAngle + angleOffset;
      const x = centerX + strengthCircleRadius * Math.cos(angle) - stickyWidthSmall / 2;
      const y = centerY + strengthCircleRadius * Math.sin(angle) - stickyHeightSmall / 2;
      return { ...str, x, y, type: 'strength', angle };
    });
    // Product Guy in center
    const productGuy = {
      id: 'productguy',
      label: 'Product Guy',
      x: centerX - centerStickySize / 2,
      y: centerY - centerStickySize / 2,
      size: 'large',
      color: 'yellow',
      rotation: 0,
      type: 'productguy',
    };
    return {
      strengths: strengthPositions,
      skills: skillPositions,
      productGuy,
    };
  }

  // State for positions
  const [positions, setPositions] = useState(getDefaultPositions());
  // Track dragging
  const dragItem = useRef(null); // { type, id, offsetX, offsetY }

  // Mouse event handlers
  function onMouseDown(e, type, id) {
    e.preventDefault();
    const boardRect = e.target.closest('.evidence-board-root').getBoundingClientRect();
    let item;
    if (type === 'strength') item = positions.strengths.find(s => s.id === id);
    else if (type === 'skill') item = positions.skills.find(s => s.id === id);
    else item = positions.productGuy;
    dragItem.current = {
      type,
      id,
      offsetX: e.clientX - item.x,
      offsetY: e.clientY - item.y,
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
  function onMouseMove(e) {
    if (!dragItem.current) return;
    const { type, id, offsetX, offsetY } = dragItem.current;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    setPositions(prev => {
      if (type === 'strength') {
        return {
          ...prev,
          strengths: prev.strengths.map(s => s.id === id ? { ...s, x, y } : s),
        };
      } else if (type === 'skill') {
        return {
          ...prev,
          skills: prev.skills.map(s => s.id === id ? { ...s, x, y } : s),
        };
      } else {
        return {
          ...prev,
          productGuy: { ...prev.productGuy, x, y },
        };
      }
    });
  }
  function onMouseUp() {
    dragItem.current = null;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }
  function handleReset() {
    setPositions(getDefaultPositions());
  }

  // Map skill id to position
  const skillMap = Object.fromEntries(positions.skills.map(s => [s.id, s]));

  // SVG canvas size
  const width = boardWidth;
  const height = boardHeight;

  return (
    <section
      className="evidence-board-root"
      style={{
        width: '100%',
        maxWidth: width,
        margin: '0 auto',
        padding: 'clamp(2rem, 6vw, 4rem) 0',
        position: 'relative',
        minHeight: height,
        overflow: 'visible',
        userSelect: dragItem.current ? 'none' : 'auto',
        cursor: dragItem.current ? 'grabbing' : 'auto',
      }}
    >
      <h2 style={{
        fontFamily: 'var(--font-marker)',
        fontSize: 'clamp(1.5rem, 5vw, 2.4rem)',
        fontWeight: 900,
        color: '#222',
        marginBottom: '4.5rem',
        marginTop: '0',
        paddingTop: 'clamp(2.5rem, 7vw, 4.5rem)',
        textAlign: 'center',
        letterSpacing: '-1.5px',
        zIndex: 10,
        position: 'relative',
      }}>
        How My Strengths Map to Product Skills
      </h2>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width, height }}>
          {/* SVG thread lines */}
          <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 1 }}>
            {/* Strengths to skills */}
            {positions.strengths.map(str => {
              return str.skills.map(skillId => {
                const skill = skillMap[skillId];
                if (!skill) return null;
                const startX = str.x + stickyWidthSmall / 2;
                const startY = str.y + stickyHeightSmall;
                const endX = skill.x + stickyWidthLarge / 2;
                const endY = skill.y;
                return (
                  <g key={str.id + '-' + skillId}>
                    <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#b22222" strokeWidth={2} />
                    <circle cx={endX} cy={endY} r={5} fill="#b22222" stroke="#fff" strokeWidth={1.5} />
                  </g>
                );
              });
            })}
            {/* Skills to Product Guy */}
            {positions.skills.map(skill => {
              const startX = skill.x + stickyWidthLarge / 2;
              const startY = skill.y + stickyHeightLarge;
              const endX = positions.productGuy.x + centerStickySize / 2;
              const endY = positions.productGuy.y + centerStickySize / 2;
              return (
                <g key={skill.id + '-to-productguy'}>
                  <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#b22222" strokeWidth={3} />
                  <circle cx={endX} cy={endY} r={7} fill="#b22222" stroke="#fff" strokeWidth={2} />
                </g>
              );
            })}
          </svg>
          {/* Render strengths (small, colored) */}
          {positions.strengths.map(str => (
            <div
              key={str.id}
              style={{ position: 'absolute', left: str.x, top: str.y, zIndex: 10, cursor: 'grab', overflow: 'visible' }}
              onMouseDown={e => onMouseDown(e, 'strength', str.id)}
            >
              <StickyNote color={str.color} size="auto">
                {str.label}
              </StickyNote>
            </div>
          ))}
          {/* Render skills (large, yellow) */}
          {positions.skills.map(skill => (
            <div
              key={skill.id}
              style={{ position: 'absolute', left: skill.x, top: skill.y, zIndex: 12, cursor: 'grab', overflow: 'visible' }}
              onMouseDown={e => onMouseDown(e, 'skill', skill.id)}
            >
              <StickyNote color="yellow" size="large">
                {skill.label}
              </StickyNote>
            </div>
          ))}
          {/* Render Product Guy (center) */}
          <div
            style={{ position: 'absolute', left: positions.productGuy.x, top: positions.productGuy.y, zIndex: 15, cursor: 'grab', overflow: 'visible' }}
            onMouseDown={e => onMouseDown(e, 'productguy', 'productguy')}
          >
            <StickyNote color="yellow" size="large">
              The Product Guy
            </StickyNote>
          </div>
        </div>
      </div>
      {/* Color Legend */}
      <div style={{ margin: '5rem auto 0 auto', maxWidth: 600, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ display: 'inline-block', width: 28, height: 28, background: '#FFE066', borderRadius: 4, border: '1px solid #ccc' }}></span>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.2rem' }}>Skill</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ display: 'inline-block', width: 28, height: 28, background: '#B6E2A1', borderRadius: 4, border: '1px solid #ccc' }}></span>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.2rem' }}>CliftonStrengths</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ display: 'inline-block', width: 28, height: 28, background: '#A7C7E7', borderRadius: 4, border: '1px solid #ccc' }}></span>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.2rem' }}>VIA Strengths</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ display: 'inline-block', width: 28, height: 28, background: '#FF8C8C', borderRadius: 4, border: '1px solid #ccc' }}></span>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.2rem' }}>Gallup BP10</span>
        </div>
      </div>
    </section>
  );
} 