import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCEjj-OKBCPABKx99_G46De8DtMEYaF9Uw";

console.log("Testing Gemini API...");
console.log("API Key:", apiKey.substring(0, 10) + "...");

const ai = new GoogleGenerativeAI(apiKey);

async function test() {
    try {
        console.log("Creating model...");
        const model = ai.getGenerativeModel({
            model: "gemini-2.5-flash",
            tools: [
                {
                    //@ts-ignore
                    googleSearch: {},
                },
            ],
            generationConfig: {
                // responseMimeType: "application/json",
            },
        });

        console.log("Generating content...");
        const result = await model.generateContent(
            "Yerba Canarias 1kg en Montevideo. Devuelve una comparativa de precios en al menos 3 tiendas uruguayas diferentes (.com.uy) en formato JSON puro."
        );

        console.log("Response received!");
        const response = result.response;
        const text = response.text();
        console.log("Result:", text);
        console.log("Grounding Metadata:", JSON.stringify(response.candidates?.[0]?.groundingMetadata, null, 2));

    } catch (error: any) {
        console.error("ERROR DETAILS:");
        console.error("Message:", error.message);
        console.error("Status:", error.status);
        console.error("Full error:", JSON.stringify(error, null, 2));
    }
}

test();
