export function buildPrompt(options) {
  const { 
    input, 
    aspectRatio, 
    selectedSubjects, 
    selectedFormats, 
    selectedArtStyles, 
    selectedExpressions, 
    selectedUsages, 
    selectedMoods, 
    selectedImage 
  } = options;

  const subjectsStr = selectedSubjects.length > 0 ? selectedSubjects.join(', ') : '사용자 입력 참조';
  const moodsStr = selectedMoods.length > 0 ? selectedMoods.join(', ') : '사용자 입력 참조';
  
  const combinedStyles = [
    ...selectedFormats, 
    ...selectedArtStyles, 
    ...selectedExpressions, 
    ...selectedUsages
  ];
  const stylesStr = combinedStyles.length > 0 ? combinedStyles.join(', ') : '사용자 입력 참조';

  return `
    You are an expert prompt engineer specialized in creating detailed prompts for generative AI models (like Midjourney, Stable Diffusion, DALL-E) based on user input.
    
    Original User Input: "${input}"
    
    Selected AI Parameters (Prioritize these settings):
    - Aspect Ratio: ${aspectRatio || 'Not specified'}
    - Subjects/Characters: ${subjectsStr}
    - Art Styles/Format: ${stylesStr}
    - Atmosphere/Mood: ${moodsStr}
    
    Task:
    Transform the Original User Input into a high-quality, descriptive **English** prompt optimized for image generation.
    ${selectedImage ? "An image has been provided as context. Create a prompt that describes this image's key visual elements and composition." : ""}
    
    Guidelines:
    1. **Language**: The final prompt MUST be in **English**, even if the input is Korean.
    2. **Structure**: 
       - [Main Subject & Action]
       - [Detailed Visual Description (Clothing, Environment, Props)]
       - [Art Style & Medium Keywords]
       - [Lighting, Color Palette, Mood]
       - [Technical Specifications (e.g., 8k, photorealistic, cinematic lighting)]
       - [Aspect Ratio parameter if specified (e.g., --ar 16:9)]
    3. **Integration**: Seamlessly integrate the "Selected AI Parameters" into the narrative description.
    4. **Output**: Return ONLY the final prompt text. No conversational filler.
  `;
}
