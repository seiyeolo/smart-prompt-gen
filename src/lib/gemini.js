import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
  // Use the provided API key from options, or fall back to the env variable
  const activeApiKey = options.apiKey || API_KEY;

  if (!activeApiKey) {
    throw new Error("API Key가 없습니다. 설정에서 키를 입력하거나 .env 파일을 확인해주세요.");
  }

  const genAI = new GoogleGenerativeAI(activeApiKey);
  // Using gemini-2.0-flash-exp as per user's interest in latest models, falling back to 1.5-flash if needed
  // Note: For stability, we might use gemini-1.5-flash generally, but let's try a standard model first.
  // Using 'gemini-1.5-flash' for speed and cost-effectiveness for free tier.
  // Determine model from options
  const modelMap = {
    'flash-2.5': "gemini-2.5-flash-preview-09-2025",
    'pro-2.5': "gemini-2.5-pro",
    'flash-preview': "gemini-3-flash-preview",
    'pro-preview': "gemini-3-pro-preview"
  };

  const modelName = modelMap[options.model] || "gemini-2.5-flash-preview-09-2025";
    
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
