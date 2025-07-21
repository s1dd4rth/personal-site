import React, { useRef, useState, useEffect } from 'react';
import ZoneHeader from './ZoneHeader.jsx';
import ZoneTimeline from './ZoneTimeline.jsx';
import { timelineWidth } from './timelineUtils.js';

// These must match the data in ZoneHeader/ZoneTimeline
const TIMELINE_HEIGHT = 120;
const YEAR_GAP = 220;
const workEvents = [
  { year: 2024 }, { year: 2022 }, { year: 2018 }, { year: 2021 }, { year: 2013 }
];
const educationEvents = [
  { year: 2008 }, { year: 2013 }, { year: 2019 }, { year: 2020 }, { year: 2024 }, { year: 2020 }, { year: 2021 }
];
const certificationEvents = [
  { year: 2009 }, { year: 2011 }, { year: 2012 }, { year: 2012 }, { year: 2012 }, { year: 2012 }, { year: 2016 }, { year: 2018 }, { year: 2019 }, { year: 2019 }, { year: 2020 }, { year: 2020 }, { year: 2020 }, { year: 2020 }, { year: 2020 }, { year: 2020 }, { year: 2021 }, { year: 2021 }, { year: 2023 }, { year: 2021 }, { year: 2021 }, { year: 2022 }, { year: 2022 }, { year: 2022 }, { year: 2022 }, { year: 2022 }, { year: 2022 }, { year: 2022 }, { year: 2023 }, { year: 2023 }, { year: 2023 }, { year: 2023 }, { year: 2023 }, { year: 2023 }, { year: 2023 }, { year: 2024 }, { year: 2024 }, { year: 2024 }, { year: 2024 }, { year: 2024 }, { year: 2025 }
];
const allYears = Array.from(new Set([
  ...workEvents.map(e => e.year),
  ...educationEvents.map(e => e.year),
  ...certificationEvents.map(e => e.year),
])).sort((a, b) => a - b);

const DraggableTimeline = () => {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const dragStart = useRef({ mouseX: 0, offsetX: 0 });
  const [showDragHint, setShowDragHint] = useState(true);

  useEffect(() => {
    function handleResize() {
      setViewportWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clamp dragX so you can't drag past the ends
  function clampDragX(x) {
    if (timelineWidth <= viewportWidth) return 0;
    const minX = viewportWidth - timelineWidth;
    const maxX = 0;
    return Math.max(minX, Math.min(maxX, x));
  }

  function onMouseDown(e) {
    setDragging(true);
    setShowDragHint(false);
    dragStart.current = {
      mouseX: e.clientX,
      offsetX: dragX,
    };
    document.body.style.userSelect = 'none';
  }
  function onMouseMove(e) {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.mouseX;
    setDragX(clampDragX(dragStart.current.offsetX + dx));
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

  // Hide drag hint after 2.5s or on first drag
  useEffect(() => {
    if (!showDragHint) return;
    const timeout = setTimeout(() => setShowDragHint(false), 2500);
    return () => clearTimeout(timeout);
  }, [showDragHint]);

  // Canvas style: let section grow, blend with canvas
  return (
    <div style={{
      width: '100vw',
      overflowX: 'auto',
      position: 'relative',
      zIndex: 10,
      WebkitOverflowScrolling: 'touch',
      minHeight: 260,
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none', // IE/Edge
    }}
      className="hide-scrollbar"
    >
      <div
        style={{
          width: timelineWidth,
          minWidth: timelineWidth,
          height: '100%',
          position: 'relative',
          left: 0,
          top: 0,
          willChange: 'transform',
          transition: dragging ? 'none' : 'transform 0.25s cubic-bezier(.22,1,.36,1)',
          transform: `translateX(${dragX}px)`
        }}
      >
        <ZoneHeader
          dragX={0}
          onMouseDown={onMouseDown}
          dragging={dragging}
          timelineWidth={timelineWidth}
          viewportWidth={viewportWidth}
        />
        <ZoneTimeline
          dragX={0}
          onMouseDown={onMouseDown}
          dragging={dragging}
          timelineWidth={timelineWidth}
          viewportWidth={viewportWidth}
        />
      </div>
      <div style={{
        position: 'absolute',
        left: '50%',
        bottom: 12,
        transform: 'translateX(-50%)',
        width: 48,
        height: 6,
        borderRadius: 3,
        background: dragging ? '#3245FF' : '#d1d5db',
        opacity: 0.7,
        transition: 'background 0.2s',
        zIndex: 20,
        pointerEvents: 'none',
        display: 'block',
      }} />
      {/* Animated hand drag hint overlay */}
      {showDragHint && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 30,
          pointerEvents: 'none',
          opacity: 0.85,
          animation: 'fadeout-draghint 0.7s 1.8s forwards',
        }}>
          <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.10))' }}>
            <g>
              <path d="M27 44c-2.5 0-4.5-2-4.5-4.5V19.5a2.5 2.5 0 1 1 5 0V36" stroke="#222" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M27 44c2.5 0 4.5-2 4.5-4.5V19.5a2.5 2.5 0 1 0-5 0V36" stroke="#222" strokeWidth="2.5" strokeLinecap="round"/>
              <rect x="20" y="44" width="14" height="6" rx="3" fill="#222" fillOpacity="0.12"/>
              <animateTransform attributeName="transform" type="translate" values="0 0; 10 0; -10 0; 0 0" keyTimes="0;0.3;0.7;1" dur="1.5s" repeatCount="indefinite"/>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};

export default DraggableTimeline; 