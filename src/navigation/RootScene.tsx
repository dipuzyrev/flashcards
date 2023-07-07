import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TranslateForm from '~/screens/TranslateForm';
import TranslateResult from '~/screens/TranslateResult';
import StudyHome from '~/screens/StudyHome';
import StudyCard from '~/screens/StudyCard/StudyCard';
import { SFSymbol } from "react-native-sfsymbols";
// import { wordsToReviewCount } from '~/store/reducers/dictionarySlice';
import { useAppSelector } from '~/store/types';

const HomeStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

function TranslateStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerBackTitle: 'Back',
      }}
    >
      <HomeStack.Screen name="TranslateForm" options={{ title: 'Explain' }} component={TranslateForm} />
      <HomeStack.Screen name="TranslateResult" options={{ title: 'Definitions' }} component={TranslateResult} />
    </HomeStack.Navigator>
  );
}

function StudyStackScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerBackTitle: 'Back',
      }}
    >
      <SettingsStack.Screen name="StudyHome" options={{ title: 'Study Cards' }} component={StudyHome} />
      <SettingsStack.Screen name="StudyCard" options={{ title: 'Study Cards' }} component={StudyCard} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const RootScene: React.FC = () => {
  // const wordsCount = useAppSelector(wordsToReviewCount);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // tabBarBadge: route.name === 'Study' && wordsCount !== 0 ? wordsCount : undefined,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Explain: 'doc.text.magnifyingglass',
            Flashcards: 'doc.text.image',
          };
          return (
            <SFSymbol
              name={icons[route.name]}
              weight="semibold"
              color={color}
              size={16}
              resizeMode="center"
              multicolor={false}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Explain" component={TranslateStackScreen} />
      <Tab.Screen name="Flashcards" component={StudyStackScreen} />
    </Tab.Navigator>
  );
}

export default RootScene;