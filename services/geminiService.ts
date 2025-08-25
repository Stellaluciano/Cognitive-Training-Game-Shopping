
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface ShoppingScenario {
    scenario: string;
    shoppingList: string[];
    distractors: string[];
}

export async function generateShoppingScenario(listLength: number): Promise<ShoppingScenario> {
    const distractorCount = Math.max(8, listLength * 2);

    const prompt = `
        You are an assistant creating engaging scenarios for a cognitive training game for seniors.
        Your task is to generate a shopping list scenario.
        Provide a short, heartwarming reason for the shopping trip (1-2 sentences).
        Create a shopping list of ${listLength} common grocery items.
        Create a list of ${distractorCount} plausible distractor items that might be found in a grocery store.
        The shopping list and distractor list should not have any overlapping items.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scenario: {
                            type: Type.STRING,
                            description: "A short, heartwarming reason for the shopping trip."
                        },
                        shoppingList: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: `A list of ${listLength} common grocery items.`
                        },
                        distractors: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: `A list of ${distractorCount} plausible distractor items.`
                        }
                    },
                    required: ["scenario", "shoppingList", "distractors"]
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        
        // Basic validation
        if (!parsedResponse.scenario || !Array.isArray(parsedResponse.shoppingList) || !Array.isArray(parsedResponse.distractors)) {
            throw new Error("Invalid response structure from API");
        }
        
        return parsedResponse as ShoppingScenario;

    } catch (error) {
        console.error("Error generating shopping scenario:", error);
        throw new Error("Failed to communicate with the AI model. Please try again later.");
    }
}
