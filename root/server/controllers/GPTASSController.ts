import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

// Create OpenAI configuration object with API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to generate a prompt and communicate with OpenAI
const generatePrompt = async (req: Request, res: Response) => {
  console.log("\n\nController prompt:\n", req.body.prompt + "\n\n");

  // Check if OpenAI API key is configured
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const prompt = req.body.prompt || '';

  // Validate the prompt
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          "role": "system",
          "content": `You are assessing why some tender/procurement is a good fit for their company. Give short bullet points only. Give them in the following format:
                        Positives\n
                        point1\n
                        point2\n
                        point3\n
                        point4\n
                        Limitations\n
                        limitation1\n
                        limitation2\n`
        },
        {
          "role": "user",
          "content": prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 3000,
    });

    // Return the generated response
    res.status(200).json({ result: chatCompletion?.data?.choices[0]?.message?.content });
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case

    // Handle API response errors
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      // Handle general errors
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
};

// Export the function for use in other modules
export { generatePrompt };
