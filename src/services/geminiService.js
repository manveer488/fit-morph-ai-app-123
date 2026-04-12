const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_BACKUP = import.meta.env.VITE_GEMINI_API_KEY_BACKUP;
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_FALLBACK_MODEL = "gemini-2.5-flash";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isQuotaError = (msg, status) =>
  status === "RESOURCE_EXHAUSTED" ||
  status === "UNAVAILABLE" ||
  status === 429 ||
  status === 503 ||
  (msg || "").toLowerCase().includes("quota") ||
  (msg || "").toLowerCase().includes("rate limit") ||
  (msg || "").toLowerCase().includes("resource_exhausted") ||
  (msg || "").toLowerCase().includes("high demand") ||
  (msg || "").toLowerCase().includes("spikes in demand") ||
  (msg || "").toLowerCase().includes("overloaded") ||
  (msg || "").toLowerCase().includes("busy");

/**
 * PHASE 1: Vision Analysis & Validation
 */
export async function validateAndAnalyzePhysique(base64Image, userProfile, previousImageBase64 = null) {
  console.log("Phase 1: Strict AI Vision Validation & Analysis started...");
  
  const prompt = `
  You are a professional fitness AI specializing in body transformation tracking and anti-fraud detection.
  
  ### CONTEXT:
  Current User Profile: ${JSON.stringify(userProfile)}
  Previous Image Provided: ${previousImageBase64 ? "YES" : "NO"}
  
  ### TASK 1: VALIDATION
  1. **HUMAN CHECK**: Is this a full-body standing human? If it is just a body part (like an arm/leg) or a non-human object/animal, return Error.
  2. **ORIENTATION CHECK**: Is the person standing straight?

  ### TASK 2: ANALYSIS (Only if validation succeeds)
  Provide a precise vision-based assessment of body fat % and muscle mass kg.

  ### OUTPUT FORMAT (STRICT JSON ONLY):
  {
    "isValid": boolean,
    "errorType": "NONE" | "INVALID_BODY",
    "userMessage": "NONE" | "Upload your full and straight body image.",
    "metrics": {
      "predictedBodyFat": "Number only",
      "predictedMuscleMass": "Number only",
      "physiqueAssessment": "Short professional paragraph (30 words max)."
    }
  }`;

  // If we have two images, we send both in one request for comparison
  const images = previousImageBase64 ? [base64Image, previousImageBase64] : [base64Image];
  return await callGeminiWithRetry(GEMINI_API_KEY, prompt, images);
}

/**
 * PHASE 2: Comprehensive Plan Generation
 */
