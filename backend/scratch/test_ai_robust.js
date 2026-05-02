import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.error("❌ ERROR: GEMINI_API_KEY is not configured in .env file");
    console.log("\nTo fix this:");
    console.log("1. Go to https://aistudio.google.com/app/apikey");
    console.log("2. Click 'Create API Key'");
    console.log("3. Copy your API key");
    console.log("4. Add it to your .env file as: GEMINI_API_KEY=your_key_here");
    return;
  }

  console.log("✓ GEMINI_API_KEY found in .env");
  console.log("\nTesting available models...\n");

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Test models in order of preference
  const modelsToTest = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
  ];
  
  let foundWorkingModel = false;
  let quotaExceeded = false;
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hi");
      const response = await result.response;
      const text = response.text();
      
      console.log(`✓ ${modelName}: SUCCESS`);
      console.log(`  Response: "${text.substring(0, 50)}..."\n`);
      foundWorkingModel = true;
      
      // Don't break - continue testing to see all available models
    } catch (error) {
      const errorMsg = error.message;
      if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("exceeded")) {
        console.log(`⚠ ${modelName}: QUOTA EXCEEDED (429)\n`);
        quotaExceeded = true;
      } else if (errorMsg.includes("404") || errorMsg.includes("not found")) {
        console.log(`✗ ${modelName}: Not available (404)\n`);
      } else if (errorMsg.includes("401") || errorMsg.includes("403")) {
        console.log(`✗ ${modelName}: Authentication failed (check API key)\n`);
      } else if (errorMsg.includes("400")) {
        console.log(`✗ ${modelName}: Bad request\n`);
      } else {
        console.log(`✗ ${modelName}: ${errorMsg}\n`);
      }
    }
  }
  
  if (quotaExceeded) {
    console.log("\n⚠️  QUOTA EXCEEDED");
    console.log("Your Gemini API free tier quota has been exhausted.");
    console.log("\nTo fix this, you have two options:");
    console.log("1. UPGRADE TO PAID (Recommended):");
    console.log("   - Go to https://aistudio.google.com/app/apikey");
    console.log("   - Enable billing on your Google Cloud project");
    console.log("   - This gives you monthly quota for paid plans");
    console.log("\n2. WAIT FOR RESET:");
    console.log("   - Free tier quota resets monthly");
    console.log("   - Check your quota usage at: https://ai.dev/rate-limit");
    return;
  }
  
  if (foundWorkingModel) {
    console.log("\n✓ AI API is working! You can use the AI features.");
  } else {
    console.log("\n❌ No working models found. Please check:");
    console.log("1. Your API key is valid (https://aistudio.google.com/app/apikey)");
    console.log("2. Your API key has access to the Generative AI API");
    console.log("3. Consider upgrading to paid plan for quota: https://aistudio.google.com/app/apikey");
  }
}

test().catch(console.error);


