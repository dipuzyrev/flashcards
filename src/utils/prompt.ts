export const buildExplanationPrompt = (word: string, contextPhrase?: string) => {
  let prompt = `
      You are the English language assistant. 
      For a given word provide it's common and widely used meanings, example of usage, synonyms (up to 3) and part of speech.
      Use Oxford dictionary as a source of information. 
      Use basic vocabulary in meanings and examples. 
      Keep meaning as short as possible, aim to about 6-8 words. 
      Avoid using words from user's prompt in meaning.
      Avoid using punctuation marks and capital letters in meaning. 
      Response format: \n
      Each meaning: [T]{<type>}[D]{<meaning>}[E]{<example>}[S]{<synonym1>|<synonym2>|<synonym3>}.
      If needed, list less synonyms or return "" instead of <synonym> if there is no synonyms found.
      Separate meanings from each other with 3 asterics (***). \n

      Word: ${word}`;
  prompt += contextPhrase ? `; only meaning in the context of: ${contextPhrase}` : '';
  return prompt;
};
