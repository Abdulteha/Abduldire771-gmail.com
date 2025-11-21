import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a cat image and a backstory based on a prompt.
 */
export const generateCatContent = async (userPrompt: string): Promise<{ imageUrl: string; name: string; description: string }> => {
  try {
    // 1. Generate the Image
    // We use the specialized image model.
    const imageModel = 'gemini-2.5-flash-image';
    const enhancedImagePrompt = `A photorealistic, high-quality, cute photo of a cat matching this description: ${userPrompt}. 
    Ensure the cat is the main subject.`;

    const imageResponse = await ai.models.generateContent({
      model: imageModel,
      contents: enhancedImagePrompt,
      config: {
        // We don't need system instructions for simple image generation here
        temperature: 0.9, 
      }
    });

    let imageUrl = '';
    
    // Extract image from response
    if (imageResponse.candidates && imageResponse.candidates[0].content.parts) {
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break; // Found the image
        }
      }
    }

    if (!imageUrl) {
      throw new Error("Failed to generate image data.");
    }

    // 2. Generate the Text Details (Name & Backstory)
    // We use the text model for creative writing.
    const textModel = 'gemini-2.5-flash';
    const textPrompt = `
      Based on the concept of a cat described as: "${userPrompt}", generate a JSON object with two fields:
      1. "name": A creative, cute name for this specific cat.
      2. "description": A short, 2-sentence whimsical backstory or personality description.
      Return ONLY valid JSON.
    `;

    const textResponse = await ai.models.generateContent({
      model: textModel,
      contents: textPrompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const textData = JSON.parse(textResponse.text || '{}');
    
    return {
      imageUrl,
      name: textData.name || 'Unknown Kitty',
      description: textData.description || 'A mysterious cat appeared from the void.'
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
