const GEMINI_API_KEY = "AIzaSyDSPuZ9TE5TKgfXs1L3eXYB5S89ptBMKIk";

export async function generateAIPlan(promptText) {
  try {
    // Using the /gemini proxy defined in vite.config.js
    const response = await fetch(
      `/gemini/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Response:", errorText);
      throw new Error("Gemini API failed");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("AI Generation Error:", err);
    throw err;
  }
}
