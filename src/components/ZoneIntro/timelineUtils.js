// Shared timeline utilities for axis and sticky mapping logic
// Ensures axis ticks and sticky positions are always in sync

// --- Timeline Data ---
// (In a real app, import or fetch this from a data file or API)
export const workEvents = [
  {
    title: 'Product Strategy and Design Consultant',
    company: 'theproductguy',
    startYear: 2024, startMonth: 11, // Nov 2024
    endYear: 2024, endMonth: 12, // Present (assume Dec 2024 for now)
  },
  {
    title: 'Product Strategist',
    company: 'Kellton',
    startYear: 2022, startMonth: 8, // Aug 2022
    endYear: 2024, endMonth: 10, // Oct 2024
  },
  {
    title: 'Senior Experience Designer',
    company: 'Thoughtworks',
    startYear: 2021, startMonth: 10, // Oct 2021
    endYear: 2022, endMonth: 7, // Jul 2022
  },
  {
    title: 'Product Designer',
    company: 'Moonraft Innovation Labs',
    startYear: 2021, startMonth: 4, // Apr 2021
    endYear: 2021, endMonth: 9, // Sep 2021
  },
  {
    title: 'Senior Experience Designer',
    company: 'ThoughtWorks',
    startYear: 2018, startMonth: 7, // Jul 2018
    endYear: 2021, endMonth: 3, // Mar 2021
  },
  {
    title: 'Senior UX Designer',
    company: 'WeKanCode',
    startYear: 2017, startMonth: 9, // Sep 2017
    endYear: 2018, endMonth: 6, // Jun 2018
  },
  {
    title: 'Senior UX Engineer',
    company: 'Lantrasoft',
    startYear: 2017, startMonth: 2, // Feb 2017
    endYear: 2017, endMonth: 9, // Sep 2017
  },
  {
    title: 'User Experience Designer',
    company: 'Starberry',
    startYear: 2015, startMonth: 7, // Jul 2015
    endYear: 2017, endMonth: 2, // Feb 2017
  },
  {
    title: 'UI Designer',
    company: 'IPEDIS',
    startYear: 2015, startMonth: 4, // Apr 2015
    endYear: 2015, endMonth: 6, // Jun 2015
  },
  {
    title: 'UI Designer',
    company: 'vSocialize',
    startYear: 2013, startMonth: 9, // Sep 2013
    endYear: 2015, endMonth: 3, // Mar 2015
  },
  {
    title: 'Design & Developer',
    company: 'Freelancer',
    startYear: 2011, startMonth: 2, // Feb 2011
    endYear: 2013, endMonth: 9, // Sep 2013
  },
  {
    title: 'Certified Scrum Master',
    company: 'Scrum Alliance',
    startYear: 2018, startMonth: 6,
    endYear: 2018, endMonth: 6,
    color: 'green',
  },
  {
    title: 'Certified Scrum Product Owner',
    company: 'Scrum Alliance',
    startYear: 2023, startMonth: 2,
    endYear: 2023, endMonth: 2,
    color: 'green',
  },
  {
    title: 'Advanced Certified Scrum Product Owner',
    company: 'Scrum Alliance',
    startYear: 2025, startMonth: 1,
    endYear: 2025, endMonth: 1,
    color: 'green',
  },
];

export const educationEvents = [
  { year: 2013, title: 'B.Tech', company: 'Easwari Engineering College' },
  { year: 2019, title: 'B.Sc. Psychology', company: 'Alagappa University' },
  { year: 2020, title: 'PGCP, Design and Innovation', company: 'Manipal Innovation and Design (MIND)' },
  { year: 2024, title: 'M.Sc. Applied Psychology', company: 'Annamalai University' },
];

// --- Timeline Constants ---
export const TIMELINE_HEIGHT = 120;
export const STICKY_SIZE = 140;
export const YEAR_GAP = 220; // px between years
export const WORK_OFFSET = 180; // px above timeline for work stickies
export const EDU_OFFSET = 80; // px below timeline for education
export const STACK_GAP = 18; // px vertical gap between stacked stickies

// --- Timeline Axis Calculation ---
export function getTimelineFloat(year, month) {
  return year + (month - 1) / 12;
}

// Get all floats for work events (start and end)
const allFloats = workEvents.flatMap(e => [getTimelineFloat(e.startYear, e.startMonth), getTimelineFloat(e.endYear, e.endMonth)]);
export const minYear = Math.floor(Math.min(...allFloats));
export const maxYear = Math.ceil(Math.max(...allFloats));
export const allYears = [];
for (let y = minYear; y <= maxYear; y++) allYears.push(y);

export const timelineWidth = (allYears.length - 1) * YEAR_GAP + 2 * YEAR_GAP;

// --- Axis/Sticky Mapping Functions ---
export function getXForFloat(midFloat) {
  return YEAR_GAP / 2 + (midFloat - minYear) * YEAR_GAP - STICKY_SIZE / 2;
}

export function getXForYear(year) {
  const i = allYears.indexOf(year);
  if (i === -1) return null;
  return YEAR_GAP / 2 + i * YEAR_GAP - STICKY_SIZE / 2;
}

// Group events by year for stacking
export function groupByYear(events) {
  const map = {};
  events.forEach(ev => {
    const year = ev.year || ev.startYear;
    if (!map[year]) map[year] = [];
    map[year].push(ev);
  });
  return map;
} 