import { DarkTheme, DefaultTheme, ExtendedTheme } from "@react-navigation/native";
import { ThemeColors } from "../types/theme";
import { variables } from "./variables";

export const lightThemeColors = Object.fromEntries(
  Object.entries(variables.colors).map(([key, value]) => [key, value.light])
) as ThemeColors;

export const darkThemeColors = Object.fromEntries(
  Object.entries(variables.colors).map(([key, value]) => [key, value.dark])
) as ThemeColors;

export const lightTheme: ExtendedTheme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    ...lightThemeColors,
  },
};

export const darkTheme: ExtendedTheme = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    ...darkThemeColors,
  },
};
