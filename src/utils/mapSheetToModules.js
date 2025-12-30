// src/utils/mapSheetToModules.js
// Mapper: rows -> modules
// Supports flexible Activity column (comma-separated)

function getKey(row, candidates) {
  if (!row) return null;
  const keys = Object.keys(row || {});
  const norm = {};
  keys.forEach((k) => {
    norm[k.toLowerCase().replace(/\s+/g, "")] = k;
  });
  for (const c of candidates) {
    const key = norm[c.toLowerCase().replace(/\s+/g, "")];
    if (key) return key;
  }
  return null;
}

function hashStringToInt(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const COLOR_CLASSES = [
  "module-blue",
  "module-purple",
  "module-teal",
  "module-yellow",
  "module-pink",
  "module-cyan",
  "module-green",
  "module-indigo",
];

function convertGoogleDriveLink(url, mode = "image") {
  if (!url) return "";

  const match =
    url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  if (!match) return url;

  const fileId = match[1];

  if (mode === "video") {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
}

function splitListCell(val) {
  if (!val) return [];
  return String(val)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function detectActivityType(item) {
  if (typeof item === "object" && item?.type) return item;
  if (typeof item !== "string") return null;

  const raw = item.trim();
  const v = raw.toLowerCase();
  const id = `${hashStringToInt(raw)}-${v}`;

  if (v === "quiz") {
    return { id, type: "quiz", title: "Quiz" };
  }

  if (v === "aiornot") {
    return { type: "game", game: "AiOrNot" };
  }

  if (v.match(/\.(mp3|wav|ogg)$/)) {
    return { id, type: "audio", title: "Audio", src: raw };
  }

  if (raw.includes("drive.google.com")) {
    return {
      id,
      type: "video",
      title: "Video",
      src: convertGoogleDriveLink(raw, "video"),
    };
  }

  if (v.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
    return { id, type: "image", title: "Image", src: raw };
  }

  return { id, type: "iframe", title: "Interactive", src: raw };



  // AUDIO
  if (v.match(/\.(mp3|wav|ogg)$/)) {
    return {
      id,
      type: "audio",
      title: "Audio",
      src: raw,
    };
  }

  // GOOGLE DRIVE VIDEO
  if (raw.includes("drive.google.com")) {
    return {
      id,
      type: "video",
      title: "Video",
      src: convertGoogleDriveLink(raw, "video"),
    };
  }

  // IMAGE
  if (v.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
    return {
      id,
      type: "image",
      title: "Image",
      src: raw,
    };
  }

  // DEFAULT → iframe (games, tools, vercel apps, etc.)
  return {
    id,
    type: "iframe",
    title: "Interactive",
    src: raw,
  };
}

function parseAIDetection(cell) {
  if (!cell) return null;

  const lines = String(cell)
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  if (lines[0] !== "ai-detection") return null;

  const image = lines[1];
  const answer = lines[2]; // "ai" | "not-ai"
  const followUps = lines[3]
    ? lines[3].split("|").map(s => s.trim())
    : [];

  return {
    type: "ai-quiz",
    questions: [
      {
        image,
        answer,
        followUps
      }
    ]
  };
}



export function mapRowsToModules(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  

  const modulesMap = {};

  rows.forEach((row) => {
    const kModuleId = getKey(row, ["moduleId", "Module ID", "module"]);
    const kModuleTitle = getKey(row, ["moduleTitle", "Module Title", "title"]);
    const kModuleDesc = getKey(row, ["moduleDescription", "description"]);
    const kModuleImage = getKey(row, ["moduleImage"]);
    const kModuleLevel = getKey(row, ["moduleLevel", "level"]);

    const kTopicTitle = getKey(row, ["topicTitle"]);
    const kTopicContent = getKey(row, ["topicDescription"]);
    const kTopicImage = getKey(row, ["topicImage"]);
    const kActivity = getKey(row, ["activity", "activityContent"]);

    const kQuizQuestion = getKey(row, ["quizQuestion"]);
    const kQuizOptionA = getKey(row, ["quizOptionA"]);
    const kQuizOptionB = getKey(row, ["quizOptionB"]);
    const kQuizOptionC = getKey(row, ["quizOptionC"]);
    const kQuizOptionD = getKey(row, ["quizOptionD"]);
    const kCorrectAnswer = getKey(row, ["correctAnswer"]);

    const moduleId = row[kModuleId]?.toString().trim();
    if (!moduleId) return;

    if (!modulesMap[moduleId]) {
      modulesMap[moduleId] = {
        id: moduleId,
        title: row[kModuleTitle] || moduleId,
        desc: row[kModuleDesc] || "",
        level: row[kModuleLevel] || "Beginner",
        image: kModuleImage ? convertGoogleDriveLink(row[kModuleImage]) : "",
        color:
          COLOR_CLASSES[hashStringToInt(moduleId) % COLOR_CLASSES.length],
        topics: [],
        topicContents: [],
        topicImages: [],
        activities: [],
        quiz: [],
      };
    }

    const mod = modulesMap[moduleId];
    const topicTitle = row[kTopicTitle]?.toString().trim();
    if (!topicTitle) return;

    let index = mod.topics.indexOf(topicTitle);

    // ✅ Create topic ONCE
    if (index === -1) {
      index = mod.topics.length;

      mod.topics.push(topicTitle);
      mod.topicContents.push(row[kTopicContent] || "");
      mod.topicImages.push(
        kTopicImage ? convertGoogleDriveLink(row[kTopicImage]) : ""
      );
      mod.activities.push([]);
      mod.quiz.push([]);
    }

    // ✅ ALWAYS append activities (THIS IS THE FIX)
    // --- ACTIVITIES (ACCUMULATE ONCE PER TOPIC, DEDUPLICATE) ---
// ensure array exists
if (!Array.isArray(mod.activities[index])) {
  mod.activities[index] = [];
}

if (kActivity && row[kActivity]) {
  const parsedActivities = splitListCell(row[kActivity])
    .map(detectActivityType)
    .filter(Boolean);

  parsedActivities.forEach((act) => {
    const exists = mod.activities[index].some(
      (a) =>
        a.type === act.type &&
        (a.src || "") === (act.src || "")
    );

    if (!exists) {
      mod.activities[index].push(act);
    }
  });
}





    // ✅ Quiz
    if (row[kQuizQuestion]) {
  const options = [
    row[kQuizOptionA],
    row[kQuizOptionB],
    row[kQuizOptionC],
    row[kQuizOptionD],
  ]
    .map((o) => (o ? o.toString().trim() : null))
    .filter(Boolean);

  let answer = -1;

  if (row[kCorrectAnswer]) {
    const correctValue = row[kCorrectAnswer]
      .toString()
      .trim()
      .toLowerCase();

    answer = options.findIndex(
      (opt) => opt.toLowerCase() === correctValue
    );
  }

  mod.quiz[index].push({
    id: `${moduleId}-${index}-q${mod.quiz[index].length + 1}`,
    type: options.length > 2 ? "mcq" : "truefalse",
    q: row[kQuizQuestion],
    options,
    answer, // ✅ now correct index
    correctFeedback: row["quizCorrectFeedback"] || "",
    incorrectFeedback: row["quizIncorrectFeedback"] || "",
  });
}

  });

  return Object.values(modulesMap);
}
