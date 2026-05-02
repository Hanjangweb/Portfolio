import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
  
  for (const m of models) {
    try {
      console.log(`Testing ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hi");
      console.log(`Success with ${m}:`, (await result.response).text());
      break;
    } catch (error) {
      console.error(`Error with ${m}:`, error.message);
    }
  }
}

test();
