import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import dictionaryReducer from "./reducers/dictionarySlice";

const persistedDictionaryReducer = persistReducer(
  { key: "dictionary", storage: AsyncStorage },
  dictionaryReducer
);

export const store = configureStore({
  reducer: {
    dictionary: persistedDictionaryReducer,
    // app: appReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
    // if (__DEV__) {
    //   const createDebugger = require("redux-flipper").default;
    //   middlewares.push(createDebugger());
    // }
    return middlewares;
  },
  // devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
