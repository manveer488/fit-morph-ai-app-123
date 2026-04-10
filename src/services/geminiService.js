const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_BACKUP = import.meta.env.VITE_GEMINI_API_KEY_BACKUP;
const GEMINI_MODEL = "gemini-2.5-flash"; // gemini-2.0 series has 0 free-tier quota for this project/region

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isQuotaError = (msg, status) =>
  status === "RESOURCE_EXHAUSTED" ||
  (msg || "").toLowerCase().includes("quota") ||
  (msg || "").toLowerCase().includes("rate limit") ||
  (msg || "").toLowerCase().includes("resource_exhausted");

/**
 * PHASE 1: Vision Analysis
 */
export async function analyzePhysique(scanData, userProfile, base64Image) {
  console.log("Phase 1: Real AI Vision Scan started...");
  
  const prompt = `
Analyze this user's physique based on the uploaded image and profile:
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Height: ${userProfile.height}
- Weight: ${userProfile.weight}

TASK: Provide a precise vision-based assessment.
OUTPUT FORMAT (JSON ONLY):
{
  "predictedBodyFat": "Number only",
  "predictedMuscleMass": "Number only",
  "physiqueAssessment": "Short professional paragraph (30 words max)."
}`;

  return await callGeminiWithRetry(GEMINI_API_KEY, prompt, base64Image);
}

/**
 * PHASE 2: Comprehensive Plan Generation
 */
export async function generateFullFitnessPlan(aiMetrics, userProfile) {
  console.log("Phase 2: Generating Expertise-Driven Transformation Protocols...");
  
  const prompt = `You are an expert fitness coach, nutritionist, and body-transformation specialist.
Generate a highly personalized Workout Plan + Diet Plan based only on the data I provide.

### USER INPUT:
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Height: ${userProfile.height}
- Weight: ${userProfile.weight}
- Muscle Mass: ${aiMetrics.predictedMuscleMass} kg
- Body Fat: ${aiMetrics.predictedBodyFat} %
- Fitness Goal: ${userProfile.goal} (examples: fat loss, muscle gain, recomposition)
- Activity Level: ${userProfile.activityLevel || 'active'}

### OUTPUT FORMAT (JSON ONLY, NO MARKDOWN, NO \`\`\`json FORMATTING):
{
  "strategy": "Current body condition, metabolic status, and main areas to improve.",
  "summary": { "targetBodyFat": "X%", "expectedWeeklyProgress": "X", "roadmap30Day": "Brief roadmap" },
  "workoutPlan": [
    // Provide a precise 7-Day Workout Plan
    { "day": "Monday", "focus": "Main goal", "exercises": [{ "name": "exercise name", "sets": "3", "reps": "10", "formTips": "Target muscle groups and optional home-friendly alternative." }] },
    { "day": "Tuesday", "focus": "Main goal", "exercises": [{ "name": "exercise name", "sets": "3", "reps": "10", "formTips": "Target muscle groups and optional home-friendly alternative." }] },
    { "day": "Wednesday", "focus": "Main goal", "exercises": [{ "name": "exercise name", "sets": "3", "reps": "10", "formTips": "Target muscle groups and optional home-friendly alternative." }] },
    { "day": "Thursday", "focus": "Main goal", "exercises": [{ "name": "exercise name", "sets": "3", "reps": "10", "formTips": "Target muscle groups and optional home-friendly alternative." }] },
    { "day": "Friday", "focus": "Main goal", "exercises": [{ "name": "exercise name", "sets": "3", "reps": "10", "formTips": "Target muscle groups and optional home-friendly alternative." }] },
    { "day": "Saturday", "focus": "Main goal", "exercises": [{ "name": "exercise name", "sets": "3", "reps": "10", "formTips": "Target muscle groups and optional home-friendly alternative." }] },
    { "day": "Sunday", "focus": "Main goal", "exercises": [{ "name": "exercise name", "sets": "3", "reps": "10", "formTips": "Target muscle groups and optional home-friendly alternative." }] }
  ],
  "muscleFocusPlan": [
    // Provide deep breakdown on muscle engagement
    { "day": "Monday", "focus": "X", "exercises": [{ "name": "exercise name", "sets": "3", "reps": "10", "formTips": "Target muscle groups and optional home-friendly alternative." }] }
  ],
  "recoveryPlan": [
    // Muscle Recovery Plan (24-Hour Recovery Steps, 72-Hour Plan, Sleep Tips, Nutrition for Faster Recovery, Safe Optional Supplements)
    { "day": "Tuesday", "focus": "Recovery", "exercises": [{ "name": "Foam rolling", "sets": "1", "reps": "10min", "formTips": "Hydration and sleep tips" }] },
    { "day": "Sunday", "focus": "Rest", "exercises": [{ "name": "Stretching", "sets": "1", "reps": "15min", "formTips": "Mobility work" }]}
  ],
  "mealPlan": {
    "days": [
      // Full 7-Day Personalized Diet Plan
      { "day": "Monday", "calories": 2000, "macros": { "p": "150g", "c": "200g", "f": "65g" }, 
        "meals": { 
          "breakfast": { "title": "Breakfast Name", "imageSearchTerm": "breakfast food photography", "recipe": { "ingredients": ["Quick cooking / Indian food alternative ingredients..."], "instructions": ["Calories + macros..."] } }, 
          "snack1": { "title": "Snack", "imageSearchTerm": "healthy snack", "recipe": { "ingredients": ["..."], "instructions": ["..."] } },
          "lunch": { "title": "Lunch Name", "imageSearchTerm": "lunch healthy meal", "recipe": { "ingredients": ["..."], "instructions": ["..."] } }, 
          "snack2": { "title": "Snack", "imageSearchTerm": "healthy snack", "recipe": { "ingredients": ["..."], "instructions": ["..."] } },
          "dinner": { "title": "Dinner Name", "imageSearchTerm": "dinner healthy meal", "recipe": { "ingredients": ["..."], "instructions": ["..."] } } 
        } 
      },
      // Repeat for Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
      { "day": "Tuesday", "calories": 2000, "macros": { "p": "150g", "c": "200g", "f": "65g" }, 
        "meals": { "breakfast": {}, "lunch": {}, "dinner": {} }
      }
    ],
    "guidelines": { "hydration": "Recommended water intake.", "avoid": ["bad options"], "supplements": "Safe + optional supplements.", "sleepTips": "Recovery guidelines." }
  }
}`;


  return await callGeminiWithRetry(GEMINI_API_KEY, prompt);
}

