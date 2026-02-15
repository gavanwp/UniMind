import { GoogleGenAI, Part } from "@google/genai";

// Creates a new AI client instance for every request.
// This is necessary to work around the development environment's security policy,
// which seems to invalidate credentials on internal navigation.
const createAiClient = (): GoogleGenAI => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set. Please ensure it's configured in your environment.");
    }
    return new GoogleGenAI({ apiKey: API_KEY });
}


const systemInstruction = `You are UniMind AI, an advanced academic assistant specially designed for university students in Pakistan. Your name is UniMind AI, but you can refer to yourself as UniGenius AI. Your goal is to help students understand concepts deeply, prepare for exams, complete assignments, and improve academic performance.

Always follow these rules:

1. Explain in simple, clear English.
2. If topic is technical, break it into steps.
3. Give examples whenever possible.
4. If the student asks for notes, structure them with headings and bullet points.
5. If asked for MCQs, generate 10 high-quality MCQs with answers at the end. The answers should be in a separate section clearly marked "Answers".
6. If asked for viva preparation, give short, direct answers (3–5 lines).
7. If asked to summarize, give:
   - Short summary
   - Key points
   - Important formulas (if applicable)
8. If code is requested:
   - Provide clean, well-formatted code.
   - Add comments.
   - Explain the logic.
   - Use markdown code blocks with the language specified (e.g., \`\`\`python).
9. If student uploads text or images, analyze and:
   - Extract important topics
   - Create possible exam questions (a mix of MCQs and short-answer)
   - Create revision notes
10. Always maintain an encouraging and academic tone.
11. Never generate harmful or unethical content.
12. Encourage learning rather than just giving answers.

After providing the main response, ALWAYS end your response with the exact phrase:
"Do you want notes, MCQs, viva answers, or explanation mode?"`;

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const client = createAiClient();
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    
    if (response.text) {
      return response.text;
    }

    return "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error generating response from Gemini API:", error);
    return "An error occurred while trying to get a response. Please check your API key and network connection.";
  }
};


export const analyzeFiles = async (fileParts: Part[]): Promise<string> => {
    try {
        const client = createAiClient();
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [
                { text: "Please analyze the following uploaded notes. Extract the most important topics, create a concise summary, and generate potential exam questions (a mix of MCQs and short-answer questions) based on the content. Structure your response clearly using markdown." },
                ...fileParts
            ] },
            config: {
                systemInstruction: systemInstruction,
            },
        });

        if (response.text) {
            return response.text;
        }

        return "I'm sorry, I couldn't analyze the files. Please try again.";
    } catch (error) {
        console.error("Error analyzing files with Gemini API:", error);
        return "An error occurred while analyzing the files. Please check the file formats and try again.";
    }
}

export const generateSearchResponse = async (prompt: string): Promise<string> => {
  try {
    const client = createAiClient();
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a smart search engine embedded in an academic assistant app. Provide a concise, direct, and accurate answer to the user's query. Format your response clearly using markdown if necessary.",
      },
    });
    
    if (response.text) {
      return response.text;
    }

    return "Sorry, I couldn't find an answer for that. Please try rephrasing your question.";
  } catch (error) {
    console.error("Error in smart search from Gemini API:", error);
    return "An error occurred during the search. Please check your connection and try again.";
  }
};