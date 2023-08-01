import { ChatCompletionRequestMessage } from "openai";

const wordAndContext = (word: string, context?: string) => {
  return `"${word}"` + (context ? ` in the context of "${context}"` : "");
};

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

        Flashcard example for word "comprehensive": {
          "word":"comprehensive",
          "meaning":"including (almost) all aspects",
          "transcription":"kɒmprɪˈhensɪv",
          "example":"The report provides a comprehensive analysis.",
          "type":"adjective",
        }`,
      },
    ],
  ];
};
