import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState, store} from '~/store/store';
import dayjs from 'dayjs';
import {Definition, Flashcard, SuperMemoGrade} from '~/store/types';
import {srsFunc} from '~/utils/spaced-repetition/anki-like-algorithm';
import {getLateness} from '~/utils/spaced-repetition/lateness';

interface FlashcardsState {
  definitions: Record<number, Definition>;
  flashcards: Record<number, Flashcard>;
}

const initialState: FlashcardsState = {
  definitions: {},
  flashcards: {},
};

const uuid = collection => {
  let randomId;
  do {
    randomId = Math.floor(Math.random() * 1000000);
  } while (collection[randomId]);
  return randomId;
};

export const dictionarySlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    addDefinitions: (state, action: PayloadAction<Definition[]>) => {
      const definitions = action.payload;
      definitions.forEach(definition => {
        if (
          Object.values(state.definitions).find(
            d => d.word === definition.word && d.definition === definition.definition,
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
          direction: 'toDefinition',
          ...initialCardProps,
        };
        const fromDefinitionFlashcardId = uuid(state.flashcards);
        state.flashcards[fromDefinitionFlashcardId] = {
          direction: 'fromDefinition',
          ...initialCardProps,
        };
      });
    },
    practice: (state, action: PayloadAction<{id: number; grade: SuperMemoGrade}>) => {
      const {id, grade} = action.payload;
      const flashcard = state.flashcards[id];
      const {interval, n, efactor} = srsFunc(flashcard, {
        score: grade,
        lateness: getLateness(flashcard),
      });
      // const {interval, repetition, efactor} = supermemo(flashcard, grade);
      const dueDate = dayjs(Date.now())
        .add(interval * 60 * 24, 'minute')
        .toISOString();
      state.flashcards[id] = {...flashcard, interval, n, efactor, dueDate};
    },
  },
});

export const {addDefinitions, practice} = dictionarySlice.actions;
export const selectDictionary = (state: RootState) => state.dictionary;
// export const selectWords = (state: RootState) => state.dictionary.words;

export const selectFlashcards = (state: RootState) => state.dictionary.flashcards;
export const selectDefinitions = (state: RootState) => state.dictionary.definitions;

export const selectFlashcardsToReview = createSelector([selectFlashcards], flashcards => {
  const flashcardsToReview = Object.entries(flashcards).filter(([_, f]) => {
    const dueDate = dayjs(f.dueDate);
    return dueDate.isBefore(dayjs(Date.now()));
  });
  return flashcardsToReview;
});

// export const selectFlashcardsToReviewCount = (state: RootState) => {
//   return selectFlashcardsToReview(state).length;
// };

export default dictionarySlice.reducer;
