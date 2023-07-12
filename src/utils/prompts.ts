import { ChatCompletionRequestMessage } from "openai";

const wordAndContext = (word: string, context?: string) => {
  return `"${word}"` + (context ? ` in the context of "${context}"` : "");
};

// type Prompt = (prevResult?: string) => Message[];
export const explanationPrompt = (
  word: string,
  context?: string
): ChatCompletionRequestMessage[][] => {
  return [
    [
      {
        role: "user",
        content: `Get most common distinct meanings for "${word}" which will be useful for English learner. Important: merge meanings which seem similar! For each meaning provide usage example from book or movie and it's usage popularity.`,
      },
    ],
    [
      {
        role: "user",
        content: `Format your last message into JSON following this structure: 
          [{
            "meaning": "<meaning>",
            "type": "<part of speech / idiom / symbolysm / etc>",
            "example": "<usage example>",
            "popularity": "<usage popularity>",
            }
          }]
          `,
      },
    ],
  ];
};
export type Meaning = {
  meaning: string;
  type: string;
  example: string;
  popularity: string;
};

export const flashcardPrompt = (
  word: string,
  context: string
): ChatCompletionRequestMessage[][] => {
  return [
    [
      {
        role: "system",
        content: `You are assisting to the intermediate English learner. Format output in JSON.`,
      },
      {
        role: "user",
        content: `Create flashcard for ${wordAndContext(word, context)}. Flashcard should have:
          - word / phrase in normal form
          - extremely short and precise definition (up to 4-5 words)
          - type (part of speech, idiom, etc)
          - phonetic transcription
          - short example of usage\n- type (part of speech, idiom, etc)
          - up to 2-3 synonyms
          - up to 2-3 antonyms

        Flashcard example for word "comprehensive": {
          "word":"comprehensive",
          "meaning":"including (almost) all aspects",
          "transcription":"kɒmprɪˈhensɪv",
          "example":"The report provides a comprehensive analysis.",
          "type":"adjective",
          "synonyms":["complete","thorough","exhaustive"],
          "antonyms":["limited","partial","incomplete"]
        }`,
      },
    ],
  ];
};
// export type FlashcardObject = {
//   definition: string;
//   type: string;
//   example: string;
//   synonyms: [string];
//   antonyms: [string];
// };

// export const explanationPrompt = (word: string): Message[] => {
//   return [
//     {
//       role: "system",
//       content: `You assist in learning English. Your response must be in the JSON format using this structure: {"groups":[{"group":"","definitions":[{"meaning":"","example":""}]}]}`,
//     },
//     {
//       role: "user",
//       content: `Get common meanings for "${word}" but merge similar meanings in groups. Provide usage examples.`,
//     },
//   ];
// };

// export const explanationWithContextPrompt = (word: string, context: string): Message[] => {
//   return [
//     {
//       role: "system",
//       content: `You assist in learning English. Focus on Oxford or other dictionaries, providing general information about words meanings.`,
//     },
//     {
//       role: "user",
//       content: `Get meaning(s) of "${word}" in the context of "${context}". Provide example of usage.`,
//     },
//   ];
// };
