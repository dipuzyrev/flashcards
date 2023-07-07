import { Message } from "~/types/open-ai";

export const buildExplanationPrompt = (word: string, contextPhrase?: string): Message[] => {
  let userPrompt = `Create flashcards for word "${word}" with its most popular definitions.`;
  userPrompt += contextPhrase
    ? ` Don't include flashcards which doesn't correspond to following context: ${contextPhrase}`
    : "";

  return [
    {
      role: "system",
      content: `
      Each flashcard should have: \n
      - precise definition \n
      - example of usage \n
      - type: part of speech, idiom, etc \n
      - few synonyms, if they exist. \n
      Each flashcard output format: \n
      [T]{<type>}[D]{<definition>}[E]{<example>}[S]{<synonym1>|<synonym2>|<synonym3>} \n
      Separate flashcards from each other with 3 asterics (***).
    `,
    },
    { role: "user", content: userPrompt },
  ];
};
