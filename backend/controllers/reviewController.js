const { GoogleGenerativeAI } = require("@google/generative-ai");
const Review = require("../models/Review");
const User = require("../models/User");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ FATAL: GEMINI_API_KEY is missing from .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildPrompt = (code, language) => `
You are an expert code reviewer. Analyze the following ${language} code.

IMPORTANT: Your entire response must be a single valid JSON object.
Do NOT include any text before or after the JSON.
Do NOT wrap it in markdown code fences or backticks.
Start your response with { and end with }.

Code to review:
${code}

Use this exact JSON structure:
{
  "summary": "Brief overall assessment in 2-3 sentences",
  "score": 75,
  "issues": [
    {
      "line": 1,
      "type": "bug",
      "message": "Description of the issue",
      "fix": "How to fix it"
    }
  ],
  "complexity": {
    "time": "O(n)",
    "space": "O(1)",
    "explanation": "Brief explanation"
  },
  "improvements": ["Improvement 1", "Improvement 2"],
  "goodPractices": ["Good thing 1", "Good thing 2"]
}

Rules:
- "score" must be a plain integer (0-100), no quotes
- "line" must be an integer or null, no quotes
- "type" must be one of: bug, warning, suggestion, info
- All arrays can be empty [] if nothing to report
- Response must be valid JSON parseable by JSON.parse()
`;

// @desc Analyze code with AI
const analyzeCode = async (req, res) => {
  try {
    const { code, language, title } = req.body;

    if (!code || !language)
      return res.status(400).json({ message: "Code and language are required" });

    if (code.length > 10000)
      return res.status(400).json({ message: "Code too long. Max 10,000 characters." });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = buildPrompt(code, language);

    // ── Retry logic for 429 rate limiting ──────────────────────────────────
    let result;
    let attempts = 0;
    while (attempts < 3) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err) {
        if ((err.status === 429 || err.message?.includes("RESOURCE_EXHAUSTED")) && attempts < 2) {
          attempts++;
          const waitSec = attempts * 5;
          console.log(`⚠️  Rate limited by Gemini. Retrying in ${waitSec}s... (attempt ${attempts}/3)`);
          await sleep(waitSec * 1000);
        } else {
          throw err;
        }
      }
    }

    const rawText = result.response.text();

    console.log("=== RAW GEMINI RESPONSE ===");
    console.log(rawText.substring(0, 500));
    console.log("===========================");

    // ── Parse AI response ──────────────────────────────────────────────────
    let parsed;
    try {
      // Strategy 1: Strip markdown fences
      let cleaned = rawText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      // Strategy 2: Extract first { ... } block if extra text present
      if (!cleaned.startsWith("{")) {
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start !== -1 && end !== -1) {
          cleaned = cleaned.substring(start, end + 1);
        }
      }

      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr.message);
      console.error("Raw text was:", rawText);
      return res.status(500).json({
        message: "AI returned an unexpected format. Please try again.",
        debug: rawText.substring(0, 300),
      });
    }

    // ── Save to DB ─────────────────────────────────────────────────────────
    const review = await Review.create({
      user: req.user._id,
      title: title || `${language} Review`,
      code,
      language,
      summary: parsed.summary,
      score: parsed.score,
      issues: parsed.issues || [],
      complexity: parsed.complexity || {},
      improvements: parsed.improvements || [],
      goodPractices: parsed.goodPractices || [],
      rawAIResponse: rawText,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { reviewCount: 1 } });

    res.status(201).json(review);
  } catch (error) {
    console.error("=== REVIEW ERROR ===");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Stack:", error.stack?.split("\n")[1]);

    if (!process.env.GEMINI_API_KEY || error.message?.includes("API_KEY")) {
      return res.status(500).json({ message: "❌ GEMINI_API_KEY is missing or invalid in your .env file." });
    }
    if (error.status === 429 || error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({ message: "⚠️ Gemini rate limit hit after 3 retries. Please wait 1 minute and try again." });
    }
    if (error.status === 404 || error.message?.includes("not found") || error.message?.includes("MODEL")) {
      return res.status(500).json({ message: "❌ Gemini model not found. Check model name in reviewController.js." });
    }
    if (error.message?.includes("fetch") || error.message?.includes("ECONNREFUSED")) {
      return res.status(500).json({ message: "❌ Could not reach Gemini API. Check your internet connection." });
    }

    res.status(500).json({ message: "AI review failed: " + error.message });
  }
};

module.exports = { analyzeCode };