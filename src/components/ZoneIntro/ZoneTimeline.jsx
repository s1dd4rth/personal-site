import React from 'react';
import StickyNote from './StickyNote.jsx';
import {
  workEvents,
  educationEvents,
  TIMELINE_HEIGHT,
  STICKY_SIZE,
  YEAR_GAP,
  WORK_OFFSET,
  EDU_OFFSET,
  STACK_GAP,
  minYear,
  maxYear,
  allYears,
  timelineWidth,
  getTimelineFloat,
  getXForFloat,
  getXForYear,
  groupByYear,
} from './timelineUtils.js';

// Responsive sticky size and gap
const getStickySize = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 500) return 90;
    if (window.innerWidth < 900) return 120;
  }
  return 140;
};
const getStackGap = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 500) return 8;
    if (window.innerWidth < 900) return 14;
  }
  return 18;
};

export default function ZoneTimeline({ timelineWidth: propTimelineWidth, viewportWidth }) {
  // Timeline width
  const axisY = TIMELINE_HEIGHT / 2;
  const stickySize = typeof window !== 'undefined' ? getStickySize() : 140;
  const stackGap = typeof window !== 'undefined' ? getStackGap() : 18;
  const workBaseY = axisY + 40;
  const eduBaseY = workBaseY + 1.5 * stickySize;
  const containerHeight = eduBaseY + 3 * stickySize;

  // For each event, calculate its midpoint float and x using the continuous axis
  const workStickies = workEvents.map(event => {
    const startFloat = getTimelineFloat(event.startYear, event.startMonth);
    const endFloat = getTimelineFloat(event.endYear, event.endMonth);
    const midFloat = (startFloat + endFloat) / 2;
    const x = getXForFloat(midFloat);
    return { ...event, x, midFloat };
  });

  // Improved stacking: group by year, then stack within year
  const workByYear = {};
  workStickies.forEach(sticky => {
    const year = Math.round(sticky.midFloat);
    if (!workByYear[year]) workByYear[year] = [];
    workByYear[year].push(sticky);
  });
  const placedWork = [];
  Object.entries(workByYear).forEach(([year, stickies]) => {
    stickies.sort((a, b) => a.title.localeCompare(b.title)); // Consistent order
    stickies.forEach((sticky, i) => {
      placedWork.push({ ...sticky, stack: i });
    });
  });

  // Group education events by their x-position (year or midpoint)
  const eduXMap = {};
  allYears.forEach((year, i) => {
    const events = (groupByYear(educationEvents)[year]) || [];
    events.forEach(event => {
      let x = getXForYear(year);
      if (!eduXMap[x]) eduXMap[x] = [];
      eduXMap[x].push(event);
    });
  });

  return (
    <div style={{ width: timelineWidth, minWidth: timelineWidth, position: 'relative', height: containerHeight, overflow: 'visible' }}>
      {/* Work events mapped to timeline horizontally, stacked vertically if needed */}
      {placedWork.map((event, j) => (
        <StickyNote
          key={event.title + '-' + event.company}
          color={event.color || (j % 2 === 0 ? 'yellow' : 'orange')}
          x={event.x}
          y={workBaseY + event.stack * (stickySize + stackGap)}
          draggable={false}
          style={{
            maxWidth: stickySize,
            maxHeight: stickySize,
            minWidth: 70,
            minHeight: 70,
            overflow: 'hidden',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            overflowWrap: 'break-word',
            fontSize: 'clamp(0.8rem, 2vw, 1.08rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontWeight: 800, wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word', fontSize: 'clamp(0.8rem, 2vw, 1.08rem)' }}>{event.title}</div>
          <div style={{ fontWeight: 600, fontSize: 'clamp(0.7rem, 1.5vw, 0.98rem)', color: '#444', marginBottom: 4, wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word' }}>{event.company}</div>
        </StickyNote>
      ))}
      {/* Education events mapped to timeline horizontally, stacked vertically if needed */}
      {Object.entries(eduXMap).map(([x, events]) =>
        events.map((event, j) => (
          <StickyNote
            key={event.title + '-' + event.company}
            color={'blue'}
            x={parseFloat(x)}
            y={eduBaseY + j * (stickySize + stackGap)}
            draggable={false}
            style={{
              maxWidth: stickySize,
              maxHeight: stickySize,
              minWidth: 70,
              minHeight: 70,
              overflow: 'hidden',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              overflowWrap: 'break-word',
              fontSize: 'clamp(0.8rem, 2vw, 1.08rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontWeight: 800, wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word', fontSize: 'clamp(0.8rem, 2vw, 1.08rem)' }}>{event.title}</div>
            <div style={{ fontWeight: 600, fontSize: 'clamp(0.7rem, 1.5vw, 0.98rem)', color: '#444', marginBottom: 4, wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word' }}>{event.company}</div>
          </StickyNote>
        ))
      )}
    </div>
  );
} 