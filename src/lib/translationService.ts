/**
 * Simple translation service using free Google Translate GTX endpoint.
 * This does not require an API key.
 */

export interface TranslationResult {
  text: string;
  sourceLang: string;
  targetLang: string;
}

const GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single";

export const translateText = async (
  text: string,
  from: string = "auto",
  to: string = "ne"
): Promise<string> => {
  if (!text.trim()) return "";

  try {
    const params = new URLSearchParams({
      client: "gtx",
      sl: from,
      tl: to,
      dt: "t",
      q: text,
    });

    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Google Translate GTX response format: [[["translated_text", "original_text", null, null, 1]], null, "source_lang"]
    if (data && data[0]) {
      const translatedParts = data[0].map((part: any) => part[0]);
      return translatedParts.join(" ");
    }

    throw new Error("Invalid response format from translation service");
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text on error
  }
};
