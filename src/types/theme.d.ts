import "@react-navigation/native";
import { Theme } from "@react-navigation/native";
import { variables } from "~/theme/variables";

type ThemeColors = {
  [K in keyof typeof variables.colors]: string;
};

// Override the theme in react native navigation to accept our custom theme props.
declare module "@react-navigation/native" {
  export type ExtendedTheme = {
    dark: boolean;
    colors: Theme["colors"] & ThemeColors;
  };

  export function useTheme(): ExtendedTheme;
}
