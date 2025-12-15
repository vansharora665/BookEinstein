// src/utils/mapSheetToModules.js
// Mapper: rows -> modules, supports moduleImage, topicImage, topicSlides, summaryVideoUrl,
// quiz feedback columns and auto-assigned colors
// Headers recognized loosely (case/space tolerant).

function getKey(row, candidates) {
  if (!row) return null;
  const keys = Object.keys(row || {});
  const norm = {};
  keys.forEach((k) => (norm[k.toLowerCase().replace(/\s+/g, "")] = k));
  for (const c of candidates) {
    const k = norm[c.toLowerCase().replace(/\s+/g, "")];
    if (k) return k;
  }
  return null;
}

// deterministic hash -> integer
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

/**
 * Convert various Google Drive URLs into a usable CSP-safe URL.
 * Backward compatible with legacy modes: "view" and "preview".
 */
function convertGoogleDriveLink(url, mode = "image") {
  if (!url || typeof url !== "string") return "";

  const cleaned = url.trim();
  if (!cleaned) return "";

  const match =
    cleaned.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    cleaned.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  // Not a Drive link → return as-is
  if (!match) return cleaned;

  const fileId = match[1];

  // normalize legacy modes
  const normalizedMode =
    mode === "view" ? "image" :
    mode === "preview" ? "video" :
    mode;

  // ✅ Images (NO iframe → CSP safe)
  if (normalizedMode === "image") {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
  }

  // ✅ Videos (iframe preview allowed)
  if (normalizedMode === "video") {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  return cleaned;
}

function splitListCell(cellVal) {
  if (!cellVal) return [];
  if (Array.isArray(cellVal)) return cellVal;
  return String(cellVal)
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function mapRowsToModules(rows) {
  if (!rows || !rows.length) return [];

  const modulesMap = {};

  rows.forEach((rawRow) => {
    const row = rawRow || {};

    const kModuleId = getKey(row, ["moduleId", "Module ID", "module_id", "module"]);
    const kModuleTitle = getKey(row, ["moduleTitle", "Module Title", "module_title", "title"]);
    const kModuleDesc = getKey(row, ["moduleDescription", "Module Description", "description", "desc"]);
    const kModuleImage = getKey(row, ["moduleImage", "Module Image", "image", "module_image"]);
    const kModuleLevel = getKey(row, ["moduleLevel", "Module Level", "level"]);

    const kTopicTitle = getKey(row, ["topicTitle", "Topic Title", "topic_title", "topic"]);
    const kTopicContent = getKey(row, ["topicDescription", "Topic Description", "topic_content", "topicContent"]);
    const kActivityContent = getKey(row, ["activityContent", "Activity Content"]);
    const kTeacherNotes = getKey(row, ["teacherNotes", "Teacher Notes"]);
    const kTopicImage = getKey(row, ["topicImage", "Topic Image"]);
    const kTopicSlides = getKey(row, ["topicSlides", "Topic Slides"]);
    const kVideoUrl = getKey(row, ["videoUrl", "Video URL"]);
    const kSummaryVideo = getKey(row, ["summaryVideoUrl", "summaryVideo"]);

    const kQuizQuestion = getKey(row, ["quizQuestion", "Quiz Question"]);
    const kQuizOptionA = getKey(row, ["quizOptionA"]);
    const kQuizOptionB = getKey(row, ["quizOptionB"]);
    const kQuizOptionC = getKey(row, ["quizOptionC"]);
    const kQuizOptionD = getKey(row, ["quizOptionD"]);
    const kCorrectAnswer = getKey(row, ["correctAnswer"]);
    const kQuizCorrectFeedback = getKey(row, ["quizCorrectFeedback"]);
    const kQuizIncorrectFeedback = getKey(row, ["quizIncorrectFeedback"]);
    const kQuizDifficulty = getKey(row, ["quizDifficulty", "difficulty"]);

    const moduleIdRaw = kModuleId && row[kModuleId] ? String(row[kModuleId]).trim() : "";
    const moduleId = moduleIdRaw || null;
    if (!moduleId) return;

    if (!modulesMap[moduleId]) {
      const colorClass = COLOR_CLASSES[hashStringToInt(moduleId) % COLOR_CLASSES.length];
      modulesMap[moduleId] = {
        id: moduleId,
        title: kModuleTitle && row[kModuleTitle] ? String(row[kModuleTitle]).trim() : moduleId,
        color: colorClass,
        level: kModuleLevel && row[kModuleLevel] ? String(row[kModuleLevel]).trim() : "Beginner",
        desc: kModuleDesc && row[kModuleDesc] ? String(row[kModuleDesc]).trim() : "",
        image: kModuleImage ? convertGoogleDriveLink(row[kModuleImage], "view") : "",
        topics: [],
        topicContents: [],
        activityContents: [],
        teacherNotes: [],
        topicImages: [],
        topicSlides: [],
        videos: [],
        summaryVideos: [],
        quiz: [],
      };
    }

    const mod = modulesMap[moduleId];

    const topicTitle = kTopicTitle && row[kTopicTitle] ? String(row[kTopicTitle]).trim() : "";
    if (!topicTitle) return;

    let topicIndex = mod.topics.indexOf(topicTitle);
    if (topicIndex === -1) {
      mod.topics.push(topicTitle);
      mod.topicContents.push(kTopicContent ? String(row[kTopicContent] || "") : "");
      mod.activityContents.push(kActivityContent ? String(row[kActivityContent] || "") : "");
      mod.teacherNotes.push(kTeacherNotes ? String(row[kTeacherNotes] || "") : "");
      mod.topicImages.push(kTopicImage ? convertGoogleDriveLink(row[kTopicImage], "view") : "");

      const rawSlides = kTopicSlides ? String(row[kTopicSlides] || "") : "";
      mod.topicSlides.push(
        splitListCell(rawSlides).map((s) => convertGoogleDriveLink(s, "view"))
      );

      mod.videos.push(kVideoUrl ? convertGoogleDriveLink(row[kVideoUrl], "preview") : "");
      mod.summaryVideos.push(kSummaryVideo ? convertGoogleDriveLink(row[kSummaryVideo], "preview") : "");
      mod.quiz.push([]);
      topicIndex = mod.topics.length - 1;
    }

    const rawQ = kQuizQuestion && row[kQuizQuestion] ? String(row[kQuizQuestion]).trim() : "";
    if (!rawQ) return;

    const a = kQuizOptionA ? String(row[kQuizOptionA] || "") : "";
    const b = kQuizOptionB ? String(row[kQuizOptionB] || "") : "";
    const c = kQuizOptionC ? String(row[kQuizOptionC] || "") : "";
    const d = kQuizOptionD ? String(row[kQuizOptionD] || "") : "";

    const correctRaw = kCorrectAnswer ? String(row[kCorrectAnswer] || "") : "";
    const difficulty = kQuizDifficulty ? String(row[kQuizDifficulty] || "") : "";

    const options = [a, b, c, d].filter(Boolean);
    let answerIndex = -1;

    const normalized = correctRaw.toLowerCase();
    if (["a", "1", "0"].includes(normalized)) answerIndex = 0;
    else if (["b", "2"].includes(normalized)) answerIndex = 1;
    else if (["c", "3"].includes(normalized)) answerIndex = 2;
    else if (["d", "4"].includes(normalized)) answerIndex = 3;

    if (answerIndex === -1 && correctRaw) {
      const found = options.findIndex((o) => o.toLowerCase() === correctRaw.toLowerCase());
      if (found >= 0) answerIndex = found;
    }

    mod.quiz[topicIndex].push({
      id: `${moduleId}-${topicIndex}-q${mod.quiz[topicIndex].length + 1}`,
      type: options.length ? "mcq" : "truefalse",
      q: rawQ,
      options,
      answer: answerIndex,
      correctFeedback: kQuizCorrectFeedback ? String(row[kQuizCorrectFeedback] || "") : "",
      incorrectFeedback: kQuizIncorrectFeedback ? String(row[kQuizIncorrectFeedback] || "") : "",
      difficulty,
    });
  });

  const modules = Object.values(modulesMap).map((m) => ({
    id: m.id,
    title: m.title,
    color: m.color,
    level: m.level,
    desc: m.desc,
    image: m.image || undefined,
    topics: m.topics,
    topicContents: m.topicContents,
    activityContents: m.activityContents,
    teacherNotes: m.teacherNotes,
    topicImages: m.topicImages,
    topicSlides: m.topicSlides,
    videos: m.videos,
    summaryVideos: m.summaryVideos,
    quiz: m.quiz,
  }));

  console.info("[mapRowsToModules] mapped", modules.length, "modules");
  return modules;
}
