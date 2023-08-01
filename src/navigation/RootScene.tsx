import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import FlashcardListScreen from "~/screens/FlashcardListScreen";
import HomeScreen from "~/screens/HomeScreen";
import SettingsHome from "~/screens/SettingsHome";
import StudyCard from "~/screens/StudyCard/StudyCard";
import {
  FlashcardsStackParamList,
  HomeStackParamList,
  RootScreens,
  SettingsStackParamList,
  TabIcons,
  TabParamList,
} from "~/types/navigation";

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const FlashcardsStack = createNativeStackNavigator<FlashcardsStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerBackTitle: "Back",
      }}
    >
      <HomeStack.Screen name="HomeScreen" options={{ title: "Home" }} component={HomeScreen} />
      <HomeStack.Screen name="StudyCard" options={{ title: "Study Cards" }} component={StudyCard} />
    </HomeStack.Navigator>
  );
}

function FlashcardsStackScreen() {
  return (
    <FlashcardsStack.Navigator
      screenOptions={{
        headerBackTitle: "Back",
      }}
    >
      <FlashcardsStack.Screen
        name="FlashcardListScreen"
        options={{ title: "Study Cards" }}
        component={FlashcardListScreen}
      />
    </FlashcardsStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerBackTitle: "Back",
      }}
    >
      <SettingsStack.Screen
        name="SettingsHome"
        options={{ title: "Settings" }}
        component={SettingsHome}
      />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<TabParamList>();

const RootScene = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const Icon = TabIcons[route.name];
          return <Icon width={22} height={22} color={color} />;
        },
        tabBarLabelStyle: {
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen name={RootScreens.Home} component={HomeStackScreen} />
      <Tab.Screen name={RootScreens.Flashcards} component={FlashcardsStackScreen} />
      <Tab.Screen name={RootScreens.Settings} component={SettingsStackScreen} />
    </Tab.Navigator>
  );
};

export default RootScene;
