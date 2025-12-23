import React, { useEffect, useMemo, useState } from "react";
import {
  Sun,
  Moon,
  Droplets,
  Clock,
  Calendar,
  ChefHat,
  ShoppingCart,
  Check,
  X,
  Plus,
  Minus,
  Home,
  Utensils,
  Apple,
  Salad,
  Sparkles,
  Download,
  Star,
  Leaf,
  Heart,
  FileDown,
  Trash2,
  Settings,
  RefreshCw,
  AlertCircle,
  Play,
} from "lucide-react";

// ============================================
// PROTOCOL DATA (do not add/remove foods)
// ============================================
const PROTOCOL = {
  fruits: {
    melons: [
      { name: "Honeydew Melon", freq: 7, cat: "melon" },
      { name: "Cantaloupe", freq: 7, cat: "melon" },
    ],
    sweet: [
      { name: "Papaya", freq: 7, cat: "sweet" },
      { name: "Date Fruit", freq: 5, cat: "sweet" },
      { name: "Figs", freq: 5, cat: "sweet" },
      { name: "Grapes", freq: 1, cat: "sweet" },
    ],
    subAcid: [
      { name: "Apricots", freq: 7, cat: "sub-acid" },
      { name: "Wild Blueberries", freq: 7, cat: "sub-acid" },
      { name: "Mango", freq: 5, cat: "sub-acid" },
      { name: "Blueberries", freq: 2, cat: "sub-acid" },
    ],
    acid: [
      { name: "Lemon", freq: 7, cat: "acid" },
      { name: "Lime", freq: 7, cat: "acid" },
      { name: "Orange", freq: 2, cat: "acid" },
      { name: "Pineapple", freq: 2, cat: "acid" },
      { name: "Pomegranate", freq: 2, cat: "acid" },
    ],
  },

  complexCarbs: [
    { name: "Quinoa", freq: 7 },
    { name: "Sweet Potato", freq: 7 },
    { name: "Buckwheat", freq: null },
    { name: "Red Potato", freq: null },
    { name: "White Potato", freq: null },
  ],

  greens: [
    { name: "Microgreens", freq: 7 },
    { name: "Romaine Lettuce", freq: 4 },
    { name: "Iceberg Lettuce", freq: 3 },
    { name: "Napa Cabbage", freq: 3 },
    { name: "Spinach", freq: null },
    { name: "Turnip Greens", freq: null },
  ],

  vegetables: [
    { name: "Carrot", freq: 7, meals: ["lunch", "dinner"] },
    { name: "Celery", freq: 7, meals: ["lunch", "dinner"] },
    { name: "Green Cabbage", freq: 7, meals: ["lunch", "dinner"] },
    { name: "Zucchini", freq: 7, meals: ["lunch", "dinner"] },
    { name: "Green Peas", freq: 7, meals: ["dinner"] },
    { name: "Red Onion", freq: 6, meals: ["lunch", "dinner"] },
    { name: "Kabocha Squash", freq: 5, meals: ["lunch", "dinner"] },
    { name: "Leek", freq: 5, meals: ["lunch", "dinner"] },
    { name: "Green Beans", freq: 4, meals: ["lunch", "dinner"] },
    { name: "Summer Squash", freq: 3, meals: ["lunch", "dinner"] },
    { name: "Asparagus", freq: 2, meals: ["lunch", "dinner"] },
    { name: "Broccoli", freq: 2, meals: ["lunch", "dinner"] },
    { name: "Cauliflower", freq: 2, meals: ["lunch", "dinner"] },
    { name: "Green Onion", freq: 2, meals: ["lunch", "dinner"] },
    { name: "Snow Peas", freq: 2, meals: ["dinner"] },
    { name: "Sugar Snap Peas", freq: 2, meals: ["dinner"] },
    { name: "Red Cabbage", freq: 1, meals: ["lunch", "dinner"] },
    { name: "Butternut Squash", freq: null, meals: ["lunch", "dinner"] },
    { name: "Beets", freq: null, meals: ["lunch", "dinner"] },
    { name: "Brussels Sprouts", freq: null, meals: ["lunch", "dinner"] },
    { name: "Cucumber", freq: null, meals: ["lunch", "dinner"] },
    { name: "Fennel", freq: null, meals: ["lunch", "dinner"] },
    { name: "Jerusalem Artichoke", freq: null, meals: ["dinner"] },
    { name: "Pumpkin", freq: null, meals: ["lunch", "dinner"] },
  ],

  proteins: [
    { name: "Chickpeas", freq: 5, soak: 14, cook: 65 },
    { name: "Lentils", freq: 4, soak: 6, cook: 35 },
    { name: "Azuki Beans", freq: 2, soak: 8, cook: 40 },
    { name: "Black Beans", freq: 2, soak: 12, cook: 60 },
    { name: "Pinto Beans", freq: 1, soak: 10, cook: 50 },
    { name: "Lima Beans", freq: null, soak: 8, cook: 40 },
    { name: "Sprouted Tofu", freq: null, soak: 0, cook: 15 },
  ],

  seeds: [
    { name: "Hemp Seeds", freq: 7 },
    { name: "Sesame Seeds", freq: null },
    { name: "Pumpkin Seeds", freq: null },
    { name: "Flax Seeds", freq: null },
    { name: "Walnuts", freq: 1 },
  ],

  sprouts: [
    { name: "Clover Sprouts", freq: 7 },
    { name: "Radish Sprouts", freq: 7 },
    { name: "Broccoli Sprouts", freq: 5 },
  ],

  teas: {
    morning: {
      Mon: "Detox Green Tea",
      Tue: "Pure Energy Tea",
      Wed: "Pure Energy Tea",
      Thu: "Detox Green Tea",
      Fri: "Pure Energy Tea",
      Sat: "Detox Green Tea",
      Sun: "Detox Green Tea",
    },
    evening: {
      Mon: "Nervous System Tea",
      Tue: "Skeletal System Tea",
      Wed: "Nervous System Tea",
      Thu: "Skeletal System Tea",
      Fri: "Nervous System Tea",
      Sat: "Nervous System Tea",
      Sun: "Nervous System Tea",
    },
  },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ============================================
// JOURNAL (single-user, encouragement + clarity)
// ============================================
const JOURNAL_SYSTEMS = [
  {
    key: "digestive",
    title: "Digestive",
    prompts: [
      "Bloating / gas",
      "Stool regularity",
      "Stool comfort (no strain)",
      "Appetite + cravings",
      "Energy after meals",
    ],
  },
  {
    key: "immune_lymph",
    title: "Immune + Lymphatic",
    prompts: [
      "Swelling / puffiness",
      "Congestion / mucus",
      "Skin clarity",
      "Cold/flu feelings",
      "Tender lymph areas (neck/armpit/groin)",
    ],
  },
  {
    key: "reproductive",
    title: "Reproductive",
    prompts: [
      "Cycle symptoms (if relevant)",
      "Pelvic comfort",
      "Mood steadiness",
      "Sleep quality",
      "Stress response",
    ],
  },
  {
    key: "nervous",
    title: "Nervous System",
    prompts: [
      "Anxiety/overwhelm",
      "Focus + clarity",
      "Irritability",
      "Sleep onset",
      "Restfulness",
    ],
  },
  {
    key: "skeletal",
    title: "Skeletal System",
    prompts: [
      "Joint comfort",
      "Tension in body",
      "Back/neck stiffness",
      "Overall mobility",
    ],
  },
];

const COMMON_SIDE_EFFECTS = [
  "Headache",
  "Fatigue",
  "Irritability",
  "Skin changes",
  "Increased urination",
  "Loose stools",
  "Constipation",
  "Body odor changes",
  "Mucus release",
  "Vivid dreams",
  "Emotional release",
];

// ============================================
// UTILITIES
// ============================================
const formatTime = (date) =>
  date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

const addMinutes = (date, mins) => new Date(date.getTime() + mins * 60000);

const getDayKey = (date) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
const getDayName = (date) =>
  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function buildWeeklyUsage(weeklyPlan) {
  const counts = {};
  const add = (item) => {
    if (!item?.name) return;
    counts[item.name] = (counts[item.name] || 0) + 1;
  };

  for (const d of DAYS) {
    const day = weeklyPlan?.[d];
    if (!day) continue;

    (day.breakfast || []).forEach(add);

    (day.lunch?.carbs || []).forEach(add);
    (day.lunch?.greens || []).forEach(add);
    (day.lunch?.veggies || []).forEach(add);

    add(day.dinner?.protein);
    (day.dinner?.veggies || []).forEach(add);
  }

  return counts;
}

function remainingForItem(item, usageCounts) {
  // freq: null/undefined = unlimited
  if (item?.freq === null || item?.freq === undefined) return Infinity;
  const used = usageCounts[item.name] || 0;
  return item.freq - used;
}

function isExceeded(item, usageCounts) {
  const rem = remainingForItem(item, usageCounts);
  return Number.isFinite(rem) && rem <= 0;
}

// Fruit pairing rules (keeps your original logic)
function getValidFruits(selected) {
  const all = [
    ...PROTOCOL.fruits.melons,
    ...PROTOCOL.fruits.sweet,
    ...PROTOCOL.fruits.subAcid,
    ...PROTOCOL.fruits.acid,
  ];
  if (selected.length === 0) return all;
  if (selected.length >= 3) return [];
  if (selected.some((f) => f.cat === "melon")) return []; // melons are solo

  const hasSweet = selected.some((f) => f.cat === "sweet");
  const hasAcid = selected.some((f) => f.cat === "acid");

  let valid = PROTOCOL.fruits.subAcid.filter((f) => !selected.find((s) => s.name === f.name));
  if (!hasAcid) valid.push(...PROTOCOL.fruits.sweet.filter((f) => !selected.find((s) => s.name === f.name)));
  if (!hasSweet) valid.push(...PROTOCOL.fruits.acid.filter((f) => !selected.find((s) => s.name === f.name)));
  return valid;
}

// ============================================
// SCHEDULE (wake-time relative)
// ============================================
function generateSchedule(wakeTime) {
  const w = new Date(wakeTime);
  const day = getDayKey(w);

  return [
    {
      time: w,
      title: "AWAKENING",
      desc: "20 deep breaths. Affirmations: 'I am whole. My systems are restoring.'",
      icon: "sun",
      category: "morning",
      water: "start",
    },
    { time: addMinutes(w, 15), title: "Turn Kettle On", desc: "Prepare for morning tea", icon: "coffee", category: "morning" },
    { time: addMinutes(w, 15), title: "MOVEMENT", desc: "10–20 min intuitive movement. Stretch, spiral, flow.", icon: "sparkles", category: "morning" },
    { time: addMinutes(w, 30), title: "HYDRATION + CAPSULE", desc: "2 cups water + Digestive System Support capsule", icon: "droplets", category: "morning" },
    {
      time: addMinutes(w, 50),
      title: "MORNING TEA",
      desc: `${PROTOCOL.teas.morning[day]} — Steep 17–27 min. NO sweetener.`,
      icon: "coffee",
      category: "morning",
      water: "end",
    },
    { time: addMinutes(w, 100), title: "MELONS (if having)", desc: "Eat melons SOLO. Wait 20 min before other fruits.", icon: "apple", category: "breakfast", optional: true },
    { time: addMinutes(w, 120), title: "BREAKFAST", desc: "Max 3 fruits + Multivitamin. Chew 30–50x per bite.", icon: "apple", category: "breakfast" },
    { time: addMinutes(w, 210), title: "20 BREATHS", desc: "Deep diaphragmatic breathing", icon: "sparkles", category: "transition", water: "start" },
    { time: addMinutes(w, 320), title: "20 BREATHS", desc: "Pre-lunch breathing", icon: "sparkles", category: "transition" },
    { time: addMinutes(w, 340), title: "LUNCH CAPSULE", desc: "Immune & Lymphatic Support — 20 min before lunch", icon: "leaf", category: "lunch", water: "end" },
    { time: addMinutes(w, 360), title: "LUNCH", desc: "Complex carbs + vegetables ONLY. NO proteins/oils/vinegars.", icon: "salad", category: "lunch" },
    { time: addMinutes(w, 450), title: "20 BREATHS", desc: "Post-lunch breathing", icon: "sparkles", category: "transition", water: "start" },
    { time: addMinutes(w, 600), title: "20 BREATHS", desc: "Pre-dinner breathing", icon: "sparkles", category: "transition" },
    { time: addMinutes(w, 610), title: "DINNER CAPSULE", desc: "Reproductive System Support — 20 min before dinner", icon: "leaf", category: "dinner", water: "end" },
    { time: addMinutes(w, 630), title: "DINNER", desc: "Proteins + vegetables + Mineral Complex (2 caps). Oils/vinegars OK.", icon: "utensils", category: "dinner" },
    { time: addMinutes(w, 720), title: "20 BREATHS", desc: "Post-dinner breathing", icon: "sparkles", category: "transition", water: "start" },
    { time: addMinutes(w, 750), title: "EVENING TEA", desc: `${PROTOCOL.teas.evening[day]} — 2+ hours after dinner. NO sweetener.`, icon: "moon", category: "evening" },
    { time: addMinutes(w, 810), title: "WIND DOWN", desc: "Journaling, meditation, gentle stretching. 20 breaths.", icon: "heart", category: "evening" },
    { time: addMinutes(w, 840), title: "SLEEP", desc: "Honor the night as time for repair.", icon: "moon", category: "evening" },
  ];
}

// ============================================
// ICS EXPORT (daily + weekly)
// ============================================
function formatICSDate(d) {
  // Local time, floating (no Z) — easiest cross-calendar
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function escapeICS(text) {
  return String(text || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function generateICSForDay(schedule, dateKey) {
  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Divine Protocol//Wellness App//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Divine Protocol (${dateKey})
`;

  schedule.forEach((item, idx) => {
    const start = new Date(item.time);
    const end = addMinutes(start, 15);

    ics += `BEGIN:VEVENT
UID:divine-protocol-${dateKey}-${idx}@app
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:${escapeICS("🌿 " + item.title)}
DESCRIPTION:${escapeICS(item.desc)}
BEGIN:VALARM
TRIGGER:-PT5M
ACTION:DISPLAY
DESCRIPTION:${escapeICS(item.title)}
END:VALARM
END:VEVENT
`;
  });

  ics += "END:VCALENDAR";
  return ics;
}

function downloadTextFile(text, filename, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================
// ICON MAP
// ============================================
function IconMap({ name, size = 20, className = "" }) {
  const icons = {
    sun: Sun,
    moon: Moon,
    droplets: Droplets,
    clock: Clock,
    apple: Apple,
    salad: Salad,
    utensils: Utensils,
    sparkles: Sparkles,
    coffee: Coffee,
    leaf: Leaf,
    heart: Heart,
    calendar: Calendar,
  };
  const Icon = icons[name] || Sparkles;
  return <Icon size={size} className={className} />;
}

// ============================================
// AUTO-SUGGEST (strict rules, frequency-aware)
// ============================================
function pickOne(list, usageCounts) {
  const available = list.filter((x) => !isExceeded(x, usageCounts));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

function pickMany(list, countMin, countMax, usageCounts) {
  const target = Math.floor(Math.random() * (countMax - countMin + 1)) + countMin;
  const pool = list.filter((x) => !isExceeded(x, usageCounts));
  const result = [];
  for (const item of pool.sort(() => Math.random() - 0.5)) {
    if (result.length >= target) break;
    result.push(item);
  }
  return result;
}

function suggestDayPlan(dayKey, weeklyPlan, usageCounts) {
  // Breakfast: 1–3 fruits with pairing rules
  let breakfast = [];
  // 25% chance melon breakfast (solo)
  if (Math.random() < 0.25) {
    const melon = pickOne(PROTOCOL.fruits.melons, usageCounts);
    if (melon) breakfast = [melon];
  } else {
    const allNonMelon = [
      ...PROTOCOL.fruits.sweet,
      ...PROTOCOL.fruits.subAcid,
      ...PROTOCOL.fruits.acid,
    ];
    const first = pickOne(allNonMelon, usageCounts);
    if (first) {
      breakfast = [first];
      const valid2 = getValidFruits(breakfast).filter((f) => !isExceeded(f, usageCounts));
      if (valid2.length && Math.random() < 0.7) {
        breakfast.push(valid2[Math.floor(Math.random() * valid2.length)]);
      }
      const valid3 = getValidFruits(breakfast).filter((f) => !isExceeded(f, usageCounts));
      if (valid3.length && Math.random() < 0.4) {
        breakfast.push(valid3[Math.floor(Math.random() * valid3.length)]);
      }
    }
  }

  // Lunch: carbs + veggies (+ greens optional)
  const lunchCarb = pickMany(PROTOCOL.complexCarbs, 1, 2, usageCounts);
  const lunchGreens = Math.random() < 0.6 ? pickMany(PROTOCOL.greens, 1, 2, usageCounts) : [];
  const lunchVegPool = PROTOCOL.vegetables.filter((v) => (v.meals || []).includes("lunch"));
  const lunchVeg = pickMany(lunchVegPool, 1, 3, usageCounts);

  // Dinner: protein + veggies
  const protein = pickOne(PROTOCOL.proteins, usageCounts);
  const dinnerVegPool = PROTOCOL.vegetables.filter((v) => (v.meals || []).includes("dinner"));
  const dinnerVeg = pickMany(dinnerVegPool, 1, 3, usageCounts);

  return {
    breakfast,
    lunch: { carbs: lunchCarb, greens: lunchGreens, veggies: lunchVeg },
    dinner: { protein, veggies: dinnerVeg },
  };
}

// ============================================
// APP
// ============================================
export default function App() {
  const [view, setView] = useState("home");

  const [wakeTime, setWakeTime] = useState(() => {
    const saved = localStorage.getItem("dp_wakeTime");
    if (saved) return new Date(saved);
    const t = new Date();
    t.setHours(8, 0, 0, 0);
    return t;
  });

  const [schedule, setSchedule] = useState(() => generateSchedule(new Date()));
  const [now, setNow] = useState(new Date());

  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("dp_completed");
    return saved ? JSON.parse(saved) : {};
  });

  // Meal planning (single source of truth: weeklyPlan)
  const [weeklyPlan, setWeeklyPlan] = useState(() => {
    const saved = localStorage.getItem("dp_weeklyPlan");
    return saved ? JSON.parse(saved) : {};
  });

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem("dp_ratings");
    return saved ? JSON.parse(saved) : {};
  });

  const [activeMealTab, setActiveMealTab] = useState("breakfast");
  const [mealError, setMealError] = useState("");

  const [selectedBreakfast, setSelectedBreakfast] = useState([]);
  const [selectedLunch, setSelectedLunch] = useState({ carbs: [], greens: [], veggies: [] });
  const [selectedDinner, setSelectedDinner] = useState({ protein: null, veggies: [] });

  // Journal
  const [journal, setJournal] = useState(() => {
    const saved = localStorage.getItem("dp_journal");
    return saved ? JSON.parse(saved) : {};
  });

  const todayKey = now.toISOString().split("T")[0];
  const dayKey = getDayKey(now);

  // Derived: frequency usage for the whole week
  const usageCounts = useMemo(() => buildWeeklyUsage(weeklyPlan), [weeklyPlan]);

  // Tick
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(i);
  }, []);

  // Regenerate schedule on wakeTime changes
  useEffect(() => {
    const s = generateSchedule(wakeTime);
    setSchedule(s);
    localStorage.setItem("dp_wakeTime", wakeTime.toISOString());
  }, [wakeTime]);

  // Persist
  useEffect(() => localStorage.setItem("dp_completed", JSON.stringify(completed)), [completed]);
  useEffect(() => localStorage.setItem("dp_weeklyPlan", JSON.stringify(weeklyPlan)), [weeklyPlan]);
  useEffect(() => localStorage.setItem("dp_ratings", JSON.stringify(ratings)), [ratings]);
  useEffect(() => localStorage.setItem("dp_journal", JSON.stringify(journal)), [journal]);

  // Current schedule item
  const getCurrentItem = () => {
    for (let i = schedule.length - 1; i >= 0; i--) {
      if (schedule[i].time <= now) return { current: schedule[i], next: schedule[i + 1], index: i };
    }
    return { current: null, next: schedule[0], index: -1 };
  };
  const { current, next } = getCurrentItem();

  // Clock in (actual wake)
  const handleClockIn = () => {
    const newWake = new Date();
    setWakeTime(newWake);
    setCompleted({ date: todayKey }); // reset for today
  };

  const toggleTask = (idx) => {
    setCompleted((prev) => ({ ...prev, date: todayKey, [idx]: !prev[idx] }));
  };

  // Grocery list (from weeklyPlan)
  const generateGroceryList = () => {
    const items = new Map();
    const add = (name) => items.set(name, (items.get(name) || 0) + 1);

    Object.values(weeklyPlan).forEach((day) => {
      day?.breakfast?.forEach((f) => add(f.name));
      day?.lunch?.carbs?.forEach((c) => add(c.name));
      day?.lunch?.greens?.forEach((g) => add(g.name));
      day?.lunch?.veggies?.forEach((v) => add(v.name));
      if (day?.dinner?.protein) add(day.dinner.protein.name);
      day?.dinner?.veggies?.forEach((v) => add(v.name));
    });

    const essentials = ["Kombu", "Hemp Seeds", "Lemons", "Limes", "Cilantro", "Parsley", "Sea Salt"];
    essentials.forEach((e) => items.set(e, items.get(e) || 1));

    return Array.from(items.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  // ===== Meal selection helpers (frequency-aware) =====
  const usedCount = (item) => usageCounts[item?.name] || 0;
  const freqLabel = (item) => (item?.freq === null || item?.freq === undefined ? "∞" : item.freq);

  // ===== Save meal selections into weeklyPlan =====
  const saveToDay = (d) => {
    setMealError("");

    // Validate strict rules
    if (activeMealTab === "breakfast") {
      if (selectedBreakfast.length < 1) return setMealError("Pick at least 1 fruit for breakfast.");
      if (selectedBreakfast.length > 3) return setMealError("Breakfast can’t exceed 3 fruits.");
      const bad = selectedBreakfast.find((x) => isExceeded(x, usageCounts));
      if (bad) return setMealError(`${bad.name} is already at its weekly limit.`);
    }

    if (activeMealTab === "lunch") {
      if ((selectedLunch.carbs?.length || 0) < 1) return setMealError("Lunch must include at least 1 complex carb.");
      if ((selectedLunch.veggies?.length || 0) < 1) return setMealError("Lunch must include at least 1 vegetable.");
      const all = [...(selectedLunch.carbs || []), ...(selectedLunch.greens || []), ...(selectedLunch.veggies || [])];
      const bad = all.find((x) => isExceeded(x, usageCounts));
      if (bad) return setMealError(`${bad.name} is already at its weekly limit.`);
    }

    if (activeMealTab === "dinner") {
      if (!selectedDinner.protein) return setMealError("Dinner must include a protein (pick one).");
      if ((selectedDinner.veggies?.length || 0) < 1) return setMealError("Dinner must include at least 1 vegetable.");
      const all = [selectedDinner.protein, ...(selectedDinner.veggies || [])].filter(Boolean);
      const bad = all.find((x) => isExceeded(x, usageCounts));
      if (bad) return setMealError(`${bad.name} is already at its weekly limit.`);
    }

    setWeeklyPlan((prev) => ({
      ...prev,
      [d]: {
        ...prev?.[d],
        breakfast: activeMealTab === "breakfast" ? selectedBreakfast : prev?.[d]?.breakfast,
        lunch: activeMealTab === "lunch" ? selectedLunch : prev?.[d]?.lunch,
        dinner: activeMealTab === "dinner" ? selectedDinner : prev?.[d]?.dinner,
      },
    }));
  };

  const autoSuggestForDay = (d) => {
    // Build a temporary usage snapshot that includes current weeklyPlan
    const baseUsage = buildWeeklyUsage(weeklyPlan);
    const plan = suggestDayPlan(d, weeklyPlan, baseUsage);

    setWeeklyPlan((prev) => ({ ...prev, [d]: plan }));

    // Also preload UI selections so it feels responsive
    setSelectedBreakfast(plan.breakfast || []);
    setSelectedLunch(plan.lunch || { carbs: [], greens: [], veggies: [] });
    setSelectedDinner(plan.dinner || { protein: null, veggies: [] });
  };

  // ===== Calendar export =====
  const exportTodayICS = () => {
    const ics = generateICSForDay(schedule, todayKey);
    downloadTextFile(ics, `divine-protocol-${todayKey}.ics`, "text/calendar;charset=utf-8");
  };

  const exportWeekICS = () => {
    // Simple weekly export: repeats the *current* daily schedule across 7 days from today.
    // (Because true “clock-in daily” shifts times, this is best used as a baseline plan.)
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Divine Protocol//Wellness App//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Divine Protocol (7-Day)
`;

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const dayDate = new Date(start.getTime() + dayOffset * 86400000);
      const dateKey = dayDate.toISOString().split("T")[0];

      // Build “same relative schedule” using current wakeTime but applied to that day’s date
      const baseWake = new Date(dayDate);
      baseWake.setHours(wakeTime.getHours(), wakeTime.getMinutes(), 0, 0);
      const daySchedule = generateSchedule(baseWake);

      daySchedule.forEach((item, idx) => {
        const startTime = new Date(item.time);
        const endTime = addMinutes(startTime, 15);

        ics += `BEGIN:VEVENT
UID:divine-protocol-${dateKey}-${idx}@app
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startTime)}
DTEND:${formatICSDate(endTime)}
SUMMARY:${escapeICS("🌿 " + item.title)}
DESCRIPTION:${escapeICS(item.desc)}
BEGIN:VALARM
TRIGGER:-PT5M
ACTION:DISPLAY
DESCRIPTION:${escapeICS(item.title)}
END:VALARM
END:VEVENT
`;
      });
    }

    ics += "END:VCALENDAR";
    downloadTextFile(ics, `divine-protocol-7day-${todayKey}.ics`, "text/calendar;charset=utf-8");
  };

  // ============================================
  // VIEWS
  // ============================================

  const renderHome = () => (
    <div className="space-y-5">
      <div className="text-center py-8 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 right-4 w-24 h-24 bg-teal-300 rounded-full blur-2xl"></div>
        </div>
        <div className="relative">
          <div className="text-5xl mb-2">🌿</div>
          <h1 className="text-2xl font-light text-white tracking-widest">DIVINE PROTOCOL</h1>
          <p className="text-emerald-200 mt-1 text-sm font-medium">{getDayName(now)}</p>
          <p className="text-4xl font-extralight text-white mt-2 tracking-wide">{formatTime(now)}</p>
        </div>
      </div>

      <button
        onClick={handleClockIn}
        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-3 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
      >
        <Sun size={24} />
        <span>I'm Awake — Update My Day</span>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={exportTodayICS}
          className="py-3 bg-white border-2 border-emerald-500 text-emerald-700 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all"
        >
          <Download size={18} />
          <span>Today .ics</span>
        </button>
        <button
          onClick={exportWeekICS}
          className="py-3 bg-white border-2 border-teal-500 text-teal-700 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-teal-50 transition-all"
        >
          <FileDown size={18} />
          <span>7-Day .ics</span>
        </button>
      </div>

      {current && (
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-emerald-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs uppercase tracking-wider text-emerald-600 font-bold">Now</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <IconMap name={current.icon} size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{current.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{current.desc}</p>
            </div>
          </div>
        </div>
      )}

      {next && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
          <div className="text-xs uppercase tracking-wider text-emerald-600 mb-2 font-bold">
            Next at {formatTime(next.time)}
          </div>
          <div className="flex items-center gap-3">
            <IconMap name={next.icon} size={20} className="text-emerald-600" />
            <span className="font-semibold text-gray-700">{next.title}</span>
          </div>
        </div>
      )}

      <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-200">
        <div className="flex items-center gap-2 mb-2">
          <Droplets className="text-cyan-600" size={20} />
          <span className="font-bold text-cyan-800">Water Windows</span>
        </div>
        <div className="text-sm text-cyan-700 space-y-1">
          <p>• Drink water only during “💧 Water OK” windows</p>
          <p>• When you see “🚫 Stop water”, pause liquids until next window</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-700">Today's Progress</span>
          <span className="text-emerald-600 font-bold">
            {Object.values(completed).filter((v) => v === true).length} / {schedule.length}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
            style={{
              width: `${(Object.values(completed).filter((v) => v === true).length / schedule.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => {
    const completedCount = Object.values(completed).filter((v) => v === true).length;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-light text-gray-800">Today's Schedule</h2>
          <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-bold">
            {completedCount}/{schedule.length}
          </span>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-amber-800 font-bold text-sm">Wake Time</span>
              <p className="text-xs text-amber-600">All times adjust automatically</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWakeTime(addMinutes(wakeTime, -30))}
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-amber-100 transition"
              >
                <Minus size={16} />
              </button>
              <span className="w-24 text-center font-mono text-lg font-bold">{formatTime(wakeTime)}</span>
              <button
                onClick={() => setWakeTime(addMinutes(wakeTime, 30))}
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-amber-100 transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button
            onClick={handleClockIn}
            className="mt-3 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <Sun size={18} />
            <span>I’m Awake Now (Set Wake Time)</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={exportTodayICS}
            className="py-3 bg-emerald-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all"
          >
            <Download size={18} />
            <span>Today .ics</span>
          </button>
          <button
            onClick={exportWeekICS}
            className="py-3 bg-teal-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-teal-700 transition-all"
          >
            <FileDown size={18} />
            <span>7-Day .ics</span>
          </button>
        </div>

        <div className="space-y-2">
          {schedule.map((item, i) => {
            const isCurrent = current === item;
            const isPast = item.time < now && !isCurrent;
            const isDone = completed[i];

            return (
              <div
                key={i}
                onClick={() => toggleTask(i)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  isCurrent
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-[1.02]"
                    : isDone
                    ? "bg-emerald-50 border-2 border-emerald-300"
                    : isPast
                    ? "bg-gray-50 opacity-60 border border-gray-200"
                    : "bg-white border border-gray-100 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCurrent ? "bg-white/20" : isDone ? "bg-emerald-200" : "bg-gray-100"
                    }`}
                  >
                    {isDone ? (
                      <Check size={20} className="text-emerald-600" />
                    ) : (
                      <IconMap name={item.icon} size={18} className={isCurrent ? "text-white" : "text-gray-500"} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${isCurrent ? "text-white/80" : "text-gray-500"}`}>
                        {formatTime(item.time)}
                      </span>
                      {item.water === "start" && (
                        <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">💧 Water OK</span>
                      )}
                      {item.water === "end" && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🚫 Stop water</span>
                      )}
                    </div>
                    <h4 className={`font-bold ${isCurrent ? "text-white" : isDone ? "text-emerald-700" : "text-gray-800"}`}>
                      {item.title}
                    </h4>
                    <p className={`text-sm truncate ${isCurrent ? "text-white/80" : "text-gray-500"}`}>{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMealBuilder = () => {
    const validFruits = getValidFruits(selectedBreakfast).filter((f) => !isExceeded(f, usageCounts));

    const ruleSummary = {
      breakfast: "Breakfast = up to 3 fruits. Pairing rules apply. Frequency caps apply.",
      lunch: "Lunch = complex carbs + vegetables (+ greens optional). NO proteins/oils/vinegars/nuts/seeds at lunch.",
      dinner: "Dinner = 1 protein + vegetables. Oils/vinegars OK. Frequency caps apply.",
    };

    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-light text-gray-800">Build Your Meals</h2>
            <p className="text-sm text-gray-500 mt-1">Simple. Correct. Encouraging. Nothing extra.</p>
          </div>
          <button
            onClick={() => autoSuggestForDay(dayKey)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-700 transition flex items-center gap-2"
            title="Auto-suggest a strict protocol day plan"
          >
            <Sparkles size={16} />
            <span>Auto</span>
          </button>
        </div>

        <div className="bg-white/90 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-gray-800">Rules</div>
            <div className="text-xs text-gray-500">Caps enforced (items disable when maxed)</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{ruleSummary[activeMealTab]}</p>

          {mealError ? (
            <div className="mt-3 bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5" />
              <span>{mealError}</span>
            </div>
          ) : null}
        </div>

        <div className="flex gap-2">
          {["breakfast", "lunch", "dinner"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setMealError("");
                setActiveMealTab(tab);
              }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                activeMealTab === tab ? "bg-emerald-500 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* BREAKFAST */}
        {activeMealTab === "breakfast" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-3">Selected ({selectedBreakfast.length}/3)</h4>
              <div className="flex flex-wrap gap-2">
                {selectedBreakfast.map((fruit, i) => (
                  <div key={`${fruit.name}-${i}`} className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-2 rounded-full">
                    <span>{fruit.name}</span>
                    <span className="text-xs bg-emerald-200 px-2 py-0.5 rounded-full">{fruit.cat}</span>
                    <button onClick={() => setSelectedBreakfast((prev) => prev.filter((_, idx) => idx !== i))} className="hover:bg-emerald-200 rounded-full p-1">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {selectedBreakfast.length === 0 && <span className="text-gray-400">Select fruits below…</span>}
              </div>
            </div>

            {selectedBreakfast.length === 0 && (
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <h5 className="text-sm font-medium text-blue-700 mb-2">🍈 Melons (Eat Alone)</h5>
                <div className="flex flex-wrap gap-2">
                  {(PROTOCOL.fruits.melons || []).map((fruit) => {
                    const disabled = isExceeded(fruit, usageCounts);
                    return (
                      <button
                        key={fruit.name}
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return;
                          setMealError("");
                          setSelectedBreakfast([fruit]);
                        }}
                        className={
                          disabled
                            ? "px-3 py-2 bg-gray-100 text-gray-400 rounded-xl text-sm cursor-not-allowed opacity-60"
                            : "px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm hover:bg-blue-100 transition"
                        }
                        title={disabled ? `Maxed out: used ${usedCount(fruit)}/${freqLabel(fruit)}` : `Used ${usedCount(fruit)}/${freqLabel(fruit)}`}
                      >
                        {fruit.name} <span className="text-xs opacity-60">({usedCount(fruit)}/{freqLabel(fruit)})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h5 className="text-sm font-medium text-emerald-700 mb-2">🍓 Available Fruits</h5>
              <div className="flex flex-wrap gap-2">
                {validFruits.map((fruit) => {
                  const disabled = selectedBreakfast.length >= 3 || isExceeded(fruit, usageCounts);
                  return (
                    <button
                      key={fruit.name}
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) return;
                        setMealError("");
                        setSelectedBreakfast((prev) => [...prev, fruit]);
                      }}
                      className={
                        disabled
                          ? "px-3 py-2 bg-gray-100 text-gray-400 rounded-xl text-sm cursor-not-allowed opacity-60"
                          : "px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm hover:bg-emerald-100 transition"
                      }
                      title={disabled ? `Maxed out or full: ${usedCount(fruit)}/${freqLabel(fruit)}` : `Used ${usedCount(fruit)}/${freqLabel(fruit)}`}
                    >
                      {fruit.name} <span className="text-xs opacity-60">({usedCount(fruit)}/{freqLabel(fruit)})</span>
                    </button>
                  );
                })}
              </div>

              {selectedBreakfast.some((f) => f.cat === "melon") && (
                <div className="mt-3 bg-blue-100 text-blue-700 p-3 rounded-xl text-center">
                  🍈 Melon selected — eat alone, then wait 20 min
                </div>
              )}
              {selectedBreakfast.length >= 3 && (
                <div className="mt-3 bg-emerald-100 text-emerald-700 p-3 rounded-xl text-center">
                  ✓ Max 3 fruits selected
                </div>
              )}
            </div>
          </div>
        )}

        {/* LUNCH */}
        {activeMealTab === "lunch" && (
          <div className="space-y-4">
            <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
              <div className="flex items-center gap-2">
                <X size={16} className="text-red-600" />
                <span className="text-sm font-medium text-red-800">NO proteins, nuts, seeds, oils, or vinegars at lunch</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-3">Complex Carbs (pick 1+)</h4>
              <div className="flex flex-wrap gap-2">
                {PROTOCOL.complexCarbs.map((carb) => {
                  const selected = !!selectedLunch.carbs.find((c) => c.name === carb.name);
                  const disabled = !selected && isExceeded(carb, usageCounts);
                  return (
                    <button
                      key={carb.name}
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) return;
                        setMealError("");
                        setSelectedLunch((prev) => ({
                          ...prev,
                          carbs: selected ? prev.carbs.filter((c) => c.name !== carb.name) : [...prev.carbs, carb],
                        }));
                      }}
                      className={
                        disabled
                          ? "px-3 py-2 rounded-xl text-sm bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                          : selected
                          ? "px-3 py-2 rounded-xl text-sm bg-emerald-500 text-white"
                          : "px-3 py-2 rounded-xl text-sm bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
                      }
                    >
                      {carb.name} <span className="text-xs opacity-60">({usedCount(carb)}/{freqLabel(carb)})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-3">Leafy Greens (optional)</h4>
              <div className="flex flex-wrap gap-2">
                {PROTOCOL.greens.map((green) => {
                  const selected = !!selectedLunch.greens.find((g) => g.name === green.name);
                  const disabled = !selected && isExceeded(green, usageCounts);
                  return (
                    <button
                      key={green.name}
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) return;
                        setMealError("");
                        setSelectedLunch((prev) => ({
                          ...prev,
                          greens: selected ? prev.greens.filter((g) => g.name !== green.name) : [...prev.greens, green],
                        }));
                      }}
                      className={
                        disabled
                          ? "px-3 py-2 rounded-xl text-sm bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                          : selected
                          ? "px-3 py-2 rounded-xl text-sm bg-emerald-500 text-white"
                          : "px-3 py-2 rounded-xl text-sm bg-green-50 text-green-700 hover:bg-green-100 transition"
                      }
                    >
                      {green.name} <span className="text-xs opacity-60">({usedCount(green)}/{freqLabel(green)})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-3">Vegetables (pick 1+)</h4>
              <div className="flex flex-wrap gap-2">
                {PROTOCOL.vegetables
                  .filter((v) => (v.meals || []).includes("lunch"))
                  .map((veg) => {
                    const selected = !!selectedLunch.veggies.find((v) => v.name === veg.name);
                    const disabled = !selected && isExceeded(veg, usageCounts);
                    return (
                      <button
                        key={veg.name}
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return;
                          setMealError("");
                          setSelectedLunch((prev) => ({
                            ...prev,
                            veggies: selected ? prev.veggies.filter((v) => v.name !== veg.name) : [...prev.veggies, veg],
                          }));
                        }}
                        className={
                          disabled
                            ? "px-3 py-2 rounded-xl text-sm bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                            : selected
                            ? "px-3 py-2 rounded-xl text-sm bg-emerald-500 text-white"
                            : "px-3 py-2 rounded-xl text-sm bg-teal-50 text-teal-700 hover:bg-teal-100 transition"
                        }
                      >
                        {veg.name} <span className="text-xs opacity-60">({usedCount(veg)}/{freqLabel(veg)})</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* DINNER */}
        {activeMealTab === "dinner" && (
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">Proteins, oils, and vinegars ARE allowed at dinner</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-3">Plant Protein (pick one)</h4>
              <div className="flex flex-wrap gap-2">
                {PROTOCOL.proteins.map((protein) => {
                  const selected = selectedDinner.protein?.name === protein.name;
                  const disabled = !selected && isExceeded(protein, usageCounts);
                  return (
                    <button
                      key={protein.name}
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) return;
                        setMealError("");
                        setSelectedDinner((prev) => ({ ...prev, protein: selected ? null : protein }));
                      }}
                      className={
                        disabled
                          ? "px-3 py-2 rounded-xl text-sm bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                          : selected
                          ? "px-3 py-2 rounded-xl text-sm bg-emerald-500 text-white"
                          : "px-3 py-2 rounded-xl text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                      }
                    >
                      {protein.name} <span className="text-xs opacity-60">({usedCount(protein)}/{freqLabel(protein)})</span>
                    </button>
                  );
                })}
              </div>

              {selectedDinner.protein && (
                <div className="mt-3 p-3 bg-purple-50 rounded-xl text-sm text-purple-700">
                  <strong>{selectedDinner.protein.name}:</strong> Soak {selectedDinner.protein.soak ?? "—"}h, cook{" "}
                  {selectedDinner.protein.cook ?? "—"} min (with kombu)
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-3">Vegetables (pick 1+)</h4>
              <div className="flex flex-wrap gap-2">
                {PROTOCOL.vegetables
                  .filter((v) => (v.meals || []).includes("dinner"))
                  .map((veg) => {
                    const selected = !!selectedDinner.veggies.find((v) => v.name === veg.name);
                    const disabled = !selected && isExceeded(veg, usageCounts);
                    return (
                      <button
                        key={veg.name}
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return;
                          setMealError("");
                          setSelectedDinner((prev) => ({
                            ...prev,
                            veggies: selected ? prev.veggies.filter((v) => v.name !== veg.name) : [...prev.veggies, veg],
                          }));
                        }}
                        className={
                          disabled
                            ? "px-3 py-2 rounded-xl text-sm bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                            : selected
                            ? "px-3 py-2 rounded-xl text-sm bg-emerald-500 text-white"
                            : "px-3 py-2 rounded-xl text-sm bg-teal-50 text-teal-700 hover:bg-teal-100 transition"
                        }
                      >
                        {veg.name} <span className="text-xs opacity-60">({usedCount(veg)}/{freqLabel(veg)})</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">Save to Day</h4>
            <button
              onClick={() => autoSuggestForDay(dayKey)}
              className="text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full hover:bg-emerald-100 transition flex items-center gap-2"
            >
              <RefreshCw size={14} />
              <span>Auto for {dayKey}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <div key={d} className="flex gap-2">
                <button onClick={() => saveToDay(d)} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition">
                  {d}
                </button>
                <button
                  onClick={() => autoSuggestForDay(d)}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition"
                  title="Auto-suggest for this day"
                >
                  <Sparkles size={16} />
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Tip: If an item hits its weekly frequency cap, it disables automatically — you’ll never “accidentally” break the protocol.
          </p>
        </div>
      </div>
    );
  };

  const renderWeekly = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light text-gray-800">Weekly Plan</h2>
        <button onClick={() => setWeeklyPlan({})} className="text-sm text-red-600 hover:text-red-700 flex items-center gap-2">
          <Trash2 size={16} />
          <span>Clear All</span>
        </button>
      </div>

      {DAYS.map((d) => {
        const plan = weeklyPlan[d] || {};
        const rating = ratings[d] || 0;

        const lunchLine = [
          ...(plan.lunch?.greens?.map((g) => g.name) || []),
          ...(plan.lunch?.carbs?.map((c) => c.name) || []),
          ...(plan.lunch?.veggies?.map((v) => v.name) || []),
        ].filter(Boolean);

        const dinnerLine = [
          plan.dinner?.protein?.name,
          ...(plan.dinner?.veggies?.map((v) => v.name) || []),
        ].filter(Boolean);

        return (
          <div key={d} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-white text-lg">{d}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRatings((p) => ({ ...p, [d]: s }))} className="transition hover:scale-110">
                    <Star size={18} className={rating >= s ? "text-yellow-300 fill-yellow-300" : "text-white/40"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Apple size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-gray-500 font-medium">BREAKFAST</span>
                  <p className="text-sm text-gray-700">
                    {plan.breakfast?.length ? plan.breakfast.map((f) => f.name).join(" + ") : <span className="text-gray-400">Not planned</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Salad size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-gray-500 font-medium">LUNCH</span>
                  <p className="text-sm text-gray-700">
                    {lunchLine.length ? lunchLine.join(", ") : <span className="text-gray-400">Not planned</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Utensils size={18} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-gray-500 font-medium">DINNER</span>
                  <p className="text-sm text-gray-700">
                    {dinnerLine.length ? dinnerLine.join(", ") : <span className="text-gray-400">Not planned</span>}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button onClick={() => autoSuggestForDay(d)} className="flex-1 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  <span>Auto Suggest</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedBreakfast(plan.breakfast || []);
                    setSelectedLunch(plan.lunch || { carbs: [], greens: [], veggies: [] });
                    setSelectedDinner(plan.dinner || { protein: null, veggies: [] });
                    setView("meals");
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                  title="Edit this day in Meal Builder"
                >
                  <Settings size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderGrocery = () => {
    const groceryList = generateGroceryList();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-gray-800">Grocery List</h2>
          <span className="text-sm text-gray-500">{groceryList.length} items</span>
        </div>

        {groceryList.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-400">Plan meals first to generate a grocery list</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {groceryList.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">×{item.count}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-3">📋 Don’t Forget</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Herbal Tea blends (check supply)</li>
                <li>• Digestive System Support capsules</li>
                <li>• Immune & Lymphatic Support capsules</li>
                <li>• Reproductive System Support capsules</li>
                <li>• Multivitamin tablets</li>
                <li>• Mineral Complex capsules</li>
              </ul>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderJournal = () => {
    const entry = journal?.[todayKey] || { gratitude: "", notes: "", sideEffects: {}, systems: {} };

    const setEntry = (patch) => {
      setJournal((prev) => ({
        ...prev,
        [todayKey]: {
          ...entry,
          ...patch,
        },
      }));
    };

    const setSystemScore = (sysKey, prompt, value) => {
      const systems = entry.systems || {};
      const sys = systems[sysKey] || {};
      setEntry({
        systems: {
          ...systems,
          [sysKey]: {
            ...sys,
            [prompt]: value,
          },
        },
      });
    };

    const toggleSideEffect = (name) => {
      const side = entry.sideEffects || {};
      setEntry({ sideEffects: { ...side, [name]: !side[name] } });
    };

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 rounded-3xl p-5 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-wide">Weekly Journal</h2>
              <p className="text-emerald-200 text-sm mt-1">{getDayName(now)} • {todayKey}</p>
            </div>
            <Heart className="text-white/80" />
          </div>
          <p className="text-sm text-white/80 mt-4">
            This is not about perfection. It’s about noticing progress — and honoring your body’s work.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">Gratitude (1–2 sentences)</h3>
          <textarea
            value={entry.gratitude}
            onChange={(e) => setEntry({ gratitude: e.target.value })}
            placeholder="Today I’m grateful for…"
            className="w-full min-h-[80px] p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">Common Cleansing Signals</h3>
          <p className="text-sm text-gray-500 mb-3">
            Check anything you experienced (even mildly). This helps the app read your trend over time.
          </p>

          <div className="flex flex-wrap gap-2">
            {COMMON_SIDE_EFFECTS.map((s) => {
              const on = !!entry.sideEffects?.[s];
              return (
                <button
                  key={s}
                  onClick={() => toggleSideEffect(s)}
                  className={`px-3 py-2 rounded-xl text-sm transition ${
                    on ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {on ? "✓ " : ""}{s}
                </button>
              );
            })}
          </div>
        </div>

        {JOURNAL_SYSTEMS.map((sys) => (
          <div key={sys.key} className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">{sys.title}</h3>
              <span className="text-xs text-gray-500">0 = rough • 5 = ok • 10 = amazing</span>
            </div>

            <div className="mt-3 space-y-3">
              {sys.prompts.map((p) => {
                const value = entry.systems?.[sys.key]?.[p] ?? 5;
                return (
                  <div key={p}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{p}</span>
                      <span className="text-sm font-semibold text-emerald-700">{value}/10</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={value}
                      onChange={(e) => setSystemScore(sys.key, p, Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">Notes (what worked / what felt hard)</h3>
          <textarea
            value={entry.notes}
            onChange={(e) => setEntry({ notes: e.target.value })}
            placeholder="What helped you stay consistent? What got confusing? What do you want tomorrow to feel like?"
            className="w-full min-h-[120px] p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-emerald-800">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5" />
            <div>
              <p className="font-semibold">Encouragement</p>
              <p className="text-sm mt-1">
                You don’t need to “try harder.” You need a system that feels gentle. If today felt heavy, we simplify tomorrow.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-emerald-50/50 to-teal-50/50">
      <div className="max-w-lg mx-auto px-4 pb-28 pt-6">
        {view === "home" && renderHome()}
        {view === "schedule" && renderSchedule()}
        {view === "meals" && renderMealBuilder()}
        {view === "weekly" && renderWeekly()}
        {view === "grocery" && renderGrocery()}
        {view === "journal" && renderJournal()}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 py-2 pb-safe">
        <div className="max-w-lg mx-auto flex justify-around">
          {[
            { id: "home", icon: Home, label: "Today" },
            { id: "schedule", icon: Clock, label: "Schedule" },
            { id: "meals", icon: ChefHat, label: "Build" },
            { id: "weekly", icon: Calendar, label: "Week" },
            { id: "grocery", icon: ShoppingCart, label: "Grocery" },
            { id: "journal", icon: Heart, label: "Journal" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all ${
                view === id ? "bg-emerald-100 text-emerald-700" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={22} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
