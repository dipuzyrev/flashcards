import { Configuration, OpenAIApi } from "openai";
import Config from "react-native-config";
import { Message } from "~/types/open-ai";

export const callApi = async (messages: Message[]) => {
  const configuration = new Configuration({
    apiKey: Config.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0,
  });

  return response.data.choices[0]?.message?.content;
};
