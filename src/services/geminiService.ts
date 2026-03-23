import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export interface PromptOptions {
  gender?: string;
  expression?: string;
  shotType?: string;
  cameraAngle?: string;
  pose?: string;
  background?: string;
  artStyle?: string;
  lighting?: string;
  colorTone?: string;
  additionalDescription?: string;
  mainImage?: string; // base64
  mainImageMimeType?: string;
  faceImage?: string; // base64
  faceImageMimeType?: string;
}

export async function generateImagePrompt(options: PromptOptions) {
  const { 
    gender, expression, shotType, cameraAngle, pose, 
    background, artStyle, lighting, colorTone, additionalDescription,
    mainImage, mainImageMimeType, faceImage, faceImageMimeType 
  } = options;

  const systemInstruction = `You are an expert prompt engineer for AI image generators. 
Your task is to analyze the provided images (if any) and combine them with the user's selected options to create a high-quality, detailed English prompt for image generation.

If images are provided:
- Analyze the character's appearance, clothing, and features from the main image.
- If a face image is provided, focus on the facial details and expressions.

Incorporate the following parameters into the prompt:
- Gender/Character Type
- Facial Expression
- Shot Type (e.g., full body, close up)
- Camera Angle
- Character Pose
- Background/Location
- Art Style
- Lighting
- Color Tone
- Any additional descriptions provided by the user.

Output ONLY the final prompt text in English. Do not include any preamble or explanations.`;

  const parts: any[] = [];

  if (mainImage && mainImageMimeType) {
    parts.push({
      inlineData: {
        mimeType: mainImageMimeType,
        data: mainImage.split(',')[1],
      },
    });
  }

  if (faceImage && faceImageMimeType) {
    parts.push({
      inlineData: {
        mimeType: faceImageMimeType,
        data: faceImage.split(',')[1],
      },
    });
  }

  const promptText = `Generate a professional image generation prompt based on these settings:
- Gender: ${gender || 'Not specified'}
- Expression: ${expression || 'Not specified'}
- Shot Type: ${shotType || 'Not specified'}
- Camera Angle: ${cameraAngle || 'Not specified'}
- Pose: ${pose || 'Not specified'}
- Background: ${background || 'Not specified'}
- Art Style: ${artStyle || 'Not specified'}
- Lighting: ${lighting || 'Not specified'}
- Color Tone: ${colorTone || 'Not specified'}
- Additional Info: ${additionalDescription || 'None'}

Ensure the prompt is detailed and optimized for high-quality AI image generation.`;

  parts.push({ text: promptText });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  return response.text || "Failed to generate prompt.";
}
