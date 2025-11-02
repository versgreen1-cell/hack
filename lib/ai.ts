interface AltTextResponse {
  accessible: string;
  short: string;
  seo: string;
}

/**
 * Generates deterministic placeholder alt text based on filename
 */
export function generatePlaceholderAltText(filename: string): AltTextResponse {
  const name = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  const words = name.split(/\s+/).filter(Boolean);
  
  return {
    accessible: `An image showing ${words.join(" ") || "content"}.`,
    short: words.slice(0, 8).join(" ") || "Image",
    seo: `${words.join(" ")} image.`,
  };
}

/**
 * Calls Ollama Vision API to generate alt text variants
 * Requires Ollama to be running locally with a vision model like llava
 */
export async function generateAltTextWithVision(
  base64Image: string,
  mimeType: string
): Promise<AltTextResponse> {
  const ollamaUrl = process.env.OLLAMA_API_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llava";

  const prompt = `Analyze this image and return strict JSON with keys:
- accessible (<=1 sentence, helpful for screen readers)
- short (<=8 words)
- seo (<=1 sentence with relevant nouns)

Return ONLY valid JSON, no markdown, no extra text.`;

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        images: [base64Image],
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 200,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${error}`);
    }

    const data = await response.json();
    const content = data.response?.trim();

    if (!content) {
      throw new Error("No content returned from Ollama");
    }

    // Try to extract JSON from response (might be wrapped in markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    // Also try to find JSON object in the text
    const jsonObjectMatch = content.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch && !jsonMatch) {
      jsonStr = jsonObjectMatch[0];
    }

    try {
      const parsed = JSON.parse(jsonStr);
      
      // Validate structure
      if (
        typeof parsed.accessible === "string" &&
        typeof parsed.short === "string" &&
        typeof parsed.seo === "string"
      ) {
        return {
          accessible: parsed.accessible.trim(),
          short: parsed.short.trim(),
          seo: parsed.seo.trim(),
        };
      }
      
      throw new Error("Invalid response structure");
    } catch (parseError) {
      throw new Error(`Failed to parse JSON: ${parseError}`);
    }
  } catch (error) {
    // If Ollama is not available, check if it's a connection error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Ollama is not running. Please start Ollama and ensure a vision model is installed (e.g., `ollama pull llava`)"
      );
    }
    throw error;
  }
}

