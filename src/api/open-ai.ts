import { Configuration, OpenAIApi } from "openai";
import Config from "react-native-config";

export const callApi = async (prompt: string) => {
  const configuration = new Configuration({
    apiKey: Config.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  return response.data.choices[0]?.message?.content;
};
