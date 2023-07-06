import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from '~/store/store';
import RootScene from "~/navigation/RootScene";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootScene />
      </NavigationContainer>
    </Provider>
  );
}
