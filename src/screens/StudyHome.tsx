import * as React from 'react';
import { Button, Text, View, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from "~/store/types";
import { selectFlashcards, selectFlashcardsToReview } from '~/store/reducers/dictionarySlice';
import { useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StudyStackParamList } from '~/navigation/NavigationTypes';

type Props = NativeStackScreenProps<StudyStackParamList, 'StudyHome'>;
const StudyHome = ({ navigation }: Props) => {
  const flashcards = useAppSelector(selectFlashcardsToReview);
  const totalFlashcards = Object.values(useAppSelector(selectFlashcards));
  // const words = useSelector(selectWords);

  // console.log('totalFlashcards', totalFlashcards);
  console.log('flashcards to review', flashcards);

  const onRevieClick = () => {
    navigation.navigate('StudyCard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View>
          <Text style={styles.totalFlashcardsCount}>{totalFlashcards.length}</Text>
          <Text style={styles.subtitle}>flashcards total</Text>
        </View>
        <View>
          <Text style={styles.flashcardsCount}>{flashcards.length}</Text>
          <Text style={styles.subtitle}>flashcards to review</Text>
        </View>
        <Pressable onPress={onRevieClick} disabled={!flashcards.length} style={({ pressed }) => {
          return [
            styles.mainActionBtn,
            { opacity: pressed || !flashcards.length ? 0.5 : 1 }
          ]
        }}>
          <Text style={styles.mainActionBtnText}>Review</Text>
        </Pressable>
      </View>
    </SafeAreaView>
    // <View style={styles.container}>
    //   <Text>Translation:</Text>
    //   <Button
    //     title="Study"
    //     onPress={() => navigation.navigate('StudyCard')}
    //   />
    // </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 16,
  },

  mainActionBtn: {
    padding: 32,
    paddingVertical: 16,
    backgroundColor: '#000',
    borderRadius: 8
  },
  mainActionBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16
  },
  flashcardsCount: {
    fontSize: 48,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 48,
  },
  totalFlashcardsCount: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 48,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  }
});

export default StudyHome;
