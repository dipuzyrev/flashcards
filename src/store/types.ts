import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, RootState} from './store';
import {SuperMemoItem} from 'supermemo';

export interface NetworkData {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Use throughout app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export interface Definition {
  word: string;
  wordType: string; // enum?
  definition: string;
  example: string;
  synonyms: string[];
}
type Direction = 'toDefinition' | 'fromDefinition';
export interface Flashcard extends SuperMemoItem {
  definitionId: number;
  direction: Direction;
  dueDate: string;
}
