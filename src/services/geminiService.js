const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash-lite"; // Lower quota usage than gemini-2.0-flash

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

  return await callGemini(GEMINI_API_KEY, prompt, base64Image);
}

/**
 * PHASE 2: Comprehensive Plan Generation
 */
export async function generateFullFitnessPlan(aiMetrics, userProfile) {
  console.log("Phase 2: Generating Expertise-Driven Transformation Protocols...");
  
  const prompt = `
As an expert coach, create a 7-day protocol based on these confirmed metrics:
- Body Fat: ${aiMetrics.predictedBodyFat}%
- Muscle Mass: ${aiMetrics.predictedMuscleMass}kg
- Goal: ${userProfile.goal}

TASKS:
1. Standard Workout (7 days)
2. Muscle Focus Plan (7 days)
3. Muscle Recovery Plan (7 days)
4. Meal Plan (7 days with calories, macros, and concise recipes)

OUTPUT FORMAT (JSON ONLY):
{
  "strategy": "Overall approach",
  "summary": { "targetBodyFat": "...", "expectedWeeklyProgress": "...", "roadmap30Day": "..." },
  "workoutPlan": [ { "day": "...", "focus": "...", "exercises": [ { "name": "...", "sets": "...", "reps": "...", "imageSearchTerm": "...", "formTips": "..." } ] } ],
  "muscleFocusPlan": [ { "day": "...", "focus": "...", "exercises": [ { "name": "...", "sets": "...", "reps": "...", "imageSearchTerm": "...", "formTips": "..." } ] } ],
  "recoveryPlan": [ { "day": "...", "focus": "...", "exercises": [ { "name": "...", "sets": "...", "reps": "...", "imageSearchTerm": "...", "formTips": "..." } ] } ],
  "mealPlan": {
    "days": [ { "day": "...", "calories": "...", "macros": { "p": "...", "c": "...", "f": "..." }, "meals": { "breakfast": { "title": "...", "imageSearchTerm": "...", "recipe": { "ingredients": ["..."], "instructions": ["..."] } }, "lunch": { ... }, "dinner": { ... } } } ],
    "guidelines": { "hydration": "...", "avoid": ["..."] }
  }
}
Keep it professional. Monday-Sunday. JSON only.`;

  return await callGemini(GEMINI_API_KEY, prompt);
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

async function callGemini(apiKey, prompt, base64Image = null) {
  if (!apiKey || apiKey === "undefined") {
    throw new Error("Gemini API Key is NOT configured in Vercel. Please add 'VITE_GEMINI_API_KEY' to your Vercel Environment Variables.");
  }

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

