const Groq = require("groq-sdk");
const Review = require("../models/Review");
const User = require("../models/User");

if (!process.env.GROQ_API_KEY) {
  console.error("❌ FATAL: GROQ_API_KEY is missing from .env");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

    const prompt = buildPrompt(code, language);

    // ── Call Groq API ──────────────────────────────────────────────────────
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2048,
    });

    const rawText = chatCompletion.choices[0]?.message?.content || "";

    console.log("=== RAW GROQ RESPONSE ===");
    console.log(rawText.substring(0, 500));
    console.log("=========================");

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

    if (!process.env.GROQ_API_KEY || error.message?.includes("api_key") || error.message?.includes("Authentication")) {
      return res.status(500).json({ message: "❌ GROQ_API_KEY is missing or invalid in your .env file." });
    }
    if (error.status === 429 || error.message?.includes("rate_limit")) {
      return res.status(429).json({ message: "⚠️ Groq rate limit hit. Please wait a moment and try again." });
    }
    if (error.message?.includes("fetch") || error.message?.includes("ECONNREFUSED")) {
      return res.status(500).json({ message: "❌ Could not reach Groq API. Check your internet connection." });
    }

    res.status(500).json({ message: "AI review failed: " + error.message });
  }
};

module.exports = { analyzeCode };