export async function generateFullFitnessPlan(aiMetrics, userProfile) {
  console.log("Phase 2: Generating Expertise-Driven Transformation Protocols...");
  
  const prompt = `You are an expert fitness coach, certified nutritionist, and sports recovery specialist.
I provide you with my biometric details. Using this data, generate a complete structured plan including:

1. Personalized Workout Plan
- Weekly schedule (7 days)
- Exercise names + sets + reps
- Separate strength, cardio, and mobility sessions
- Progressive overload week by week
- Notes for form, safety, and warm-ups

2. Personalized Diet Plan
- Daily calorie target
- Macro breakdown (protein, carbs, fats)
- Full meal plan (breakfast, lunch, dinner, snacks)
- Hydration goals
- Foods to include and avoid

3. Muscle Recovery Plan
- Post-workout recovery routine
- Sleep optimization
- Stretching + mobility routine
- Supplements (optional)
- Rest day guidelines

### USER BIOMETRICS:
- Muscle Mass: ${aiMetrics.predictedMuscleMass} kg
- Body Fat: ${aiMetrics.predictedBodyFat} %
- Weight: ${userProfile.weight}
- Height: ${userProfile.height}
- Age: ${userProfile.age}
- Fitness Goal: ${userProfile.goal}

### OUTPUT REQUIREMENTS:
Return the plan as a PURE JSON object (NO MARKDOWN).

### JSON SCHEMA:
{
  "summary": "Short summary for quick reference (50 words max)",
  "strategy": "Detailed strategy based on metrics",
  "workoutPlan": [
    // EXACTLY 7 days
    { "day": "Monday", "focus": "X", "exercises": [{"name": "X", "sets": "X", "reps": "X", "formTips": "X"}] }
  ],
  "recoveryPlan": {
    "postWorkout": "X",
    "sleepOptimization": "X",
    "stretchingRoutine": "X",
    "supplements": "X",
    "restGuidelines": "X"
  },
  "mealPlan": {
    "dailyCalories": 2000,
    "macros": {"p": "150g", "c": "200g", "f": "60g"},
    "days": [
      // EXACTLY 7 days
      { 
        "day": "Monday", 
        "meals": {
          "breakfast": {"title": "X", "imageSearchTerm": "X", "recipe": {"ingredients": ["X"], "instructions": ["X"]}},
          "lunch": {"title": "X", "imageSearchTerm": "X", "recipe": {"ingredients": ["X"], "instructions": ["X"]}},
          "snack": {"title": "X", "imageSearchTerm": "X", "recipe": {"ingredients": ["X"], "instructions": ["X"]}},
          "dinner": {"title": "X", "imageSearchTerm": "X", "recipe": {"ingredients": ["X"], "instructions": ["X"]}}
        }
      }
    ],
    "guidelines": { "hydration": "X", "foodsToInclude": ["X"], "foodsToAvoid": ["X"] }
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

// Retries callGemini using exponential backoff to handle temporary demand spikes
async function callGeminiWithRetry(apiKey, prompt, base64Image = null) {
  const MAX_RETRIES = 2; // Reduced from 5 to prevent long hang on quota limits
  let currentDelay = 1000; 

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    // Try primary model twice, then switch to fallback
    const useModel = attempt > 1 ? GEMINI_FALLBACK_MODEL : GEMINI_MODEL;
    
    try {
      return await callGemini(apiKey, prompt, base64Image, useModel);
    } catch (err) {
      if (!err.isQuota) throw err;

      console.warn(`${useModel} busy or limit hit. Attempt ${attempt}/${MAX_RETRIES}. Retrying in ${currentDelay/1000}s...`);
      
      const isLastAttempt = attempt === MAX_RETRIES;
      if (isLastAttempt) {
        if (GEMINI_API_KEY_BACKUP && GEMINI_API_KEY_BACKUP !== apiKey) {
          console.warn("Primary keys exhausted. Trying backup API key with fallback model...");
          try {
            return await callGemini(GEMINI_API_KEY_BACKUP, prompt, base64Image, GEMINI_FALLBACK_MODEL);
          } catch (backupErr) {
            throw backupErr;
          }
        }
        throw new Error("AI servers are experiencing exceptionally high demand. Our systems are overloaded.");
      }

      await sleep(currentDelay);
      currentDelay += 1000;
    }
  }
}

async function callGemini(apiKey, prompt, base64Image = null, model = GEMINI_MODEL) {
  if (!apiKey || apiKey === "undefined") {
    throw new Error("Gemini API Key is NOT configured in Vercel. Please add 'VITE_GEMINI_API_KEY' to your Vercel Environment Variables.");
  }

  // Always use the /gemini proxy path.
  // - In local dev: Vite proxy rewrites /gemini -> https://generativelanguage.googleapis.com
  // - In production (Vercel): vercel.json rewrite handles /gemini -> https://generativelanguage.googleapis.com
  const url = `/gemini/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let body;
  if (base64Image) {
    const images = Array.isArray(base64Image) ? base64Image : [base64Image];
    const imageParts = images.map(img => {
      const raw = img.includes('base64,') ? img.split('base64,')[1] : img;
      return { inline_data: { mime_type: "image/jpeg", data: raw } };
    });

    body = {
      contents: [{
        parts: [
          { text: prompt },
          ...imageParts
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
    console.error(`Gemini API Error Response (${model}):`, data);
    const errMsg = data.error?.message || "";
    const status = data.error?.status || response.status;
    
    // Detect quota exceeded and high demand errors specifically
    if (isQuotaError(errMsg, status)) {
      const err = new Error(`AI model ${model} busy: ` + (errMsg || "High Demand"));
      err.isQuota = true;
      throw err;
    }
    
    throw new Error(errMsg || "Gemini AI request failed");
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from AI");

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    
    // Normalize metrics and validation fields
    const cleanMetric = (val) => val ? val.toString().replace(/[^\d.]/g, '') : "---";

    const normalizedData = {
      // Include validation fields if present (from Phase 1 prompt)
      isValid: parsedData.isValid ?? true, 
      userMessage: parsedData.userMessage || "NONE",
      errorType: parsedData.errorType || "NONE",

      // Combined Metrics
      metrics: parsedData.metrics || {
        predictedBodyFat: cleanMetric(parsedData.predictedBodyFat || parsedData.bodyFat),
        predictedMuscleMass: cleanMetric(parsedData.predictedMuscleMass || parsedData.muscleMass),
        physiqueAssessment: parsedData.physiqueAssessment || parsedData.assessment || ""
      },
      
      // Fallback for screens expecting 'aiAnalysis'
      aiAnalysis: parsedData.aiAnalysis || {
        predictedBodyFat: cleanMetric(parsedData.predictedBodyFat || parsedData.bodyFat),
        predictedMuscleMass: cleanMetric(parsedData.predictedMuscleMass || parsedData.muscleMass),
        physiqueAssessment: parsedData.physiqueAssessment || parsedData.assessment || ""
      },
      
      strategy: parsedData.strategy || "Maintain consistency.",
      summary: parsedData.summary || "Transformation roadmap synchronized.",
      workoutPlan: parsedData.workoutPlan || parsedData.workout || [],
      recoveryPlan: parsedData.recoveryPlan || {},
      mealPlan: parsedData.mealPlan || parsedData.dietPlan || parsedData.diet || { days: [], guidelines: {} }
    };

    // Store globally for quick access
    if (!window.fitmorphData) window.fitmorphData = {};
    Object.assign(window.fitmorphData, normalizedData);
    
    return normalizedData;
  } catch (e) {
    console.error("Failed to process Gemini response:", e, text);
    throw new Error("Invalid AI response format. Please try again.");
  }
}

