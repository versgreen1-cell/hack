import { NextRequest, NextResponse } from "next/server";
import { generateAltTextWithVision, generatePlaceholderAltText } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base64, mimeType, filename } = body;

    if (!base64 || !mimeType) {
      return NextResponse.json(
        { error: "Missing base64 or mimeType" },
        { status: 400 }
      );
    }

    let result;

    // Try Ollama with retry logic
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        result = await generateAltTextWithVision(base64, mimeType);
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        // If JSON parsing failed and we have another attempt, retry
        if (attempt === 0 && lastError.message.includes("parse")) {
          continue;
        }
      }
    }

    // Fallback to placeholder if Ollama fails or isn't available
    if (!result && lastError) {
      const fallbackFilename = filename || "image";
      result = generatePlaceholderAltText(fallbackFilename);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Alt text generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate alt text",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

