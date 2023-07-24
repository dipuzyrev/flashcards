import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { useColorScheme } from "react-native";
import { Provider } from "react-redux";
import RootScene from "~/navigation/RootScene";
import { store } from "~/store/store";
import { darkTheme, lightTheme } from "~/theme/colors";

export default function App() {
  const scheme = useColorScheme();

  return (
    <Provider store={store}>
      <NavigationContainer theme={scheme === "dark" ? darkTheme : lightTheme}>
        <RootScene />
      </NavigationContainer>
    </Provider>
  );
}
