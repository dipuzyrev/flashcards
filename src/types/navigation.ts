import { NavigatorScreenParams } from "@react-navigation/native";

export type HomeStackParamList = {
  HomeScreen: undefined;
  ExplanationScreen: {
    word: string;
    context: string | undefined;
    autoCardCreation: boolean | undefined;
  };
  StudyCard: undefined;
};

export type FlashcardsStackParamList = {
  FlashcardListScreen: undefined;
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
};

export enum RootScreens {
  Home = "Home",
  Flashcards = "Flashcards",
  Settings = "Settings",
}

export const TabIcons = {
  [RootScreens.Home]: "house.fill",
  [RootScreens.Flashcards]: "lanyardcard.fill",
  [RootScreens.Settings]: "gearshape.fill",
};

export type TabParamList = {
  [RootScreens.Home]: NavigatorScreenParams<HomeStackParamList>;
  [RootScreens.Flashcards]: NavigatorScreenParams<FlashcardsStackParamList>;
  [RootScreens.Settings]: NavigatorScreenParams<SettingsStackParamList>;
};
