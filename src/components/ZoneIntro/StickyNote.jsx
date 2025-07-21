import React, { useState, useEffect, useRef } from 'react';

const colorMap = {
  yellow: '#FFE066', // Vibrant Yellow
  pink: '#FFD6E0',   // Vibrant Pink
  blue: '#A7C7E7',   // Vibrant Blue
  green: '#B6E2A1',  // Vibrant Green
  red: '#FF8C8C',    // Vibrant Red
  orange: '#FFB347', // Vibrant Orange
  lightblue: '#B3E6FF', // Light Blue
};
const defaultColor = 'yellow';

function getRandomRotation() {
  // Random rotation between -4 and 4 degrees
  return Math.floor(Math.random() * 9) - 4;
}

export default function StickyNote({ color = defaultColor, x = 0, y = 0, rotation, draggable = false, size = 'auto', children }) {
  // Only randomize rotation on the client to avoid hydration mismatch
  const [clientRotation, setClientRotation] = useState(0);
  useEffect(() => {
    if (rotation !== undefined) {
      setClientRotation(rotation);
    } else {
      setClientRotation(getRandomRotation());
    }
  }, [rotation]);
  const bgColor = colorMap[color] || colorMap[defaultColor];

  // Multi-line support: split children on \n
  let lines = [];
  let textLength = 0;
  if (typeof children === 'string') {
    lines = children.split('\n');
    textLength = children.replace(/\n/g, '').length;
  } else if (Array.isArray(children)) {
    lines = children;
    textLength = children.join('').length;
  } else {
    lines = [children];
    textLength = String(children).length;
  }

  // Font size logic
  let fontSize = '1.25rem';
  if (textLength > 28) fontSize = '1.05rem';
  if (textLength > 40) fontSize = '0.92rem';
  if (textLength > 55) fontSize = '0.8rem';
  if (textLength > 65) fontSize = '0.7rem';
  if (textLength > 80) fontSize = '0.62rem';
  if (textLength > 100) fontSize = '0.55rem';
  if (parseFloat(fontSize) < 0.7) fontSize = '0.7rem';

  // --- Sticky Note Sizing ---
  // Physical sticky sizes (approximate in px):
  // small: 3"x3" (120x120px), large: 4"x4" (180x180px)
  let minWidth, minHeight, maxWidth, maxHeight, width;
  let resolvedSize = size;
  if (size === 'auto') {
    // Threshold: if text is long, has >2 lines, or has a long word, use large
    const longestWord = lines.reduce((max, line) => {
      if (typeof line !== 'string') line = String(line);
      const lw = line.split(/\s+/).reduce((m, w) => w.length > m ? w.length : m, 0);
      return lw > max ? lw : max;
    }, 0);
    if (textLength > 32 || lines.length > 2 || longestWord > 12) {
      resolvedSize = 'large';
    } else {
      resolvedSize = 'small';
    }
  }
  if (resolvedSize === 'large') {
    minWidth = minHeight = '180px';
    maxWidth = undefined;
    maxHeight = '240px';
    width = 'auto';
  } else {
    minWidth = minHeight = '120px';
    maxWidth = maxHeight = '140px';
    width = 'auto';
  }

  // Draggable logic
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, offsetX: 0, offsetY: 0 });

  function onMouseDown(e) {
    if (!draggable) return;
    setDragging(true);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      offsetX: dragOffset.x,
      offsetY: dragOffset.y,
    };
    document.body.style.userSelect = 'none';
  }
  function onMouseMove(e) {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.mouseX;
    const dy = e.clientY - dragStart.current.mouseY;
    setDragOffset({
      x: dragStart.current.offsetX + dx,
      y: dragStart.current.offsetY + dy,
    });
  }
  function onMouseUp() {
    setDragging(false);
    document.body.style.userSelect = '';
  }

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  // Reset drag offset if x/y changes (e.g. on layout recompute)
  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
  }, [x, y]);

  // Allow style prop to override layout for timeline usage (removes absolute positioning)
  const isTimeline = !!(typeof x === 'number' && typeof y === 'number');
  const isSingleLongWord = lines.length === 1 && typeof lines[0] === 'string' && lines[0].split(/\s+/).length === 1;
  return (
    <div
      style={{
        position: isTimeline ? 'absolute' : 'relative',
        left: isTimeline ? x + dragOffset.x : undefined,
        top: isTimeline ? y + dragOffset.y : undefined,
        userSelect: 'none',
        borderRadius: 0,
        boxShadow: '0 12px 32px 0 rgba(0,0,0,0.18), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
        width: isSingleLongWord ? 'fit-content' : width,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        fontFamily: 'var(--font-marker)',
        fontSize: fontSize,
        background: bgColor,
        padding: '1.2rem',
        fontWeight: 800,
        color: '#222',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 0.5rem',
        transform: `rotate(${clientRotation}deg)` + (dragging ? ' scale(1.04)' : ''),
        zIndex: 10,
        letterSpacing: '-0.5px',
        cursor: draggable ? (dragging ? 'grabbing' : 'grab') : 'default',
        transition: dragging ? 'none' : 'box-shadow 0.2s, transform 0.2s',
        overflow: 'visible',
        overflowWrap: 'break-word',
        wordBreak: 'normal',
        whiteSpace: isSingleLongWord ? 'nowrap' : 'pre-line',
      }}
      onMouseDown={onMouseDown}
    >
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'visible', overflowWrap: 'break-word', wordBreak: 'normal', whiteSpace: isSingleLongWord ? 'nowrap' : 'pre-line' }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: fontSize,
              lineHeight: 1.2,
              fontWeight: i === 1 ? 500 : 800,
              color: i === 1 ? '#444' : '#222',
              marginTop: i === 1 ? '0.5rem' : 0,
              overflow: 'visible',
              textOverflow: 'unset',
              whiteSpace: isSingleLongWord ? 'nowrap' : 'pre-line',
              overflowWrap: 'break-word',
              wordBreak: 'normal',
              width: '100%',
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
