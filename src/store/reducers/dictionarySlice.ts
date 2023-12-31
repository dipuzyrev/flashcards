import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { SuperMemoGrade } from "supermemo";
import { RootState } from "~/store/store";
import { IFlashcard, IFlashcardContent } from "~/types/dictionary";
import { srsFunc } from "~/utils/srs/anki-like";
import { getLateness } from "~/utils/srs/lateness";

interface FlashcardsState {
  definitions: Record<number, IFlashcardContent>;
  flashcards: Record<number, IFlashcard>;
}

const initialState: FlashcardsState = {
  definitions: {},
  flashcards: {},
};

const uuid = (collection: Record<number, any>) => {
  let randomId;
  do {
    randomId = Math.floor(Math.random() * 1000000);
  } while (collection[randomId]);
  return randomId;
};

export const dictionarySlice = createSlice({
  name: "dictionary",
  initialState,
  reducers: {
    addDefinitions: (state, action: PayloadAction<IFlashcardContent[]>) => {
      const definitions = action.payload;
      definitions.forEach((definition) => {
        if (
          Object.values(state.definitions).find(
            (d) => d.word === definition.word && d.meaning === definition.meaning
          )
        ) {
          return;
        }

        // add definition
        const definitionId = uuid(state.definitions);
        state.definitions[definitionId] = definition;

        // add flashcards
        const initialCardProps = {
          definitionId,
          interval: 0,
          n: 0,
          efactor: 2.5,
          dueDate: dayjs(Date.now()).toISOString(),
        };
        const toDefinitionFlashcardId = uuid(state.flashcards);
        state.flashcards[toDefinitionFlashcardId] = {
          direction: "toDefinition",
          ...initialCardProps,
        };
        const fromDefinitionFlashcardId = uuid(state.flashcards);
        state.flashcards[fromDefinitionFlashcardId] = {
          direction: "fromDefinition",
          ...initialCardProps,
        };
      });
    },
    updateDefinition: (
      state,
      action: PayloadAction<{ definitionKey: number; content: IFlashcardContent }>
    ) => {
      const { definitionKey, content } = action.payload;
      const definition = state.definitions[definitionKey];
      state.definitions[definitionKey] = { ...definition, ...content };
    },
    deleteFlashcard: (
      state,
      action: PayloadAction<{ flashcardKey: number; definitionKey: number }>
    ) => {
      const { flashcardKey, definitionKey } = action.payload;
      delete state.flashcards[flashcardKey];

      if (!Object.values(state.flashcards).find((f) => f.definitionId === definitionKey)) {
        delete state.definitions[definitionKey];
      }
    },
    practice: (state, action: PayloadAction<{ id: number; grade: SuperMemoGrade }>) => {
      const { id, grade } = action.payload;
      const flashcard = state.flashcards[id];
      const { interval, n, efactor } = srsFunc(flashcard, {
        score: grade,
        lateness: getLateness(flashcard),
      });
      const dueDate = dayjs(Date.now())
        .add(interval * 60 * 24, "minute")
        .toISOString();
      state.flashcards[id] = { ...flashcard, interval, n, efactor, dueDate };
    },
  },
});

export const { addDefinitions, updateDefinition, deleteFlashcard, practice } =
  dictionarySlice.actions;
export const selectDictionary = (state: RootState) => state.dictionary;
export const selectFlashcards = (state: RootState) => state.dictionary.flashcards;
export const selectDefinitions = (state: RootState) => state.dictionary.definitions;

export const selectFlashcardsToReview = createSelector([selectFlashcards], (flashcards) => {
  const flashcardsToReview = Object.fromEntries(
    Object.entries(flashcards).filter(([_, f]) => {
      const dueDate = dayjs(f.dueDate);
      return dueDate.isBefore(dayjs(Date.now()));
    })
  );
  return flashcardsToReview;
});

export default dictionarySlice.reducer;
