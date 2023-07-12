export interface IFlashcardContent {
  word: string;
  type: string;
  transcription: string;
  meaning: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
}

type Direction = "toDefinition" | "fromDefinition";

export interface SuperMemoItem {
  n: number;
  efactor: number;
  interval: number;
}

export type SuperMemoGrade = 0 | 1 | 2 | 3 | 4 | 5;

export interface SuperMemoEvaluation {
  score: SuperMemoGrade;
  lateness: number;
}

export interface IFlashcard extends SuperMemoItem {
  definitionId: number;
  direction: Direction;
  dueDate: string;
}
