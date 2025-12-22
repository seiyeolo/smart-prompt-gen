import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to convert a File object to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

export async function generateContent(prompt, options = {}) {
  // Use only the provided API key from options.
  const activeApiKey = options.apiKey;

  if (!activeApiKey) {
    throw new Error("API Key가 없습니다. 설정 메뉴에서 본인의 Gemini API 키를 입력해주세요.");
  }

  const genAI = new GoogleGenerativeAI(activeApiKey);
  // Using gemini-2.0-flash-exp as per user's interest in latest models, falling back to 1.5-flash if needed
  // Note: For stability, we might use gemini-1.5-flash generally, but let's try a standard model first.
  // Using 'gemini-1.5-flash' for speed and cost-effectiveness for free tier.
  // Determine model from options
  // Determine model from options
  // Updated model map (verified against official docs: ai.google.dev/gemini-api/docs/models)
  // Last verified: 2025-12-22
  const modelMap = {
    'flash-2.5': "gemini-2.5-flash",           // Stable (GA June 2025)
    'pro-2.5': "gemini-2.5-pro",               // Stable (GA June 2025)
    'flash-preview': "gemini-3-flash-preview", // Preview (Dec 2025)
    'pro-preview': "gemini-3-pro-preview"      // Preview (Nov 2025)
  };

  const modelName = modelMap[options.model] || "gemini-3-flash-preview";

  // Deprecation check for legacy models
  if (options.model === 'flash-2.5') {
    const deprecationDate = new Date('2026-01-15');
    if (new Date() > deprecationDate) {
      throw new Error("This model (Gemini 2.5 Flash) has been deprecated as of Jan 15, 2026. Please select a newer model.");
    }
  }
    
  const model = genAI.getGenerativeModel({ model: modelName });

  try {
    let contentParts = [prompt];
    
    if (options.image) {
      if (options.image instanceof File) {
         const imagePart = await fileToGenerativePart(options.image);
         contentParts.push(imagePart);
      } else {
         console.warn("Provided image option is not a File object:", options.image);
      }
    }

    const result = await model.generateContent(contentParts);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Include specific error message for easier debugging
    throw new Error(`Failed to generate content: ${error.message || "Unknown error"}`);
  }
}
