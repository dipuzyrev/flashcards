import { NavigatorScreenParams } from "@react-navigation/native";
import CardsIcon from "~/img/cards.svg";
import HomeIcon from "~/img/home.svg";
import SettingsIcon from "~/img/settings.svg";

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
  [RootScreens.Home]: HomeIcon,
  [RootScreens.Flashcards]: CardsIcon,
  [RootScreens.Settings]: SettingsIcon,
};

export type TabParamList = {
  [RootScreens.Home]: NavigatorScreenParams<HomeStackParamList>;
  [RootScreens.Flashcards]: NavigatorScreenParams<FlashcardsStackParamList>;
  [RootScreens.Settings]: NavigatorScreenParams<SettingsStackParamList>;
};
