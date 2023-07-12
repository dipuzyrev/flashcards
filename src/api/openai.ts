import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import Config from "react-native-config";

export const callApi = async (messages: ChatCompletionRequestMessage[][]) => {
  const configuration = new Configuration({
    apiKey: Config.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  let dialog: ChatCompletionRequestMessage[] = [];

  for (const message of messages) {
    dialog.push(...message);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: dialog,
      temperature: 0,
    });
    const responseMessageContent = response.data.choices[0]?.message?.content;
    if (responseMessageContent) {
      dialog.push({
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
        content: responseMessageContent,
      });
    } else {
      return responseMessageContent;
    }
  }

  return dialog[dialog.length - 1].content;
};
