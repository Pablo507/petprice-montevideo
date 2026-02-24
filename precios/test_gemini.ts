
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');
const envFile = fs.readFileSync(envPath, 'utf8');

const apiKeyMatch = envFile.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

if (!apiKey) {
    console.error("API Key not found in .env");
    process.exit(1);
}

console.log(`Using API Key starting with: ${apiKey.substring(0, 5)}...`);

const ai = new GoogleGenerativeAI(apiKey);

async function test() {
    try {
        console.log("Testing with model: gemini-2.5-flash");
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
        const response = await model.generateContent("Hello, are you there?");
        console.log("Success!");
        console.log(response.response.text());
    } catch (error) {
        console.error("Error details:", error);
    }
}

test();
