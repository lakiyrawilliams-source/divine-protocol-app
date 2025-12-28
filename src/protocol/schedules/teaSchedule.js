// src/protocol/schedules/teaSchedule.js

export const TEA_TYPES = Object.freeze({
  DETOX_GREEN: "detox_green_tea",
  PURE_ENERGY: "pure_energy_tea",
  NERVOUS_SYSTEM: "nervous_system_tea",
  SKELETAL_SYSTEM: "skeletal_system_tea",
});

export const TEA_DIRECTIONS = Object.freeze({
  tspPer8oz: 1,
  water: "near boiling",
  steepMinutesMin: 17,
  steepMinutesMax: 27,
  sweetenerAllowed: false, // strict: no sweetener
  notes: "Do not add sweetener; it weakens the healing properties.",
});

// Day keys: 0=Sun ... 6=Sat (JS Date.getDay)
export const TEA_WEEKLY_SCHEDULE = Object.freeze({
  AM: Object.freeze({
    timing: "50 minutes before breakfast",
    byDay: Object.freeze({
      0: TEA_TYPES.DETOX_GREEN,      // Sunday
      1: TEA_TYPES.DETOX_GREEN,      // Monday
      2: TEA_TYPES.PURE_ENERGY,      // Tuesday
      3: TEA_TYPES.PURE_ENERGY,      // Wednesday
      4: TEA_TYPES.DETOX_GREEN,      // Thursday
      5: TEA_TYPES.PURE_ENERGY,      // Friday
      6: TEA_TYPES.DETOX_GREEN,      // Saturday
    }),
  }),
  PM: Object.freeze({
    timing: "2 hours after dinner",
    byDay: Object.freeze({
      0: TEA_TYPES.NERVOUS_SYSTEM,   // Sunday
      1: TEA_TYPES.NERVOUS_SYSTEM,   // Monday
      2: TEA_TYPES.SKELETAL_SYSTEM,  // Tuesday
      3: TEA_TYPES.SKELETAL_SYSTEM,  // Wednesday
      4: TEA_TYPES.NERVOUS_SYSTEM,   // Thursday
      5: TEA_TYPES.SKELETAL_SYSTEM,  // Friday
      6: TEA_TYPES.NERVOUS_SYSTEM,   // Saturday
    }),
  }),
});

// Helper
export function getTeaPlanForDate(date = new Date()) {
  const day = date.getDay();
  return {
    AM: { tea: TEA_WEEKLY_SCHEDULE.AM.byDay[day], timing: TEA_WEEKLY_SCHEDULE.AM.timing },
    PM: { tea: TEA_WEEKLY_SCHEDULE.PM.byDay[day], timing: TEA_WEEKLY_SCHEDULE.PM.timing },
    directions: TEA_DIRECTIONS,
  };
}
