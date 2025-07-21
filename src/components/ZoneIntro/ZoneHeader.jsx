import React from 'react';
import {
  allYears,
  timelineWidth,
  YEAR_GAP,
  TIMELINE_HEIGHT,
} from './timelineUtils.js';

// These should match the data in ZoneTimeline.jsx
const workEvents = [
  { year: 2024 }, { year: 2022 }, { year: 2018 }, { year: 2021 }, { year: 2013 }
];
const educationEvents = [
  { year: 2008 }, { year: 2013 }, { year: 2019 }, { year: 2020 }, { year: 2024 }, { year: 2020 }, { year: 2021 }
];
const certificationEvents = [
  { year: 2009 }, { year: 2011 }, { year: 2012 }, { year: 2012 }, { year: 2012 }, { year: 2012 }, { year: 2016 }, { year: 2018 }, { year: 2019 }, { year: 2019 }, { year: 2020 }, { year: 2020 }, { year: 2020 }, { year: 2020 }, { year: 2020 }, { year: 2020 }, { year: 2021 }, { year: 2021 }, { year: 2023 }, { year: 2021 }, { year: 2021 }, { year: 2022 }, { year: 2022 }, { year: 2022 }, { year: 2022 }, { year: 2022 }, { year: 2022 }, { year: 2022 }, { year: 2023 }, { year: 2023 }, { year: 2023 }, { year: 2023 }, { year: 2023 }, { year: 2023 }, { year: 2023 }, { year: 2024 }, { year: 2024 }, { year: 2024 }, { year: 2024 }, { year: 2024 }, { year: 2025 }
];

export default function ZoneHeader({ onMouseDown, dragging }) {
  return (
    <div style={{
      position: 'relative',
      width: timelineWidth,
      minWidth: timelineWidth,
      height: TIMELINE_HEIGHT + 60,
      pointerEvents: 'auto',
      zIndex: 10,
    }}>
      <div
        style={{
          position: 'relative',
          width: timelineWidth,
          margin: '0 auto',
          height: TIMELINE_HEIGHT,
          cursor: dragging ? 'grabbing' : 'grab',
          overflow: 'visible',
        }}
        onMouseDown={onMouseDown}
      >
        <svg
          width={timelineWidth}
          height={TIMELINE_HEIGHT}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          {/* Main timeline line */}
          <line
            x1={YEAR_GAP / 2}
            y1={TIMELINE_HEIGHT / 2}
            x2={timelineWidth - YEAR_GAP / 2}
            y2={TIMELINE_HEIGHT / 2}
            stroke="#222"
            strokeWidth={4}
            strokeDasharray="8 6"
          />
          {/* Year ticks */}
          {allYears.map((year, i) => (
            <g key={year}>
              <line
                x1={YEAR_GAP / 2 + i * YEAR_GAP}
                y1={TIMELINE_HEIGHT / 2 - 18}
                x2={YEAR_GAP / 2 + i * YEAR_GAP}
                y2={TIMELINE_HEIGHT / 2 + 18}
                stroke="#222"
                strokeWidth={3}
              />
              <text
                x={YEAR_GAP / 2 + i * YEAR_GAP}
                y={TIMELINE_HEIGHT / 2 + 38}
                textAnchor="middle"
                fontFamily="var(--font-marker)"
                fontSize="clamp(0.8rem, 2vw, 1.2rem)"
                fill="#222"
              >
                {year}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
} 