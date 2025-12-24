import RecipesView from "./views/RecipesView";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Sun, Moon, Droplets, Clock, Calendar, ChefHat, ShoppingCart,
  Check, X, Plus, Minus, Home, Utensils, Apple, Salad, Sparkles,
  AlertCircle, Download, Star, Leaf, Heart, Image as ImageIcon, BookOpen, Pencil, Timer
} from "lucide-react";

import {BUILT_IN_RECIPES, RECIPE_GROUPS} from "../data/recipeData";


// ============================================
// PROTOCOL DATA (foods unchanged; keep yours)
// ============================================
const PROTOCOL = {
  fruits: {
    melons: [
      { name: "Honeydew Melon", freq: 7, cat: "melon" },
      { name: "Cantaloupe", freq: 7, cat: "melon" }
    ],
    sweet: [
      { name: "Papaya", freq: 7, cat: "sweet" },
      { name: "Date Fruit", freq: 5, cat: "sweet" },
      { name: "Figs", freq: 5, cat: "sweet" },
      { name: "Grapes", freq: 1, cat: "sweet" }
    ],
    subAcid: [
      { name: "Apricots", freq: 7, cat: "sub-acid" },
      { name: "Wild Blueberries", freq: 7, cat: "sub-acid" },
      { name: "Mango", freq: 5, cat: "sub-acid" },
      { name: "Blueberries", freq: 2, cat: "sub-acid" }
    ],
    acid: [
      { name: "Lemon", freq: 7, cat: "acid" },
      { name: "Lime", freq: 7, cat: "acid" },
      { name: "Orange", freq: 2, cat: "acid" },
      { name: "Pineapple", freq: 2, cat: "acid" },
      { name: "Pomegranate", freq: 2, cat: "acid" }
    ]
  },

  complexCarbs: [
    { name: "Quinoa", freq: 7 },
    { name: "Sweet Potato", freq: 7 },
    { name: "Buckwheat", freq: null },
    { name: "Red Potato", freq: null },
    { name: "White Potato", freq: null }
  ],

  greens: [
    { name: "Microgreens", freq: 7 },
    { name: "Romaine Lettuce", freq: 4 },
    { name: "Iceberg Lettuce", freq: 3 },
    { name: "Napa Cabbage", freq: 3 },
    { name: "Spinach", freq: null },
    { name: "Turnip Greens", freq: null }
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
    { name: "Pumpkin", freq: null, meals: ["lunch", "dinner"] }
  ],

  proteins: [
    { name: "Chickpeas", freq: 5, soak: 14, cook: 65 },
    { name: "Lentils", freq: 4, soak: 6, cook: 35 },
    { name: "Azuki Beans", freq: 2, soak: 8, cook: 40 },
    { name: "Black Beans", freq: 2, soak: 12, cook: 60 },
    { name: "Pinto Beans", freq: 1, soak: 10, cook: 50 },
    { name: "Lima Beans", freq: null, soak: 8, cook: 40 },
    { name: "Sprouted Tofu", freq: null, soak: 0, cook: 15 }
  ],

  seeds: [
    { name: "Hemp Seeds", freq: 7 },
    { name: "Sesame Seeds", freq: null },
    { name: "Pumpkin Seeds", freq: null },
    { name: "Flax Seeds", freq: null },
    { name: "Walnuts", freq: 1 }
  ],

  sprouts: [
    { name: "Clover Sprouts", freq: 7 },
    { name: "Radish Sprouts", freq: 7 },
    { name: "Broccoli Sprouts", freq: 5 }
  ],

  teas: {
    morning: {
      Mon: "Detox Green Tea", Tue: "Pure Energy Tea", Wed: "Pure Energy Tea",
      Thu: "Detox Green Tea", Fri: "Pure Energy Tea", Sat: "Detox Green Tea", Sun: "Detox Green Tea"
    },
    evening: {
      Mon: "Nervous System Tea", Tue: "Skeletal System Tea", Wed: "Nervous System Tea",
      Thu: "Skeletal System Tea", Fri: "Nervous System Tea", Sat: "Nervous System Tea", Sun: "Nervous System Tea"
    }
  }
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ============================================
// TIME / DATE UTILS
// ============================================
const formatTime = (date) =>
  date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

const addMinutes = (date, mins) => new Date(date.getTime() + mins * 60000);

const getDayKey = (date) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
const getDayName = (date) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
const dateKey = (date) => date.toISOString().split("T")[0];

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

// ============================================
// FRUIT RULES
// ============================================
const getAllFruits = () => [
  ...PROTOCOL.fruits.melons,
  ...PROTOCOL.fruits.sweet,
  ...PROTOCOL.fruits.subAcid,
  ...PROTOCOL.fruits.acid
];

const getValidFruits = (selected) => {
  const all = getAllFruits();
  if (selected.length === 0) return all;
  if (selected.length >= 3) return [];
  if (selected.some((f) => f.cat === "melon")) return []; // melons alone

  const hasSweet = selected.some((f) => f.cat === "sweet");
  const hasAcid = selected.some((f) => f.cat === "acid");

  let valid = PROTOCOL.fruits.subAcid.filter((f) => !selected.find((s) => s.name === f.name));
  if (!hasAcid) valid.push(...PROTOCOL.fruits.sweet.filter((f) => !selected.find((s) => s.name === f.name)));
  if (!hasSweet) valid.push(...PROTOCOL.fruits.acid.filter((f) => !selected.find((s) => s.name === f.name)));
  return valid;
};

// ============================================
// FREQUENCY TRACKING (meals + snacks/juices)
// ============================================
function buildWeeklyUsage(weeklyPlan, snackLogsByDate) {
  const counts = {}; // { [itemName]: number }

  const add = (item) => {
    if (!item?.name) return;
    counts[item.name] = (counts[item.name] || 0) + 1;
  };

  // planned foods
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

  // snacks/juices (fruit ingredients)
  // snackLogsByDate: { "YYYY-MM-DD": [{type, fruits:[{name..}], timeISO, ...}] }
  if (snackLogsByDate) {
    Object.values(snackLogsByDate).forEach((logs) => {
      (logs || []).forEach((log) => {
        (log?.fruits || []).forEach(add);
      });
    });
  }

  return counts;
}

function remainingForItem(item, usageCounts) {
  // freq null/undefined => unlimited
  if (item?.freq == null) return Infinity;
  const used = usageCounts[item.name] || 0;
  return item.freq - used;
}

function isExceeded(item, usageCounts) {
  const rem = remainingForItem(item, usageCounts);
  return Number.isFinite(rem) && rem <= 0;
}

// ============================================
// SCHEDULE GENERATION (with meal-time overrides)
// Also includes “Start by … / Done by …” guidance for tea windows.
// ============================================
function generateSchedule(wakeTime, mealTimeOverrides, dayKey) {
  const w = new Date(wakeTime);

  // baseline timings (your original)
  const defaultBreakfast = addMinutes(w, 120);
  const defaultLunch = addMinutes(w, 360);
  const defaultDinner = addMinutes(w, 630);

  const breakfastTime = mealTimeOverrides?.breakfast ? new Date(mealTimeOverrides.breakfast) : defaultBreakfast;
  const lunchTime = mealTimeOverrides?.lunch ? new Date(mealTimeOverrides.lunch) : defaultLunch;
  const dinnerTime = mealTimeOverrides?.dinner ? new Date(mealTimeOverrides.dinner) : defaultDinner;

  // Tea rule: “done by 8:50” style.
  // We’ll interpret morning tea: steep 17–27 min, and must be DONE by (wake+50min).
  const morningTeaDoneBy = addMinutes(w, 50);
  const morningTeaStartBy = addMinutes(morningTeaDoneBy, -27);

  const eveningTeaAt = addMinutes(dinnerTime, 120); // 2+ hours after dinner baseline

  const items = [
    {
      time: w,
      title: "AWAKENING",
      desc: "20 deep breaths. Affirmations: “I am whole. My systems are restoring.”",
      icon: "sun",
      category: "morning",
      detail: [
        "• Sit up slowly.",
        "• 20 deep breaths (slow + diaphragmatic).",
        "• Say affirmations out loud.",
      ],
      water: "start",
    },
    {
      time: addMinutes(w, 15),
      title: "Turn Kettle On",
      desc: "Prepare for morning tea.",
      icon: "sparkles",
      category: "morning",
      detail: ["• Turn kettle on.", "• Set up tea + timer."],
    },
    {
      time: addMinutes(w, 15),
      title: "MOVEMENT",
      desc: "10–20 min intuitive movement. Stretch, spiral, flow.",
      icon: "sparkles",
      category: "morning",
      detail: [
        "• Set a timer (10–20 min).",
        "• Gentle movement: stretch / spiral / walk / mobility.",
        "• Goal: circulation + nervous system calm.",
      ],
    },
    {
      time: addMinutes(w, 30),
      title: "HYDRATION + CAPSULE",
      desc: "2 cups water + Digestive System Support capsule.",
      icon: "droplets",
      category: "morning",
      detail: ["• Drink 2 cups water.", "• Take Digestive System Support capsule."],
    },

    // Morning tea guidance uses start-by / done-by
    {
      time: morningTeaDoneBy,
      title: "MORNING TEA (DONE BY)",
      desc: `${PROTOCOL.teas.morning[dayKey]} — Start steeping by ${formatTime(morningTeaStartBy)} so you’re finished by ${formatTime(morningTeaDoneBy)}. NO sweetener.`,
      icon: "moon",
      category: "morning",
      detail: [
        `• Tea: ${PROTOCOL.teas.morning[dayKey]}`,
        "• Steep 17–27 minutes.",
        `• Start by: ${formatTime(morningTeaStartBy)}`,
        `• Done by: ${formatTime(morningTeaDoneBy)}`,
        "• No sweeteners.",
      ],
      water: "end",
    },

    {
      time: addMinutes(w, 100),
      title: "MELONS (optional)",
      desc: "Eat melons SOLO. Wait 20 min before other fruits.",
      icon: "apple",
      category: "breakfast",
      optional: true,
      detail: [
        "• Melons must be eaten alone.",
        "• After melon, wait 20 minutes before other fruits.",
      ],
    },

    {
      time: breakfastTime,
      title: "BREAKFAST",
      desc: "Max 3 fruits + Multivitamin. Chew 30–50x per bite.",
      icon: "apple",
      category: "breakfast",
      detail: [
        "• Choose up to 3 fruits (pairing rules apply).",
        "• Take multivitamin with breakfast (if protocol specifies).",
        "• Chew thoroughly (30–50x).",
      ],
    },

    {
      time: addMinutes(lunchTime, -40),
      title: "20 BREATHS",
      desc: "Pre-lunch breathing.",
      icon: "sparkles",
      category: "transition",
      detail: ["• 20 slow intentional breaths before lunch."],
      water: "start",
    },
    {
      time: addMinutes(lunchTime, -20),
      title: "LUNCH CAPSULE",
      desc: "Immune & Lymphatic Support — 20 min before lunch.",
      icon: "leaf",
      category: "lunch",
      detail: ["• Take Immune & Lymphatic Support capsule.", "• Wait 20 minutes before eating."],
      water: "end",
    },
    {
      time: lunchTime,
      title: "LUNCH",
      desc: "Complex carbs + vegetables ONLY. NO proteins/oils/vinegars.",
      icon: "salad",
      category: "lunch",
      detail: [
        "• Lunch = complex carbs + vegetables (+ greens optional).",
        "• No proteins, oils, vinegars, nuts, seeds at lunch.",
      ],
    },

    {
      time: addMinutes(dinnerTime, -40),
      title: "20 BREATHS",
      desc: "Pre-dinner breathing.",
      icon: "sparkles",
      category: "transition",
      detail: ["• 20 slow intentional breaths before dinner."],
      water: "start",
    },
    {
      time: addMinutes(dinnerTime, -20),
      title: "DINNER CAPSULE",
      desc: "Reproductive System Support — 20 min before dinner.",
      icon: "leaf",
      category: "dinner",
      detail: ["• Take Reproductive System Support capsule.", "• Wait 20 minutes before eating."],
      water: "end",
    },
    {
      time: dinnerTime,
      title: "DINNER",
      desc: "Proteins + vegetables + Mineral Complex (2 caps). Oils/vinegars OK.",
      icon: "utensils",
      category: "dinner",
      detail: [
        "• Dinner = protein + vegetables.",
        "• Oils/vinegars allowed at dinner.",
        "• Take Mineral Complex (2 caps) if specified.",
      ],
    },

    {
      time: eveningTeaAt,
      title: "EVENING TEA",
      desc: `${PROTOCOL.teas.evening[dayKey]} — 2+ hours after dinner. NO sweetener.`,
      icon: "moon",
      category: "evening",
      detail: [
        `• Tea: ${PROTOCOL.teas.evening[dayKey]}`,
        "• Must be 2+ hours after dinner.",
        "• No sweeteners.",
      ],
      water: "start",
    },
    {
      time: addMinutes(eveningTeaAt, 30),
      title: "WIND DOWN",
      desc: "Journaling, meditation, gentle stretching. 20 breaths.",
      icon: "heart",
      category: "evening",
      detail: ["• Journal or meditate.", "• Gentle stretching.", "• 20 breaths."],
    },
    {
      time: addMinutes(eveningTeaAt, 60),
      title: "SLEEP",
      desc: "Honor the night as time for repair.",
      icon: "moon",
      category: "evening",
      detail: ["• Sleep window.", "• Let the body repair."],
    }
  ];

  // keep in chronological order
  items.sort((a, b) => a.time - b.time);
  return items;
}

// ============================================
// ICS EXPORT (updated schedule reflects wake + any shifts)
// ============================================
const generateICS = (schedule, dateStr) => {
  const formatICSDate = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Divine Protocol//Wellness App//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Divine Protocol
X-WR-TIMEZONE:America/New_York
`;

  schedule.forEach((item, idx) => {
    const startTime = new Date(item.time);
    const endTime = addMinutes(startTime, 15);
    const alarmTime = 5;

    const safeDesc = String(item.desc || "").replace(/,/g, "\\,");

    ics += `BEGIN:VEVENT
UID:divine-protocol-${dateStr}-${idx}@app
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startTime)}
DTEND:${formatICSDate(endTime)}
SUMMARY:🌿 ${item.title}
DESCRIPTION:${safeDesc}
BEGIN:VALARM
TRIGGER:-PT${alarmTime}M
ACTION:DISPLAY
DESCRIPTION:${item.title} in ${alarmTime} minutes
END:VALARM
END:VEVENT
`;
  });

  ics += "END:VCALENDAR";
  return ics;
};

const downloadICS = (schedule, dateStr) => {
  const ics = generateICS(schedule, dateStr);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `divine-protocol-${dateStr}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ============================================
