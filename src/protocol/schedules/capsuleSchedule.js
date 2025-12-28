// src/data/teaCapsulesProtocol.js
// Strict tea + capsules protocol schedule
// Start date: 12/22/2025 (Day 1). America/New_York assumed by app runtime.
//
// Exports:
// - PROTOCOL_START_DATE
// - TEA_SCHEDULE
// - CAPSULE_SCHEDULES
// - getProtocolDayInfo(date?)
// - getWeeklyPlan(date?)
// - getDailyProtocol(date?)  -> "what to do today"
// - getTodayProtocol()       -> convenience

export const PROTOCOL_START_DATE = Object.freeze({
  year: 2025,
  month: 12, // 1-12
  day: 22,
});

export const WEEK_DAYS = Object.freeze([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

export const TEA_SCHEDULE = Object.freeze({
  directions: Object.freeze({
    tspPer8oz: 1,
    steepMinutes: "17-27",
    sweetener: "Do not add sweetener; it weakens the healing properties of the tea.",
  }),

  // keyed by day of week
  AM: Object.freeze({
    Monday: "Detox green tea (50 minutes before breakfast)",
    Tuesday: "Pure energy tea (50 minutes before breakfast)",
    Wednesday: "Pure energy tea (50 minutes before breakfast)",
    Thursday: "Detox green tea (50 minutes before breakfast)",
    Friday: "Pure energy tea (50 minutes before breakfast)",
    Saturday: "Detox green tea (50 minutes before breakfast)",
    Sunday: "Detox green tea (50 minutes before breakfast)",
  }),

  PM: Object.freeze({
    Monday: "Nervous system tea (2 hours after dinner)",
    Tuesday: "Skeletal system tea (2 hours after dinner)",
    Wednesday: "Skeletal system tea (2 hours after dinner)",
    Thursday: "Nervous system tea (2 hours after dinner)",
    Friday: "Skeletal system tea (2 hours after dinner)",
    Saturday: "Nervous system tea (2 hours after dinner)",
    Sunday: "Nervous system tea (2 hours after dinner)",
  }),
});

// Capsules / supplements schedule blocks
// Each block has week ranges with per-day instructions.
export const CAPSULE_SCHEDULES = Object.freeze([
  {
    id: "digestive_system",
    title: "Digestive system",
    instructions: "1 capsule 20 minutes before breakfast",
    phases: Object.freeze([
      {
        weeks: [1, 8],
        days: Object.freeze({
          Monday: "1 capsule 20 minutes before breakfast",
          Tuesday: "1 capsule 20 minutes before breakfast",
          Wednesday: "1 capsule 20 minutes before breakfast",
          Thursday: "1 capsule 20 minutes before breakfast",
          Friday: "1 capsule 20 minutes before breakfast",
          Saturday: "off",
          Sunday: "off",
        }),
      },
      {
        weeks: [9, 16],
        days: Object.freeze({
          Monday: "1 capsule 20 minutes before breakfast",
          Tuesday: "1 capsule 20 minutes before breakfast",
          Wednesday: "1 capsule 20 minutes before breakfast",
          Thursday: "1 capsule 20 minutes before breakfast",
          Friday: "1 capsule 20 minutes before breakfast",
          Saturday: "1 capsule 20 minutes before breakfast",
          Sunday: "off",
        }),
      },
      {
        weeks: [17, 24],
        days: Object.freeze({
          Monday: "1 capsule 20 minutes before breakfast",
          Tuesday: "1 capsule 20 minutes before breakfast",
          Wednesday: "1 capsule 20 minutes before breakfast",
          Thursday: "1 capsule 20 minutes before breakfast",
          Friday: "1 capsule 20 minutes before breakfast",
          Saturday: "1 capsule 20 minutes before breakfast",
          Sunday: "1 capsule 20 minutes before breakfast",
        }),
      },
    ]),
  },

  {
    id: "womens_multivitamin_mineral",
    title: "Natural Factors, Women's Multivitamin & Mineral",
    instructions: "1 tablet with breakfast",
    phases: Object.freeze([
      {
        weeks: [1, 8],
        days: Object.freeze({
          Monday: "1 tablet with breakfast",
          Tuesday: "1 tablet with breakfast",
          Wednesday: "1 tablet with breakfast",
          Thursday: "1 tablet with breakfast",
          Friday: "1 tablet with breakfast",
          Saturday: "1 tablet with breakfast",
          Sunday: "1 tablet with breakfast",
        }),
      },
      {
        weeks: [9, 16],
        days: Object.freeze({
          Monday: "1 tablet with breakfast",
          Tuesday: "1 tablet with breakfast",
          Wednesday: "1 tablet with breakfast",
          Thursday: "1 tablet with breakfast",
          Friday: "1 tablet with breakfast",
          Saturday: "1 tablet with breakfast",
          Sunday: "off",
        }),
      },
      {
        weeks: [17, 24],
        days: Object.freeze({
          Monday: "1 tablet with breakfast",
          Tuesday: "1 tablet with breakfast",
          Wednesday: "1 tablet with breakfast",
          Thursday: "1 tablet with breakfast",
          Friday: "1 tablet with breakfast",
          Saturday: "off",
          Sunday: "off",
        }),
      },
    ]),
  },

  {
    id: "immune_lymphatic_system",
    title: "Immune and lymphatic system",
    instructions: "1 capsule 20 minutes before lunch",
    phases: Object.freeze([
      {
        weeks: [1, 8],
        days: Object.freeze({
          Monday: "1 capsule 20 minutes before lunch",
          Tuesday: "1 capsule 20 minutes before lunch",
          Wednesday: "1 capsule 20 minutes before lunch",
          Thursday: "1 capsule 20 minutes before lunch",
          Friday: "1 capsule 20 minutes before lunch",
          Saturday: "off",
          Sunday: "off",
        }),
      },
      {
        weeks: [9, 16],
        days: Object.freeze({
          Monday: "1 capsule 20 minutes before lunch",
          Tuesday: "1 capsule 20 minutes before lunch",
          Wednesday: "1 capsule 20 minutes before lunch",
          Thursday: "1 capsule 20 minutes before lunch",
          Friday: "1 capsule 20 minutes before lunch",
          Saturday: "1 capsule 20 minutes before lunch",
          Sunday: "off",
        }),
      },
      {
        weeks: [17, 24],
        days: Object.freeze({
          Monday: "1 capsule 20 minutes before lunch",
          Tuesday: "1 capsule 20 minutes before lunch",
          Wednesday: "1 capsule 20 minutes before lunch",
          Thursday: "1 capsule 20 minutes before lunch",
          Friday: "1 capsule 20 minutes before lunch",
          Saturday: "1 capsule 20 minutes before lunch",
          Sunday: "1 capsule 20 minutes before lunch",
        }),
      },
    ]),
  },

  {
    id: "reproductive_system",
    title: "Reproductive system",
    instructions: "1 capsule 20 minutes before dinner",
    phases: Object.freeze([
      {
        weeks: [1, 8],
        days: Object.freeze({
          Monday: "1 capsule 20 minutes before dinner",
          Tuesday: "1 capsule 20 minutes before dinner",
          Wednesday: "1 capsule 20 minutes before dinner",
          Thursday: "1 capsule 20 minutes before dinner",
          Friday: "1 capsule 20 minutes before dinner",
          Saturday: "off",
          Sunday: "off",
        }),
      },
      {
        // NOTE: your text says "9-18 week" but later uses 17-24 as well.
        // To keep the protocol consistent & strict, we interpret this as 9-16,
        // then 17-24 matches the last block (same pattern as other schedules).
        weeks: [9, 16],
        days: Object.freeze({
          Monday: "1 capsule 20 minutes before dinner",
          Tuesday: "1 capsule 20 minutes before dinner",
          Wednesday: "1 capsule 20 minutes before dinner",
          Thursday: "1 capsule 20 minutes before dinner",
          Friday: "1 capsule 20 minutes before dinner",
          Saturday: "1 capsule 20 minutes before dinner",
          Sunday: "off",
        }),
      },
      {
        weeks: [17, 24],
        days: Object.freeze({
          Monday: "1 capsule 20 minutes before dinner",
          Tuesday: "1 capsule 20 minutes before dinner",
          Wednesday: "1 capsule 20 minutes before dinner",
          Thursday: "1 capsule 20 minutes before dinner",
          Friday: "1 capsule 20 minutes before dinner",
          Saturday: "1 capsule 20 minutes before dinner",
          Sunday: "1 capsule 20 minutes before dinner",
        }),
      },
    ]),
  },

  {
    id: "complete_mineral_complex",
    title: "Designs For Health, Complete Mineral Complex",
    instructions: "2 capsules with dinner",
    phases: Object.freeze([
      {
        weeks: [1, 24],
        days: Object.freeze({
          Monday: "2 capsules with dinner",
          Tuesday: "2 capsules with dinner",
          Wednesday: "2 capsules with dinner",
          Thursday: "2 capsules with dinner",
          Friday: "2 capsules with dinner",
          Saturday: "2 capsules with dinner",
          Sunday: "2 capsules with dinner",
        }),
      },
    ]),
  },
]);

// ------------------------------------
// Date helpers (local time safe-ish)
// ------------------------------------
function startDateLocal() {
  // month is 1-12 in PROTOCOL_START_DATE; JS Date uses 0-11
  return new Date(
    PROTOCOL_START_DATE.year,
    PROTOCOL_START_DATE.month - 1,
    PROTOCOL_START_DATE.day,
    0,
    0,
    0,
    0
  );
}

function toLocalMidnight(d) {
  const x = d instanceof Date ? d : new Date(d);
  return new Date(x.getFullYear(), x.getMonth(), x.getDate(), 0, 0, 0, 0);
}

function diffDays(a, b) {
  // a - b in whole days, using local midnight
  const A = toLocalMidnight(a).getTime();
  const B = toLocalMidnight(b).getTime();
  const ms = A - B;
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

function dayName(d) {
  // JS: 0=Sun..6=Sat => map to WEEK_DAYS
  const js = d.getDay();
  const map = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };
  return map[js];
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function findPhase(phases, weekNumber) {
  for (const p of phases || []) {
    const [w1, w2] = p.weeks || [];
    if (Number.isFinite(w1) && Number.isFinite(w2) && weekNumber >= w1 && weekNumber <= w2) return p;
  }
  return null;
}

// ------------------------------------
// Public functions
// ------------------------------------

/**
 * getProtocolDayInfo(date?)
 * Returns:
 *  - startDate
 *  - date
 *  - dayNumber (1-based; Day 1 = start date)
 *  - weekNumber (1-based; Week 1 = days 1-7)
 *  - dayOfWeek ("Monday"...)
 *  - isBeforeStart
 */
export function getProtocolDayInfo(date = new Date()) {
  const start = startDateLocal();
  const current = toLocalMidnight(date);
  const daysSinceStart = diffDays(current, start);

  const isBeforeStart = daysSinceStart < 0;
  const dayNumber = isBeforeStart ? 0 : daysSinceStart + 1;
  const weekNumber = isBeforeStart ? 0 : Math.floor((dayNumber - 1) / 7) + 1;

  return Object.freeze({
    startDate: start,
    date: current,
    dayNumber,
    weekNumber,
    dayOfWeek: dayName(current),
    isBeforeStart,
  });
}

/**
 * getDailyProtocol(date?)
 * Returns a structured "today" plan:
 *  - teas: { AM, PM, directions }
 *  - capsules: [{ id, title, action }]
 */
export function getDailyProtocol(date = new Date()) {
  const info = getProtocolDayInfo(date);

  if (info.isBeforeStart) {
    return Object.freeze({
      ...info,
      teas: null,
      capsules: [],
      note: "Date is before protocol start.",
    });
  }

  const dow = info.dayOfWeek;

  const teas = Object.freeze({
    directions: TEA_SCHEDULE.directions,
    AM: TEA_SCHEDULE.AM[dow] || null,
    PM: TEA_SCHEDULE.PM[dow] || null,
  });

  const capsules = CAPSULE_SCHEDULES.map((block) => {
    const phase = findPhase(block.phases, info.weekNumber);
    const action = phase?.days?.[dow] ?? "off";
    return Object.freeze({
      id: block.id,
      title: block.title,
      action,
    });
  });

  return Object.freeze({
    ...info,
    teas,
    capsules,
  });
}

export function getTodayProtocol() {
  return getDailyProtocol(new Date());
}

/**
 * getWeeklyPlan(date?)
 * Returns the current week plan (Mon-Sun) with per-day protocol.
 * Useful for UI “Week view”.
 */
export function getWeeklyPlan(date = new Date()) {
  const info = getProtocolDayInfo(date);
  if (info.isBeforeStart) {
    return Object.freeze({
      ...info,
      weekStartDate: null,
      days: [],
      note: "Date is before protocol start.",
    });
  }

  // Find Monday of the current week (relative to local date)
  const d = toLocalMidnight(date);
  const dow = d.getDay(); // 0=Sun..6=Sat
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + mondayOffset, 0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i, 0, 0, 0, 0);
    days.push(getDailyProtocol(day));
  }

  return Object.freeze({
    ...info,
    weekStartDate: monday,
    days: Object.freeze(days),
  });
}
