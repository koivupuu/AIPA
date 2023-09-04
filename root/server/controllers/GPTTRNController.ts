import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY as string,
});
const openai = new OpenAIApi(configuration);

const translateKeywords = async (keywords: string[], languages: string[]): Promise<string[]> => {
    if (!keywords || keywords.length <= 0 || keywords[0] === '') {
        console.log("\nNo keywords, quitting translation");
        return [];
    }

    console.log("\nKeywords to translate: ", keywords);

    if (!languages || languages.length <= 0) {
        console.log("\nNo languages, using default list");
        languages = ["EN", "FI", "DE", "ES", "PL", "FR", "CZ", "IT", "RO"];
    }

    console.log("Languages: ", languages);

    if (!configuration.apiKey) {
        console.error("OpenAI API key not configured, please follow instructions in README.md");
        return [];
    }

    const translations: string[] = [...keywords];

    try {
        console.log("\ntranslating...");
        for (let language of languages) {
            console.log("Language: ", language);
            if (language !== 'EN') {
                const chatCompletion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo-16k",
                    messages: [
                        {
                            "role": "system",
                            "content": `You are a translator. Your task is to translate the following word or list of keywords to iso country code ${language} language, maintaining the list structure.
                            If the keyword is a name of a specified company or a name of a company product, do not translate it.`
                        },
                        {
                            "role": "user",
                            "content": `Translate the following and output a comma separated list: \n\n${keywords.join(", ")}`
                        }
                    ],
                    temperature: 0.4,
                    max_tokens: 3000,
                });

                const translatedList = chatCompletion?.data?.choices?.[0]?.message?.['content'];
                const translatedKeywords = translatedList?.split(",").map(word => word.trim()) || [];
                translations.push(...translatedKeywords);
            }
        }
        return [...new Set(translations)];
    } catch (error: any) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
        }
        return [];
    }
};

export { translateKeywords };