// ICON MAP (coffee emoji is not a food category)
// ============================================
const IconMap = ({ name, size = 20, className = "" }) => {
  const icons = {
    sun: Sun,
    moon: Moon,
    droplets: Droplets,
    clock: Clock,
    apple: Apple,
    salad: Salad,
    utensils: Utensils,
    sparkles: Sparkles,
    leaf: Leaf,
    heart: Heart,
    calendar: Calendar
  };
  const Icon = icons[name] || Sparkles;
  return <Icon size={size} className={className} />;
};

// ============================================
// RECIPE HELPERS
// ============================================
const getRecipeById = (id, builtIn, custom) =>
  builtIn.find((r) => r.id === id) || custom.find((r) => r.id === id) || null;

const groupRecipesForUI = (allRecipes) => {
  // OPTIONAL: if you still need “by category”
  const byCat = {};
  allRecipes.forEach((r) => {
    const cat = r.categoryLabel || r.categoryId || "Other";
    (byCat[cat] ||= []).push(r);
  });

  // ✅ correct: group by groupId
  const byGroup = {};
  allRecipes.forEach((r) => {
    const gid = r.groupId || "foods";
    (byGroup[gid] ||= []).push(r);
  });

  // ✅ return UI groups in the shape your UI expects
  return RECIPE_GROUPS.map((g) => ({
    ...g,
    recipes: byGroup[g.id] || [],
  }));
};

