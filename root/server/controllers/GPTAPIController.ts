import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { Request, Response } from 'express';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generatePrompt = async (req: Request, res: Response) => {
  console.log("Controller prompt for profile creation: ", req.body.prompt);

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const prompt = req.body.prompt || '';
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }

  try {
   // Generate chat completion using OpenAI API
   const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        "role": "system", 
        "content": `You are a procurement specialist. Generate potential search parameter for European commission TED procurement search in the following format, provide only data:

        <industry>
          here potential industry of interest
        </industry>

        <cpv>
          Separate the codes with commas, . Give cpv codes that are accurate and have not many trailing zeroes. here potential cpvCodes based on the industry of interest for European Commision procurement search
        </cpv>

        <companysize>
          here the potential company size
        </companysize>

        <lowestcost>
          here potential lower limit tender value as a single number
        </lowestcost>

        <highestcost>
          here potential upper limit tender value as a single number
        </highestcost>

        <description>
          here a one paragraph description of the company
        </description>

        <keywords>
          here as many keywords (just single words) on expertise and technologies of the company based on the documents given. Try to make the keywords as specific as possible, separated by comma
        </keywords>`
      },
      {
        "role": "user", 
        "content": prompt
      }
    ],
    max_tokens: 2000,
  });

  // Log the generated completion for debugging
  console.log(chatCompletion?.data?.choices[0]?.message?.['content']);

  // Send the generated completion as a response
  res.status(200).json({ result: chatCompletion?.data?.choices[0]?.message?.['content'] });
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
};

const summarize = async (input: any, res: Response | null = null) => {
  let requestPrompt;

  if (res) {
    console.log("Controller prompt for summarizing: \n\n", input.body.prompt);
    requestPrompt = input.body.prompt || '';
  } else {
    console.log("Controller prompt for summarizing: \n\n", input.prompt);
    requestPrompt = input.prompt || '';
  }

  if (!configuration.apiKey) {
    res?.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const prompt = requestPrompt || '';

  if (prompt.trim().length === 0) {
    res?.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }

  try {
    // Call the OpenAI API to generate the summarized content
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          "role": "system",
          "content": `You are summarizing html text to an insightful data document`
        },
        {
          "role": "user",
          "content": prompt
        }
      ],
    });

    console.log("\n\nGPT response: \n\n", chatCompletion?.data?.choices[0]?.message?.['content'])

    // Handle the response based on whether a response object is provided
    if (res) {
      res.status(200).json({ result: chatCompletion?.data?.choices[0]?.message?.['content'] });
    } else {
      return chatCompletion?.data?.choices[0]?.message?.['content'];
    }
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res?.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res?.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
};

export { generatePrompt, summarize };
