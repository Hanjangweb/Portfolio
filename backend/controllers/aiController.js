import axios from "axios";
import { asyncHandler } from "../middleware/errorHandler.js";

export const generateContent = asyncHandler(async (req, res) => {
  const { prompt, type } = req.body;

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ 
      success: false, 
      message: "AI API Key is not configured. Please add your OpenRouter API key to your .env file. Get one at https://openrouter.ai/keys" 
    });
  }

  if (!prompt) {
    return res.status(400).json({ success: false, message: "Prompt is required" });
  }
  
  let fullPrompt = prompt;
  if (type === 'blog') {
    fullPrompt = `Generate a professional blog post content in markdown format based on this title/topic: ${prompt}. Include headings and structured content.`;
  } else if (type === 'description') {
    fullPrompt = `Write a compelling 2-3 sentence project description for: ${prompt}`;
  } else if (type === 'excerpt') {
    fullPrompt = `Write a 1-sentence catchy excerpt for a blog post about: ${prompt}`;
  } else if (type === 'testimonial') {
    fullPrompt = `${prompt}. Write a professional and genuine testimonial message (2-3 sentences) that sounds natural and authentic.`;
  } else if (type === 'contact') {
    fullPrompt = `Generate a professional contact message for the subject: "${prompt}". Write 3-4 sentences that clearly explain the purpose and context. Make it professional but friendly.`;
  } else if (type === 'skill') {
    fullPrompt = `Write a brief, professional description (2-3 sentences) for the technical skill: "${prompt}". Include its purpose, key applications, and why it matters in web development.`;
  }

  try {
    console.log(`Attempting AI generation with prompt type: ${type}`);
    
    // Try OpenRouter first if key is configured
    if (process.env.OPENROUTER_API_KEY ) {
      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "meta-llama/llama-2-7b-chat",
            messages: [{ role: "user", content: fullPrompt }],
            temperature: 0.7,
            max_tokens: 1500,
          },
          {
            headers: {
              "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
              "X-Title": "Portfolio AI",
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );

        if (response.data?.choices?.[0]?.message?.content) {
          let text = response.data.choices[0].message.content;
          console.log(`Success with OpenRouter`);
          text = text.replace(/^```[a-z]*\n/i, '').replace(/\n```$/m, '').trim();
          return res.json({ success: true, data: text });
        }
      } catch (openRouterError) {
        console.log(`OpenRouter failed:`, openRouterError.message);
      }
    }

    // Try free Together.ai API
    try {
      console.log(`Trying Together.ai API`);
      const response = await axios.post(
        "https://api.together.xyz/inference",
        {
          model: "meta-llama/Llama-2-7b-chat-hf",
          prompt: fullPrompt,
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      if (response.data?.output?.choices?.[0]?.text) {
        let text = response.data.output.choices[0].text;
        console.log(`Success with Together.ai`);
        return res.json({ success: true, data: text });
      }
    } catch (togetherError) {
      console.log(`Together.ai failed:`, togetherError.message);
    }

    // Fallback: Generate contextual placeholder responses
    console.log(`Using AI-style placeholder response`);
    let aiResponse = "";
    
    if (type === 'contact') {
      aiResponse = `Thank you for reaching out! I'm very interested in discussing your project. This sounds like an exciting opportunity that aligns well with my expertise. I'd love to learn more about your vision and timeline. Please feel free to share additional details, and I'll get back to you with a personalized proposal within 24 hours.`;
    } else if (type === 'testimonial') {
      aiResponse = `Working on this project was a fantastic experience. The team demonstrated exceptional skill, attention to detail, and a genuine commitment to delivering quality results. I highly recommend their services to anyone looking for reliable and professional work.`;
    } else if (type === 'skill') {
      aiResponse = `This is a valuable skill in modern development that enables developers to build scalable, efficient solutions. Mastering this skill opens doors to working on complex, real-world applications and staying competitive in the industry.`;
    } else if (type === 'blog') {
      aiResponse = `# ${prompt}\n\nThis is an important topic in today's development landscape. Understanding the fundamentals is crucial for building robust applications. Key aspects include practical implementation patterns, best practices, and common pitfalls to avoid. By mastering these concepts, developers can create more maintainable and efficient code.`;
    } else if (type === 'description') {
      aiResponse = `${prompt} - Delivering innovative solutions that combine cutting-edge technology with user-centric design to create impactful digital experiences.`;
    } else {
      aiResponse = `This is an interesting project proposal. I appreciate your interest and would be happy to discuss further details about requirements, timeline, and deliverables.`;
    }

    return res.json({ success: true, data: aiResponse });

  } catch (error) {
    console.error(`Error with AI generation:`, error.message);

    res.status(500).json({ 
      success: false, 
      message: `AI Generation failed: ${error.message || "Service temporarily unavailable"}`
    });
  }
});