const makeId = () => `custom-${Math.random().toString(16).slice(2)}-${Date.now()}`;

// Very lightweight “paste-to-format” helper for photo uploads:
// Splits lines into ingredients until it hits something that looks like “1.” “Step” etc.
function parsePastedRecipeText(text) {
  const lines = String(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const ingredients = [];
  const steps = [];

  let inSteps = false;
  for (const line of lines) {
    if (/^(step\s*)?\d+[\.\)]\s*/i.test(line)) inSteps = true;
    if (!inSteps) ingredients.push(line);
    else steps.push(line);
  }
  return { ingredients, steps };
}

// ============================================
// MAIN APP
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

  const [mealTimeOverrides, setMealTimeOverrides] = useState(() => {
    const saved = localStorage.getItem("dp_mealTimeOverrides");
    return saved ? JSON.parse(saved) : {};
  });

  const [schedule, setSchedule] = useState([]);

  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("dp_completed");
    return saved ? JSON.parse(saved) : {};
  });

  const [now, setNow] = useState(new Date());

  // Weekly meal plan (foods) + recipe assignments
  // We'll store recipe ids like:
  // weeklyPlan[Mon].recipeRefs = { lunch: "someRecipeId", dinner:"..." }
  const [weeklyPlan, setWeeklyPlan] = useState(() => {
    const saved = localStorage.getItem("dp_weeklyPlan");
    return saved ? JSON.parse(saved) : {};
  });

  // snack/juice logs by date
  const [snackLogs, setSnackLogs] = useState(() => {
    const saved = localStorage.getItem("dp_snackLogs");
    return saved ? JSON.parse(saved) : {};
  });

  // ratings/notes by recipe id
  const [recipeFeedback, setRecipeFeedback] = useState(() => {
    const saved = localStorage.getItem("dp_recipeFeedback");
    return saved ? JSON.parse(saved) : {};
  });

  // custom recipes
  const [customRecipes, setCustomRecipes] = useState(() => {
    const saved = localStorage.getItem("dp_customRecipes");
    return saved ? JSON.parse(saved) : [];
  });

  // UI: schedule detail modal
  const [scheduleDetail, setScheduleDetail] = useState(null);

  // UI: recipes
  const [recipeTab, setRecipeTab] = useState("Foods"); // Foods | Juices | Infused Waters | Custom
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [recipeAssignOpen, setRecipeAssignOpen] = useState(false);
  const [assignDay, setAssignDay] = useState("Mon");
  const [assignMeal, setAssignMeal] = useState("lunch"); // lunch | dinner
  const [weeklyRecipeOpen, setWeeklyRecipeOpen] = useState(null); // {id, day, meal}

  // UI: custom recipe creator
  const [customDraft, setCustomDraft] = useState({
    id: "",
    name: "",
    category: "Custom",
    servings: "",
    prepTime: "",
    cookTime: "",
    ingredientsText: "",
    stepsText: "",
    photoDataUrl: "",
    pastedText: ""
  });

  // UI: juice/snack logger
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackType, setSnackType] = useState("juice"); // juice | snackFruit
  const [snackSelectedFruits, setSnackSelectedFruits] = useState([]);
  const [snackError, setSnackError] = useState("");
  const [snackTime, setSnackTime] = useState(() => new Date());

  // Mind/Body
  const [breathOpen, setBreathOpen] = useState(false);
  const [breathCount, setBreathCount] = useState(6); // 6-sec inhale / 6-sec exhale baseline
  const breathTimerRef = useRef(null);
  const [breathPhase, setBreathPhase] = useState("Ready");
  const [breathRunning, setBreathRunning] = useState(false);

  const [movementOpen, setMovementOpen] = useState(false);
  const [movementMins, setMovementMins] = useState(15);
  const [movementRunning, setMovementRunning] = useState(false);
  const [movementRemaining, setMovementRemaining] = useState(15 * 60);
  const movementRef = useRef(null);

  // Derived
  const todayStr = dateKey(now);
  const dayKey = getDayKey(now);

  const usageCounts = useMemo(
    () => buildWeeklyUsage(weeklyPlan, snackLogs),
    [weeklyPlan, snackLogs]
  );

  const recipeGroups = useMemo(
    () => groupRecipesForUI(BUILT_IN_RECIPES),
    []
  );

  const allRecipes = useMemo(
    () => [...BUILT_IN_RECIPES, ...customRecipes],
    [customRecipes]
  );

  // time tick
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(i);
  }, []);

  // schedule regen
  useEffect(() => {
    const s = generateSchedule(wakeTime, mealTimeOverrides?.[todayStr], dayKey);
    setSchedule(s);
    localStorage.setItem("dp_wakeTime", wakeTime.toISOString());
  }, [wakeTime, mealTimeOverrides, todayStr, dayKey]);

  // persistence
  useEffect(() => localStorage.setItem("dp_completed", JSON.stringify(completed)), [completed]);
  useEffect(() => localStorage.setItem("dp_weeklyPlan", JSON.stringify(weeklyPlan)), [weeklyPlan]);
  useEffect(() => localStorage.setItem("dp_snackLogs", JSON.stringify(snackLogs)), [snackLogs]);
  useEffect(() => localStorage.setItem("dp_recipeFeedback", JSON.stringify(recipeFeedback)), [recipeFeedback]);
  useEffect(() => localStorage.setItem("dp_customRecipes", JSON.stringify(customRecipes)), [customRecipes]);
  useEffect(() => localStorage.setItem("dp_mealTimeOverrides", JSON.stringify(mealTimeOverrides)), [mealTimeOverrides]);

  // current schedule item
  const getCurrentItem = () => {
    for (let i = schedule.length - 1; i >= 0; i--) {
      if (schedule[i].time <= now) return { current: schedule[i], next: schedule[i + 1], index: i };
    }
    return { current: null, next: schedule[0], index: -1 };
  };

  const { current, next } = getCurrentItem();

  // Clock in (actual wake time button)
  const handleClockIn = () => {
    const newWake = new Date();
    setWakeTime(newWake);
    // reset today completions
    setCompleted({ date: todayStr });
    // clear today overrides when “start fresh”
    setMealTimeOverrides((prev) => ({ ...prev, [todayStr]: {} }));
  };

  // task completion
  const toggleTask = (idx) => setCompleted((p) => ({ ...p, date: todayStr, [idx]: !p[idx] }));

  // progress count
  const completedCount = useMemo(
    () => Object.values(completed).filter((v) => v === true).length,
    [completed]
  );

  // ============================================
  // JUICE/SNACK LOGGING + MEAL SHIFTING
  // Rule: juices should be 3 hours away from meals if NOT substituting.
  // We implement: if user logs a juice, app checks if next meal is <3h away
  // then offers (and can auto) shift that meal time forward.
  // ============================================
  const getTodayMealTimes = () => {
    // infer from schedule items
    const b = schedule.find((x) => x.title === "BREAKFAST")?.time || addMinutes(wakeTime, 120);
    const l = schedule.find((x) => x.title === "LUNCH")?.time || addMinutes(wakeTime, 360);
    const d = schedule.find((x) => x.title === "DINNER")?.time || addMinutes(wakeTime, 630);
    return { breakfast: new Date(b), lunch: new Date(l), dinner: new Date(d) };
  };

  const logSnackOrJuice = () => {
    setSnackError("");

    if (snackSelectedFruits.length === 0) return setSnackError("Pick at least 1 fruit.");
    if (snackSelectedFruits.length > 3) return setSnackError("Max 3 fruits.");

    // enforce fruit rules for the juice selection too:
    // (melon alone)
    if (snackSelectedFruits.some((f) => f.cat === "melon") && snackSelectedFruits.length > 1) {
      return setSnackError("Melons must be alone (no mixing).");
    }

    const log = {
      id: `snack-${Date.now()}`,
      type: snackType,
      fruits: snackSelectedFruits,
      timeISO: new Date(snackTime).toISOString()
    };

    setSnackLogs((prev) => {
      const nextLogs = { ...prev };
      nextLogs[todayStr] = [...(nextLogs[todayStr] || []), log].sort(
        (a, b) => new Date(a.timeISO) - new Date(b.timeISO)
      );
      return nextLogs;
    });

    // If juice: check 3h rule against the NEXT meal after the juice time
    if (snackType === "juice") {
      const t = new Date(snackTime).getTime();
      const meals = getTodayMealTimes();
      const nextMealKey =
        meals.breakfast.getTime() > t ? "breakfast" :
        meals.lunch.getTime() > t ? "lunch" :
        meals.dinner.getTime() > t ? "dinner" :
        null;

      if (nextMealKey) {
        const deltaMins = (meals[nextMealKey].getTime() - t) / 60000;
        if (deltaMins < 180) {
          // auto-shift next meal forward to 3 hours after juice
          const newTime = new Date(t + 180 * 60000);
          setMealTimeOverrides((prev) => ({
            ...prev,
            [todayStr]: { ...(prev?.[todayStr] || {}), [nextMealKey]: newTime.toISOString() }
          }));
        }
      }
    }

    // reset UI
    setSnackSelectedFruits([]);
    setSnackOpen(false);
  };

  // ============================================
  // MIND/BODY: BREATH VISUALIZER
  // ============================================
  const startBreath = () => {
    if (breathRunning) return;
    setBreathRunning(true);
    setBreathPhase("Inhale");

    let phase = "Inhale";
    breathTimerRef.current = setInterval(() => {
      phase = phase === "Inhale" ? "Exhale" : "Inhale";
      setBreathPhase(phase);
    }, breathCount * 1000);
  };

  const stopBreath = () => {
    setBreathRunning(false);
    setBreathPhase("Ready");
    if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    breathTimerRef.current = null;
  };

  // ============================================
  // MIND/BODY: MOVEMENT TIMER
  // ============================================
  const startMovement = () => {
    if (movementRunning) return;
    setMovementRunning(true);
    setMovementRemaining(movementMins * 60);

    movementRef.current = setInterval(() => {
      setMovementRemaining((s) => {
        if (s <= 1) {
          clearInterval(movementRef.current);
          movementRef.current = null;
          setMovementRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const stopMovement = () => {
    setMovementRunning(false);
    if (movementRef.current) clearInterval(movementRef.current);
    movementRef.current = null;
  };

  const movementSuggestions = [
    "Gentle walk (inside or outside)",
    "Hip circles + shoulder rolls",
    "Light yoga flow (10–15 min)",
    "Mobility routine (ankles/hips/spine)",
    "Dance to 3 songs (soft + joyful)",
    "Stretch + breath (calm nervous system)"
  ];

  // ============================================
  // RECIPES: CREATE / SAVE CUSTOM
  // ============================================
  const saveCustomRecipe = () => {
    if (!customDraft.name.trim()) return;

    const id = customDraft.id || makeId();
    const ingredients = customDraft.ingredientsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const steps = customDraft.stepsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const obj = {
      id,
      name: customDraft.name.trim(),
      category: customDraft.category || "Custom",
      servings: customDraft.servings || "",
      prepTime: customDraft.prepTime || "",
      cookTime: customDraft.cookTime || "",
      ingredients,
      steps,
      photoDataUrl: customDraft.photoDataUrl || ""
    };

    setCustomRecipes((prev) => {
      const exists = prev.find((r) => r.id === id);
      if (exists) return prev.map((r) => (r.id === id ? obj : r));
      return [obj, ...prev];
    });

    setCustomDraft({
      id: "",
      name: "",
      category: "Custom",
      servings: "",
      prepTime: "",
      cookTime: "",
      ingredientsText: "",
      stepsText: "",
      photoDataUrl: "",
      pastedText: ""
    });
    setRecipeTab("Custom");
  };

  const handlePhotoUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCustomDraft((p) => ({ ...p, photoDataUrl: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const parsePastedIntoDraft = () => {
    const { ingredients, steps } = parsePastedRecipeText(customDraft.pastedText);
    setCustomDraft((p) => ({
      ...p,
      ingredientsText: ingredients.join("\n"),
      stepsText: steps.join("\n")
    }));
  };

  // ============================================
  // RECIPES: RATE + NOTES
  // ============================================
  const setRecipeRating = (rid, stars) => {
    setRecipeFeedback((prev) => ({
      ...prev,
      [rid]: { ...(prev[rid] || {}), rating: stars }
    }));
  };

  const setRecipeNotes = (rid, notes) => {
    setRecipeFeedback((prev) => ({
      ...prev,
      [rid]: { ...(prev[rid] || {}), notes }
    }));
  };

  // ============================================
  // RECIPES: ASSIGN TO WEEK
  // weeklyPlan[day].recipeRefs = { lunch, dinner }
  // ============================================
  const assignRecipeToWeek = (rid) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [assignDay]: {
        ...(prev?.[assignDay] || {}),
        recipeRefs: {
          ...(prev?.[assignDay]?.recipeRefs || {}),
          [assignMeal]: rid
        }
      }
    }));
    setRecipeAssignOpen(false);
  };

  // ============================================
  // GROCERY LIST (still based on foods chosen; recipes view is separate)
  // ============================================
  const generateGroceryList = () => {
    const items = new Map();

    Object.values(weeklyPlan).forEach((day) => {
      day?.breakfast?.forEach((f) => items.set(f.name, (items.get(f.name) || 0) + 1));
      day?.lunch?.carbs?.forEach((c) => items.set(c.name, (items.get(c.name) || 0) + 1));
      day?.lunch?.greens?.forEach((g) => items.set(g.name, (items.get(g.name) || 0) + 1));
      day?.lunch?.veggies?.forEach((v) => items.set(v.name, (items.get(v.name) || 0) + 1));
      if (day?.dinner?.protein) items.set(day.dinner.protein.name, (items.get(day.dinner.protein.name) || 0) + 1);
      day?.dinner?.veggies?.forEach((v) => items.set(v.name, (items.get(v.name) || 0) + 1));
    });

    // Essentials (unchanged from your original)
    const essentials = ["Kombu", "Hemp Seeds", "Lemons", "Limes", "Cilantro", "Parsley", "Sea Salt"];
    essentials.forEach((e) => items.set(e, items.get(e) || 1));

    return Array.from(items.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  // ============================================
  // RENDER: HOME (keep the now/next dashboard)
  // ============================================
  const renderHome = () => (
    <div className="space-y-5">
      <div className="text-center py-8 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-4 right-4 w-24 h-24 bg-teal-300 rounded-full blur-2xl" />
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
        <span>I’m Awake — Start My Day</span>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => downloadICS(schedule, todayStr)}
          className="py-3 bg-white border-2 border-emerald-500 text-emerald-700 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all"
        >
          <Download size={18} />
          <span>Calendar</span>
        </button>

        <button
          onClick={() => setSnackOpen(true)}
          className="py-3 bg-white border-2 border-cyan-400 text-cyan-700 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-cyan-50 transition-all"
        >
          <Droplets size={18} />
          <span>Log Juice</span>
        </button>
      </div>

      {current && (
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-emerald-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-emerald-600 font-bold">Now</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <IconMap name={current.icon} size={28} className="text-white" />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{current.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{current.desc}</p>

              <button
                onClick={() => setScheduleDetail(current)}
                className="mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline"
              >
                View full instructions
              </button>
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
          <p>• <strong>Morning:</strong> water ok early window (as directed)</p>
          <p>• <strong>Midday:</strong> water ok between meal windows</p>
          <p>• <strong>Evening:</strong> water ok after dinner window</p>
          <p className="text-xs text-cyan-600 mt-2">
            (Your schedule cards also mark “💧 Water OK” and “🚫 Stop water” where applicable.)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-700">Today’s Progress</span>
          <span className="text-emerald-600 font-bold">
            {completedCount} / {schedule.length}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
            style={{ width: `${(completedCount / Math.max(1, schedule.length)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );

  // ============================================
  // RENDER: SCHEDULE (tap card -> modal with full detail)
  // ============================================
  const renderSchedule = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-light text-gray-800">Today’s Schedule</h2>
        <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-bold">
          {completedCount}/{schedule.length}
        </span>
      </div>

      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-amber-800 font-bold text-sm">Wake Time</span>
            <p className="text-xs text-amber-600">All times update automatically</p>
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

        {/* mind/body quick buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={() => setBreathOpen(true)}
            className="py-2 bg-white rounded-lg border border-amber-200 text-amber-800 font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles size={16} /> Breath Visualizer
          </button>
          <button
            onClick={() => setMovementOpen(true)}
            className="py-2 bg-white rounded-lg border border-amber-200 text-amber-800 font-semibold flex items-center justify-center gap-2"
          >
            <Timer size={16} /> Movement Timer
          </button>
        </div>
      </div>

      <button
        onClick={() => downloadICS(schedule, todayStr)}
        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all"
      >
        <Download size={18} />
        <span>Export to Calendar</span>
      </button>

      <div className="space-y-2">
        {schedule.map((item, i) => {
          const isCurrent = current === item;
          const isPast = item.time < now && !isCurrent;
          const isDone = completed[i];

          return (
            <div
              key={i}
              className={`p-4 rounded-xl transition-all ${
                isCurrent
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-[1.02]"
                  : isDone
                  ? "bg-emerald-50 border-2 border-emerald-300"
                  : isPast
                  ? "bg-gray-50 opacity-60 border border-gray-200"
                  : "bg-white border border-gray-100 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTask(i)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isCurrent ? "bg-white/20" : isDone ? "bg-emerald-200" : "bg-gray-100"
                  }`}
                >
                  {isDone ? (
                    <Check size={20} className="text-emerald-600" />
                  ) : (
                    <IconMap name={item.icon} size={18} className={isCurrent ? "text-white" : "text-gray-500"} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium ${isCurrent ? "text-white/80" : "text-gray-500"}`}>
                      {formatTime(item.time)}
                    </span>

                    {item.water === "start" && (
                      <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">💧 Water OK</span>
                    )}
                    {item.water === "end" && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🚫 Stop water</span>
                    )}
                    {item.optional && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Optional</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <h4 className={`font-bold ${isCurrent ? "text-white" : isDone ? "text-emerald-700" : "text-gray-800"}`}>
                      {item.title}
                    </h4>
                    <button
                      onClick={() => setScheduleDetail(item)}
                      className={`text-xs font-bold underline ${isCurrent ? "text-white/90" : "text-emerald-700"}`}
                    >
                      Details
                    </button>
                  </div>

                  <p className={`text-sm ${isCurrent ? "text-white/80" : "text-gray-500"}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ============================================
  // WEEKLY VIEW: tap meal -> opens recipe if assigned
  // ============================================
  const renderWeekly = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light text-gray-800">Weekly Plan</h2>
        <button onClick={() => setWeeklyPlan({})} className="text-sm text-red-600 hover:text-red-700">
          Clear All
        </button>
      </div>

      {DAYS.map((d) => {
        const plan = weeklyPlan[d] || {};
        const refs = plan.recipeRefs || {};

        const lunchRecipe = refs.lunch ? getRecipeById(refs.lunch, BUILT_IN_RECIPES, customRecipes) : null;
        const dinnerRecipe = refs.dinner ? getRecipeById(refs.dinner, BUILT_IN_RECIPES, customRecipes) : null;

        return (
          <div key={d} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-white text-lg">{d}</span>
              <span className="text-xs text-white/90">
                Tap a recipe name to view prep + steps
              </span>
            </div>

            <div className="p-4 space-y-3">
              {/* Breakfast foods */}
              <div className="flex items-start gap-3">
                <Apple size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-gray-500 font-medium">BREAKFAST (foods)</span>
                  <p className="text-sm text-gray-700">
                    {plan.breakfast?.length ? plan.breakfast.map((f) => f.name).join(" + ") : <span className="text-gray-400">Not planned</span>}
                  </p>
                </div>
              </div>

              {/* Lunch recipe */}
              <div className="flex items-start gap-3">
                <Salad size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-gray-500 font-medium">LUNCH (recipe)</span>
                  {lunchRecipe ? (
                    <button
                      onClick={() => setWeeklyRecipeOpen({ id: lunchRecipe.id, day: d, meal: "lunch" })}
                      className="text-sm text-emerald-700 font-bold underline"
                    >
                      {lunchRecipe.name}
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">No recipe assigned</span>
                  )}
                </div>
              </div>

              {/* Dinner recipe */}
              <div className="flex items-start gap-3">
                <Utensils size={18} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-gray-500 font-medium">DINNER (recipe)</span>
                  {dinnerRecipe ? (
                    <button
                      onClick={() => setWeeklyRecipeOpen({ id: dinnerRecipe.id, day: d, meal: "dinner" })}
                      className="text-sm text-emerald-700 font-bold underline"
                    >
                      {dinnerRecipe.name}
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">No recipe assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ============================================
  // GROCERY VIEW (unchanged)
  // ============================================
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
            <p className="text-gray-400">Plan meals to generate a grocery list</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {groceryList.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">×{item.count}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-3">📋 Don’t Forget</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Herbal tea blends</li>
                <li>• Digestive System Support capsules</li>
                <li>• Immune & Lymphatic Support capsules</li>
                <li>• Reproductive System Support capsules</li>
                <li>• Multivitamin</li>
                <li>• Mineral Complex</li>
              </ul>
            </div>
          </>
        )}
      </div>
    );
  };

  // ============================================
  // RECIPES VIEW
  // ============================================
  const renderRecipes = () => {
    const builtInForTab =
  recipeTab === "Custom"
    ? []
    : recipeGroups.find((g) => g.label === recipeTab)?.recipes || [];

    const selectedRecipe = selectedRecipeId
      ? getRecipeById(selectedRecipeId, BUILT_IN_RECIPES, customRecipes)
      : null;

    const feedback = selectedRecipe ? (recipeFeedback[selectedRecipe.id] || {}) : {};

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-gray-800">Recipes</h2>
          <button
            onClick={() => {
              setCustomDraft({
                id: "",
                name: "",
                category: "Custom",
                servings: "",
                prepTime: "",
                cookTime: "",
                ingredientsText: "",
                stepsText: "",
                photoDataUrl: "",
                pastedText: ""
              });
              setRecipeTab("Custom");
            }}
            className="text-sm font-bold text-emerald-700 underline flex items-center gap-2"
          >
            <Pencil size={16} /> Add Custom
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {["Foods", "Juices", "Infused Waters", "Custom"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setRecipeTab(tab);
                setSelectedRecipeId(null);
              }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                recipeTab === tab
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Detail pane */}
        {selectedRecipe ? (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                  {selectedRecipe.category || "Recipe"}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{selectedRecipe.name}</h3>

                {(selectedRecipe.servings || selectedRecipe.prepTime || selectedRecipe.cookTime) ? (
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    {selectedRecipe.servings ? <div><strong>Servings:</strong> {selectedRecipe.servings}</div> : null}
                    {selectedRecipe.prepTime ? <div><strong>Prep:</strong> {selectedRecipe.prepTime}</div> : null}
                    {selectedRecipe.cookTime ? <div><strong>Cook:</strong> {selectedRecipe.cookTime}</div> : null}
                  </div>
                ) : null}
              </div>

              <button
                onClick={() => setSelectedRecipeId(null)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* photo if custom */}
            {selectedRecipe.photoDataUrl ? (
              <div className="mt-4">
                <img
                  src={selectedRecipe.photoDataUrl}
                  alt="Recipe upload"
                  className="w-full rounded-xl border border-gray-200"
                />
              </div>
            ) : null}

            {/* Prep / Ingredients */}
            <div className="mt-5">
              <h4 className="font-bold text-gray-800">Prep / Ingredients</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {(selectedRecipe.ingredients || []).map((line, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="mt-5">
              <h4 className="font-bold text-gray-800">Cook / Steps</h4>
              <ol className="mt-2 space-y-2 text-sm text-gray-700">
                {(selectedRecipe.steps || []).length ? (
                  (selectedRecipe.steps || []).map((s, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-gray-500 font-bold">{idx + 1}.</span>
                      <span>{s}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No steps listed.</li>
                )}
              </ol>
            </div>

            {/* Rating + Notes */}
            <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-emerald-900">Your Rating + Notes</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRecipeRating(selectedRecipe.id, s)}
                      className="transition hover:scale-110"
                    >
                      <Star
                        size={20}
                        className={Number(feedback.rating || 0) >= s ? "text-yellow-400 fill-yellow-400" : "text-emerald-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={feedback.notes || ""}
                onChange={(e) => setRecipeNotes(selectedRecipe.id, e.target.value)}
                placeholder="Notes for future suggestions (flavor, digestion, tweaks, cravings, etc.)"
                className="mt-3 w-full rounded-xl border border-emerald-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
                rows={3}
              />
            </div>

            {/* Add to Week */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setRecipeAssignOpen(true);
                  setAssignDay("Mon");
                  setAssignMeal("lunch");
                }}
                className="py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                Add to Week
              </button>
              <button
                onClick={() => {
                  setView("weekly");
                  setWeeklyRecipeOpen({ id: selectedRecipe.id, day: "Mon", meal: "lunch" });
                }}
                className="py-3 rounded-xl bg-white border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-50"
              >
                Go to Weekly
              </button>
            </div>
          </div>
        ) : null}

        {/* Custom recipe creator (when tab=Custom and none selected) */}
        {recipeTab === "Custom" && !selectedRecipeId ? (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-700" />
              <h3 className="font-bold text-gray-800">Create / Save a Recipe</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                value={customDraft.name}
                onChange={(e) => setCustomDraft((p) => ({ ...p, name: e.target.value }))}
                placeholder="Recipe name"
                className="col-span-2 rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <input
                value={customDraft.servings}
                onChange={(e) => setCustomDraft((p) => ({ ...p, servings: e.target.value }))}
                placeholder="Servings (ex: 2 servings)"
                className="rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <input
                value={customDraft.prepTime}
                onChange={(e) => setCustomDraft((p) => ({ ...p, prepTime: e.target.value }))}
                placeholder="Prep time (ex: 10 min)"
                className="rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <input
                value={customDraft.cookTime}
                onChange={(e) => setCustomDraft((p) => ({ ...p, cookTime: e.target.value }))}
                placeholder="Cook time (ex: 25 min)"
                className="rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <select
                value={customDraft.category}
                onChange={(e) => setCustomDraft((p) => ({ ...p, category: e.target.value }))}
                className="rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option>Custom</option>
                <option>Lunch Salads</option>
                <option>Dinner</option>
                <option>Soup</option>
                <option>Juice</option>
                <option>Infusion Water</option>
                <option>Smoothie</option>
                <option>Smoothie Bowl</option>
                <option>Milk</option>
                <option>Dressings</option>
                <option>Sauce</option>
              </select>
            </div>

            {/* Photo upload */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-gray-800 flex items-center gap-2">
                  <ImageIcon size={18} /> Photo Upload (optional)
                </div>
                <label className="cursor-pointer text-sm font-bold text-emerald-700 underline">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handlePhotoUpload(f);
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Note: Turning a photo into structured steps requires text input (offline). Upload the photo,
                then paste the recipe text (or type it) below and hit “Auto-format”.
              </p>

              {customDraft.photoDataUrl ? (
                <img
                  src={customDraft.photoDataUrl}
                  className="mt-3 w-full rounded-xl border border-gray-200"
                  alt="Uploaded recipe"
                />
              ) : null}

              <textarea
                value={customDraft.pastedText}
                onChange={(e) => setCustomDraft((p) => ({ ...p, pastedText: e.target.value }))}
                placeholder="Paste recipe text here (from Notes, Messages, etc.) — then Auto-format"
                className="mt-3 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                rows={4}
              />

              <button
                onClick={parsePastedIntoDraft}
                className="mt-3 w-full py-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-50"
              >
                Auto-format into Ingredients + Steps
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <textarea
                value={customDraft.ingredientsText}
                onChange={(e) => setCustomDraft((p) => ({ ...p, ingredientsText: e.target.value }))}
                placeholder="Ingredients (one per line)"
                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                rows={5}
              />

              <textarea
                value={customDraft.stepsText}
                onChange={(e) => setCustomDraft((p) => ({ ...p, stepsText: e.target.value }))}
                placeholder="Steps (one per line; start lines with “1.” etc if you want)"
                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                rows={5}
              />
            </div>

            <button
              onClick={saveCustomRecipe}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
            >
              Save Recipe
            </button>

            {/* Custom list */}
            <div className="mt-2">
              <div className="text-sm font-bold text-gray-700 mb-2">Your Saved Recipes</div>
              <div className="space-y-2">
                {customRecipes.length ? (
                  customRecipes.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRecipeId(r.id)}
                      className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-emerald-300 bg-white"
                    >
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                        {r.categoryLabel || r.category || "Custom"}
}
                      </div>
                      <div className="font-bold text-gray-800">{r.name}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {(r.ingredients || []).slice(0, 2).join(" • ")}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-gray-400">No custom recipes yet.</div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Built-in recipe list */}
        {recipeTab !== "Custom" && !selectedRecipe ? (
          <div className="space-y-2">
            {builtInForTab.length ? (
              builtInForTab.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRecipeId(r.id)}
                  className="w-full text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition"
                >
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                    {r.categoryLabel || r.category || "Recipe"}
}
                  </div>
                  <div className="font-bold text-gray-800">{r.name}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {(r.ingredients || []).slice(0, 2).join(" • ")}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-400 bg-white rounded-xl p-4 border border-gray-200">
                No recipes found for this tab yet (check your src/recipeData.js contents).
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  // ============================================
  // MODALS (Schedule detail, recipe assign, weekly recipe detail, juice logger, mind/body)
  // ============================================
  const ModalShell = ({ title, children, onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-3">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-between">
          <div className="text-white font-bold">{title}</div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/15 hover:bg-white/25">
            <X size={18} className="text-white" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );

  const ScheduleDetailModal = () => {
    if (!scheduleDetail) return null;
    return (
      <ModalShell title={scheduleDetail.title} onClose={() => setScheduleDetail(null)}>
        <div className="text-sm text-gray-600">{scheduleDetail.desc}</div>
        <div className="mt-4 space-y-2">
          {(scheduleDetail.detail || []).map((line, idx) => (
            <div key={idx} className="text-sm text-gray-800">
              {line}
            </div>
          ))}
        </div>
      </ModalShell>
    );
  };

  const RecipeAssignModal = () => {
    if (!recipeAssignOpen || !selectedRecipeId) return null;
    return (
      <ModalShell title="Add Recipe to Week" onClose={() => setRecipeAssignOpen(false)}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500 font-bold mb-1">Day</div>
            <select
              value={assignDay}
              onChange={(e) => setAssignDay(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm"
            >
              {DAYS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <div className="text-xs text-gray-500 font-bold mb-1">Meal</div>
            <select
              value={assignMeal}
              onChange={(e) => setAssignMeal(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm"
            >
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => assignRecipeToWeek(selectedRecipeId)}
          className="mt-4 w-full py-3 rounded-xl bg-emerald-600 text-white font-bold"
        >
          Save to {assignDay} ({assignMeal})
        </button>
      </ModalShell>
    );
  };

  const WeeklyRecipeModal = () => {
    if (!weeklyRecipeOpen) return null;
    const r = getRecipeById(weeklyRecipeOpen.id, BUILT_IN_RECIPES, customRecipes);
    if (!r) return null;

    const fb = recipeFeedback[r.id] || {};
    return (
      <ModalShell
        title={`${weeklyRecipeOpen.day} — ${weeklyRecipeOpen.meal.toUpperCase()}`}
        onClose={() => setWeeklyRecipeOpen(null)}
      >
        <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">{r.categoryLabel || r.category || "Custom"}</div>
        <div className="text-lg font-bold text-gray-800 mt-1">{r.name}</div>

        {(r.servings || r.prepTime || r.cookTime) ? (
          <div className="text-sm text-gray-600 mt-2 space-y-1">
            {r.servings ? <div><strong>Servings:</strong> {r.servings}</div> : null}
            {r.prepTime ? <div><strong>Prep:</strong> {r.prepTime}</div> : null}
            {r.cookTime ? <div><strong>Cook:</strong> {r.cookTime}</div> : null}
          </div>
        ) : null}

        <div className="mt-4">
          <div className="font-bold text-gray-800">Prep / Ingredients</div>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {(r.ingredients || []).map((line, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <div className="font-bold text-gray-800">Cook / Steps</div>
          <ol className="mt-2 space-y-2 text-sm text-gray-700">
            {(r.steps || []).map((s, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-gray-500 font-bold">{idx + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-emerald-900">Rate this meal</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRecipeRating(r.id, s)} className="transition hover:scale-110">
                  <Star size={20} className={Number(fb.rating || 0) >= s ? "text-yellow-400 fill-yellow-400" : "text-emerald-300"} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={fb.notes || ""}
            onChange={(e) => setRecipeNotes(r.id, e.target.value)}
            placeholder="Notes for future suggestions"
            className="mt-3 w-full rounded-xl border border-emerald-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
            rows={3}
          />
        </div>
      </ModalShell>
    );
  };

  const SnackModal = () => {
    if (!snackOpen) return null;

    const valid = getValidFruits(snackSelectedFruits);
    const all = getAllFruits();

    // disable if exceeded weekly freq
    const isDisabled = (f) => isExceeded(f, usageCounts);

    const toggleFruit = (f) => {
      setSnackError("");

      // melon alone rule
      if (f.cat === "melon") {
        if (snackSelectedFruits.length > 0) return setSnackError("Melons must be alone.");
        setSnackSelectedFruits([f]);
        return;
      }

      if (snackSelectedFruits.some((x) => x.cat === "melon")) {
        return setSnackError("Remove melon first (melons must be alone).");
      }

      const exists = snackSelectedFruits.find((x) => x.name === f.name);
      if (exists) {
        setSnackSelectedFruits((p) => p.filter((x) => x.name !== f.name));
      } else {
        if (snackSelectedFruits.length >= 3) return;
        setSnackSelectedFruits((p) => [...p, f]);
      }
    };

    return (
      <ModalShell title="Log Juice / Fruit" onClose={() => setSnackOpen(false)}>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSnackType("juice")}
            className={`py-2 rounded-xl font-bold ${snackType === "juice" ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Juice
          </button>
          <button
            onClick={() => setSnackType("snackFruit")}
            className={`py-2 rounded-xl font-bold ${snackType === "snackFruit" ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Fruit Snack
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Choose up to <strong>3 fruits</strong>. This logs frequency. If “Juice”, we’ll auto-shift the next meal
          to stay <strong>3 hours away</strong> if needed.
        </div>

        {snackError ? (
          <div className="mt-3 bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-sm">
            {snackError}
          </div>
        ) : null}

        <div className="mt-4">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">
            Selected ({snackSelectedFruits.length}/3)
          </div>
          <div className="flex flex-wrap gap-2">
            {snackSelectedFruits.map((f) => (
              <span key={f.name} className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-sm font-bold">
                {f.name}
              </span>
            ))}
            {!snackSelectedFruits.length ? <span className="text-gray-400 text-sm">None</span> : null}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Fruits</div>
          <div className="flex flex-wrap gap-2">
            {(snackSelectedFruits.length === 0 ? all : valid).map((f) => {
              const disabled = isDisabled(f);
              const selected = !!snackSelectedFruits.find((x) => x.name === f.name);

              return (
                <button
                  key={f.name}
                  onClick={() => !disabled && toggleFruit(f)}
                  disabled={disabled}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                    : selected ? "bg-cyan-600 text-white"
                    : "bg-cyan-50 text-cyan-800 hover:bg-cyan-100"
                  }`}
                  title={disabled ? "Weekly limit reached" : ""}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Time</div>
          <input
            type="time"
            value={`${String(snackTime.getHours()).padStart(2, "0")}:${String(snackTime.getMinutes()).padStart(2, "0")}`}
            onChange={(e) => {
              const [hh, mm] = e.target.value.split(":").map(Number);
              const t = new Date();
              t.setHours(hh, mm, 0, 0);
              setSnackTime(t);
            }}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm"
          />
        </div>

        <button
          onClick={logSnackOrJuice}
          className="mt-4 w-full py-3 rounded-xl bg-cyan-700 text-white font-bold hover:bg-cyan-800"
        >
          Save
        </button>
      </ModalShell>
    );
  };

  const BreathModal = () => {
    if (!breathOpen) return null;

    return (
      <ModalShell title="Breath Visualizer" onClose={() => { stopBreath(); setBreathOpen(false); }}>
        <div className="text-sm text-gray-600">
          Slow intentional breaths. This is built to make “20 breaths” feel easy and calming.
        </div>

        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-emerald-700 font-bold">Phase</div>
          <div className="text-3xl font-extrabold text-emerald-900 mt-2">{breathPhase}</div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-sm text-emerald-800 font-bold">Seconds per phase</span>
            <input
              type="range"
              min={4}
              max={10}
              value={breathCount}
              onChange={(e) => setBreathCount(Number(e.target.value))}
            />
            <span className="text-sm text-emerald-900 font-bold">{breathCount}s</span>
          </div>

          <div className="mt-4 flex gap-2">
            {!breathRunning ? (
              <button onClick={startBreath} className="flex-1 py-3 rounded-xl bg-emerald-700 text-white font-bold">
                Start
              </button>
            ) : (
              <button onClick={stopBreath} className="flex-1 py-3 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold">
                Stop
              </button>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-3">
          Tip: do this while waiting for tea to steep, pre-meals, or when you feel “wired”.
        </div>
      </ModalShell>
    );
  };

  const MovementModal = () => {
    if (!movementOpen) return null;

    const mm = Math.floor(movementRemaining / 60);
    const ss = movementRemaining % 60;

    return (
      <ModalShell title="Intentional Movement Timer" onClose={() => { stopMovement(); setMovementOpen(false); }}>
        <div className="text-sm text-gray-600">
          Set your movement minutes and press start. This supports the “movement” requirement without feeling annoying.
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-amber-900">Minutes</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMovementMins((m) => clamp(m - 1, 5, 45))} className="p-2 bg-white rounded-lg border border-amber-200">
                <Minus size={16} />
              </button>
              <div className="w-14 text-center font-extrabold text-amber-900 text-lg">{movementMins}</div>
              <button onClick={() => setMovementMins((m) => clamp(m + 1, 5, 45))} className="p-2 bg-white rounded-lg border border-amber-200">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="text-xs uppercase tracking-wider text-amber-700 font-bold">Time left</div>
            <div className="text-3xl font-extrabold text-amber-900 mt-2">
              {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {!movementRunning ? (
              <button onClick={startMovement} className="flex-1 py-3 rounded-xl bg-amber-700 text-white font-bold">
                Start
              </button>
            ) : (
              <button onClick={stopMovement} className="flex-1 py-3 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold">
                Stop
              </button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-bold text-gray-800 mb-2">Movement ideas</div>
          <ul className="text-sm text-gray-600 space-y-1">
            {movementSuggestions.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </ModalShell>
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
        {view === "recipes" && renderRecipes()}
        {view === "weekly" && renderWeekly()}
        {view === "grocery" && renderGrocery()}
      </div>

      {/* bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 py-2 pb-safe">
        <div className="max-w-lg mx-auto flex justify-around">
          {[
            { id: "home", icon: Home, label: "Today" },
            { id: "schedule", icon: Clock, label: "Schedule" },
            { id: "recipes", icon: BookOpen, label: "Recipes" },
            { id: "weekly", icon: Calendar, label: "Week" },
            { id: "grocery", icon: ShoppingCart, label: "Grocery" }
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

      {/* modals */}
      <ScheduleDetailModal />
      <RecipeAssignModal />
      <WeeklyRecipeModal />
      <SnackModal />
      <BreathModal />
      <MovementModal />
    </div>
  );
}
