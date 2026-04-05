const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_BACKUP = import.meta.env.VITE_GEMINI_API_KEY_BACKUP;

const GEMINI_MODEL = "gemini-2.0-flash"; 

/**
 * PHASE 1: Vision Analysis
 * Extracts body metrics (body fat, muscle mass, assessment) from the photo.
 * This is designed to be fast to prevent timeouts.
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

  try {
    const response = await callGemini(GEMINI_API_KEY, prompt, base64Image);
    return response.aiAnalysis || response;
  } catch (error) {
    if (GEMINI_API_KEY_BACKUP) {
      const response = await callGemini(GEMINI_API_KEY_BACKUP, prompt, base64Image);
      return response.aiAnalysis || response;
    }
    throw error;
  }
}

/**
 * PHASE 2: Comprehensive Plan Generation
 * Generates the full 7-day protocols based on established metrics.
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

  try {
    return await callGemini(GEMINI_API_KEY, prompt);
  } catch (error) {
    if (GEMINI_API_KEY_BACKUP) {
      return await callGemini(GEMINI_API_KEY_BACKUP, prompt);
    }
    throw error;
  }
}

// Deprecated: Keeping for compatibility but internally using the split approach if needed
export async function generateTransformationPlan(scanData, userProfile, base64Image = null) {
  if (base64Image) {
    const metrics = await analyzePhysique(scanData, userProfile, base64Image);
    return await generateFullFitnessPlan(metrics, userProfile);
  }
  return await generateFullFitnessPlan(scanData, userProfile);
}

async function callGemini(apiKey, prompt, base64Image = null) {
  if (!apiKey || apiKey === "undefined") {
    // This is the most common reason for crashes on Vercel
    throw new Error("Gemini API Key is NOT configured in Vercel. Please add 'VITE_GEMINI_API_KEY' to your Vercel Environment Variables.");
  }

  // Use the proxied URL for consistency in dev and production (Vercel Rewrite)
  const url = `/gemini/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  if (base64Image) {
    // IMPORTANT: Gemini API expects raw base64 string, NOT a Data URL.
    // Strip the prefix (e.g., 'data:image/jpeg;base64,') if present.
    const rawBase64 = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;

    const body = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: rawBase64
            }
          }
        ]
      }]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini API Error Response:", data);
      throw new Error(data.error?.message || "Gemini AI request failed");
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from AI");

    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    
    // Normalize metrics
    const cleanMetric = (val) => val ? val.toString().replace(/[^\d.]/g, '') : "---";

    const normalizedData = {
      aiAnalysis: parsedData.aiAnalysis || {
        predictedBodyFat: cleanMetric(parsedData.predictedBodyFat),
        predictedMuscleMass: cleanMetric(parsedData.predictedMuscleMass),
        physiqueAssessment: parsedData.physiqueAssessment
      },
      strategy: parsedData.strategy || "Maintain consistency.",
      summary: parsedData.summary || {},
      workoutPlan: parsedData.workoutPlan || parsedData.workout || [],
      muscleFocusPlan: parsedData.muscleFocusPlan || [],
      recoveryPlan: parsedData.recoveryPlan || [],
      mealPlan: parsedData.mealPlan || parsedData.dietPlan || parsedData.diet || { days: [], guidelines: {} }
    };

    // Store globally for quick access
    if (!window.fitmorphData) window.fitmorphData = {};
    Object.assign(window.fitmorphData, normalizedData);
    
    return normalizedData;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API Error Response:", errorText);
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  
  try {
    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    
    // Normalize metrics
    const cleanMetric = (val) => val ? val.toString().replace(/[^\d.]/g, '') : "---";

    const normalizedData = {
      aiAnalysis: parsedData.aiAnalysis || {
        predictedBodyFat: cleanMetric(parsedData.predictedBodyFat),
        predictedMuscleMass: cleanMetric(parsedData.predictedMuscleMass),
        physiqueAssessment: parsedData.physiqueAssessment
      },
      strategy: parsedData.strategy || "Maintain consistency.",
      summary: parsedData.summary || {},
      workoutPlan: parsedData.workoutPlan || parsedData.workout || [],
      muscleFocusPlan: parsedData.muscleFocusPlan || [],
      recoveryPlan: parsedData.recoveryPlan || [],
      mealPlan: parsedData.mealPlan || parsedData.dietPlan || parsedData.diet || { days: [], guidelines: {} }
    };

    // Store globally for quick access
    if (!window.fitmorphData) window.fitmorphData = {};
    Object.assign(window.fitmorphData, normalizedData);
    
    return normalizedData;
  } catch (e) {
    console.error("Failed to process Gemini response:", e, data);
    throw new Error("Invalid AI response format. Please try again.");
  }
}

