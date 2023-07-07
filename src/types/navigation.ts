import {NavigatorScreenParams} from '@react-navigation/native';

export type TranslateStackParamList = {
  TranslateForm: undefined;
  TranslateResult: {text: string; contextPhrase: string | undefined};
};

export type StudyStackParamList = {
  StudyHome: undefined;
  StudyCard: undefined;
};

export type TabParamList = {
  Translate: NavigatorScreenParams<TranslateStackParamList>;
  Study: NavigatorScreenParams<StudyStackParamList>;
};
