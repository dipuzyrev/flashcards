import * as React from 'react';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TranslateForm from '~/screens/TranslateForm';
import TranslateResult from '~/screens/TranslateResult';
import StudyHome from '~/screens/StudyHome';
import StudyCard from '~/screens/StudyCard/StudyCard';
import { SFSymbol } from "react-native-sfsymbols";
import { TranslateStackParamList, StudyStackParamList, TabParamList } from './NavigationTypes';
// import { wordsToReviewCount } from '~/store/reducers/dictionarySlice';


const TranslateStack = createNativeStackNavigator<TranslateStackParamList>();
const StudyStack = createNativeStackNavigator<StudyStackParamList>();

function TranslateStackScreen() {
  return (
    <TranslateStack.Navigator
      screenOptions={{
        headerBackTitle: 'Back',
      }}
    >
      <TranslateStack.Screen name="TranslateForm" options={{ title: 'Explain' }} component={TranslateForm} />
      <TranslateStack.Screen name="TranslateResult" options={{ title: 'Definitions' }} component={TranslateResult} />
    </TranslateStack.Navigator>
  );
}

function StudyStackScreen() {
  return (
    <StudyStack.Navigator
      screenOptions={{
        headerBackTitle: 'Back',
      }}
    >
      <StudyStack.Screen name="StudyHome" options={{ title: 'Study Cards' }} component={StudyHome} />
      <StudyStack.Screen name="StudyCard" options={{ title: 'Study Cards' }} component={StudyCard} />
    </StudyStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<TabParamList>();

const RootScene = () => {
  // const wordsCount = useAppSelector(wordsToReviewCount);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // tabBarBadge: route.name === 'Study' && wordsCount !== 0 ? wordsCount : undefined,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Translate: 'doc.text.magnifyingglass',
            Study: 'doc.text.image',
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
      <Tab.Screen name="Translate" component={TranslateStackScreen} />
      <Tab.Screen name="Study" component={StudyStackScreen} />
    </Tab.Navigator>
  );
}

export default RootScene;