import * as React from 'react';
import { Button, Text, View, StyleSheet, Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from '~/store/types';
import { practice, selectFlashcardsToReview } from '~/store/reducers/dictionarySlice';
import FlashcardComponent from '~/components/Flashcard';
import { shuffleArray } from '~/utils/shuffle';

const StudyCard = ({ navigation }) => {
  const flashcardsState = useAppSelector(selectFlashcardsToReview);
  const [flashcards, setFlashcards] = React.useState(shuffleArray(flashcardsState));
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const dispatch = useAppDispatch();

  const currentFlashcardId = flashcards[currentIndex] ? flashcards[currentIndex][0] : null;
  const currentFlashcard = flashcards[currentIndex] ? flashcards[currentIndex][1] : null;


  // console.log('flashcards', flashcards);

  React.useEffect(() => {
    if (currentFlashcard === null) {
      navigation.navigate('StudyHome');
    }
  }, [currentFlashcard]);

  const [flipped, setFlipped] = React.useState(false);

  const onAgainPress = () => {
    dispatch(practice({ id: Number(currentFlashcardId), grade: 0 }));
    setFlipped(false);
    setCurrentIndex(currentIndex => currentIndex + 1);
  }
  const onHardPress = () => {
    dispatch(practice({ id: Number(currentFlashcardId), grade: 2 }));
    setFlipped(false);
    setCurrentIndex(currentIndex => currentIndex + 1);
  }
  const onGoodPress = () => {
    dispatch(practice({ id: Number(currentFlashcardId), grade: 4 }));
    setFlipped(false);
    setCurrentIndex(currentIndex => currentIndex + 1);
  }
  const onEasyPress = () => {
    dispatch(practice({ id: Number(currentFlashcardId), grade: 5 }));
    setFlipped(false);
    setCurrentIndex(currentIndex => currentIndex + 1);
  }

  return (
    <View style={styles.container}>
      {currentFlashcard && <FlashcardComponent flashcard={currentFlashcard} onFlip={() => setFlipped(flipped => !flipped)} />}
      <View style={styles.footer}>
        <View style={{ ...styles.placeholder, display: !flipped ? 'flex' : 'none' }}>
          <Text style={styles.placeholderText}>Tap card to flip</Text>
        </View>
        <View style={{ ...styles.buttons, display: flipped ? 'flex' : 'none' }}>
          <Pressable onPress={onAgainPress} style={({ pressed }) => {
            return [
              styles.againBtn,
              { opacity: pressed ? 0.5 : 1 }
            ]
          }}>
            <Text style={styles.againBtnText}>Again</Text>
          </Pressable>
          <Pressable onPress={onHardPress} style={({ pressed }) => {
            return [
              styles.hardBtn,
              { opacity: pressed ? 0.5 : 1 }
            ]
          }}>
            <Text style={styles.hardBtnText}>Hard</Text>
          </Pressable>
          <Pressable onPress={onGoodPress} style={({ pressed }) => {
            return [
              styles.goodBtn,
              { opacity: pressed ? 0.5 : 1 }
            ]
          }}>
            <Text style={styles.goodBtnText}>Good</Text>
          </Pressable>
          <Pressable onPress={onEasyPress} style={({ pressed }) => {
            return [
              styles.easyBtn,
              { opacity: pressed ? 0.5 : 1 }
            ]
          }}>
            <Text style={styles.easyBtnText}>Easy</Text>
          </Pressable>
        </View>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  footer: {
    marginTop: 16,
    height: 48,
  },
  buttons: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    gap: 16,
  },
  placeholder: {
    flex: 1,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  placeholderText: {
    textAlign: 'center',
    color: '#777',
  },
  againBtn: {
    flex: 1,
    backgroundColor: '#FDF1F3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EB4B51',
    display: 'flex',
    justifyContent: 'center',
  },
  againBtnText: {
    color: '#EB4B51',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16
  },
  hardBtn: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#FEF9E8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F09135'
  },
  hardBtnText: {
    color: '#F09135',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16
  },
  goodBtn: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#F8FFED',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6DC43A'
  },
  goodBtnText: {
    color: '#6DC43A',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
  },
  easyBtn: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#F0F8FE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4090E9'
  },
  easyBtnText: {
    color: '#4090E9',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16
  },
});

export default StudyCard;