// Deprecated: Keeping for compatibility
export async function generateTransformationPlan(scanData, userProfile, base64Image = null) {
  if (base64Image) {
    const metricsResult = await analyzePhysique(scanData, userProfile, base64Image);
    const metrics = metricsResult.aiAnalysis || metricsResult;
    return await generateFullFitnessPlan(metrics, userProfile);
  }
  return await generateFullFitnessPlan(scanData, userProfile);
}

// Retries callGemini up to 3 times on quota/rate-limit errors, with a 12s wait between each.
// Falls back to backup key if primary key is exhausted.
async function callGeminiWithRetry(apiKey, prompt, base64Image = null) {
  const MAX_RETRIES = 2;
  const RETRY_DELAY_MS = 12000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await callGemini(apiKey, prompt, base64Image);
    } catch (err) {
      const isQuota = err.message.includes("AI servers busy");
      const isLastAttempt = attempt === MAX_RETRIES;

      if (!isQuota) throw err; // Non-quota errors → fail immediately

      if (isLastAttempt) {
        // Try backup key before giving up
        if (GEMINI_API_KEY_BACKUP && GEMINI_API_KEY_BACKUP !== apiKey) {
          console.warn("Primary key exhausted. Trying backup API key...");
          try {
            return await callGemini(GEMINI_API_KEY_BACKUP, prompt, base64Image);
          } catch (backupErr) {
            throw backupErr; // Both keys failed
          }
        }
        throw err;
      }

      console.warn(`Quota hit. Auto-retrying in ${RETRY_DELAY_MS / 1000}s... (Attempt ${attempt}/${MAX_RETRIES})`);
      await sleep(RETRY_DELAY_MS);
    }
  }
}

async function callGemini(apiKey, prompt, base64Image = null) {
  if (!apiKey || apiKey === "undefined") {
    throw new Error("Gemini API Key is NOT configured in Vercel. Please add 'VITE_GEMINI_API_KEY' to your Vercel Environment Variables.");
  }

  // Always use the /gemini proxy path.
  // - In local dev: Vite proxy rewrites /gemini -> https://generativelanguage.googleapis.com
  // - In production (Vercel): vercel.json rewrite handles /gemini -> https://generativelanguage.googleapis.com
  const url = `/gemini/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  let body;
  if (base64Image) {
    // Strip prefix if present
    const rawBase64 = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;
    body = {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: "image/jpeg", data: rawBase64 } }
        ]
      }]
    };
  } else {
    body = { contents: [{ parts: [{ text: prompt }] }] };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Gemini API Error Response:", data);
    const errMsg = data.error?.message || "";
    const status = data.error?.status || "";
    // Detect quota exceeded errors specifically
    if (
      status === "RESOURCE_EXHAUSTED" ||
      errMsg.toLowerCase().includes("quota") ||
      errMsg.toLowerCase().includes("rate limit") ||
      errMsg.toLowerCase().includes("resource_exhausted")
    ) {
      throw new Error("AI servers busy. Please try again in 10 seconds.");
    }
    throw new Error(errMsg || "Gemini AI request failed");
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from AI");

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    
    // Normalize metrics
    const cleanMetric = (val) => val ? val.toString().replace(/[^\d.]/g, '') : "---";

    const normalizedData = {
      aiAnalysis: parsedData.aiAnalysis || {
        predictedBodyFat: cleanMetric(parsedData.predictedBodyFat || parsedData.bodyFat),
        predictedMuscleMass: cleanMetric(parsedData.predictedMuscleMass || parsedData.muscleMass),
        physiqueAssessment: parsedData.physiqueAssessment || parsedData.assessment
      },
      strategy: parsedData.strategy || "Maintain consistency.",
      summary: parsedData.summary || {},
      workoutPlan: parsedData.workoutPlan || parsedData.workout || [],
      muscleFocusPlan: parsedData.muscleFocusPlan || [],
      recoveryPlan: parsedData.recoveryPlan || [],
      mealPlan: parsedData.mealPlan || parsedData.dietPlan || parsedData.diet || { days: [], guidelines: {} }
    };

    // Edge case: if metrics are nested directly at the top level
    if (!parsedData.aiAnalysis && (parsedData.predictedBodyFat || parsedData.bodyFat)) {
      normalizedData.aiAnalysis = {
        predictedBodyFat: cleanMetric(parsedData.predictedBodyFat || parsedData.bodyFat),
        predictedMuscleMass: cleanMetric(parsedData.predictedMuscleMass || parsedData.muscleMass),
        physiqueAssessment: parsedData.physiqueAssessment || parsedData.assessment
      };
    }

    // Store globally for quick access
    if (!window.fitmorphData) window.fitmorphData = {};
    Object.assign(window.fitmorphData, normalizedData);
    
    return normalizedData;
  } catch (e) {
    console.error("Failed to process Gemini response:", e, text);
    throw new Error("Invalid AI response format. Please try again.");
  }
}

