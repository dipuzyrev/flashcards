import * as React from 'react';
import { Button, Text, View, StyleSheet, Pressable } from 'react-native';
import { useAppSelector } from '~/types/store';
import { selectDefinitions } from '~/store/reducers/dictionarySlice';
import { Flashcard } from '~/types/dictionary';


type Props = { flashcard: Flashcard, onFlip: () => void };
const FlashcardComponent = ({ flashcard, onFlip }: Props) => {
  const definitions = useAppSelector(selectDefinitions);
  const definition = definitions[flashcard.definitionId];

  const front = flashcard.direction === 'toDefinition' ? definition.word : definition.definition;
  const back = flashcard.direction === 'toDefinition' ? definition.definition : definition.word;
  const [flipped, setFlipped] = React.useState(false);
  const reversed = (front === definition.definition && !flipped) || (front === definition.word && flipped);

  const flipCard = () => {
    setFlipped(flipped => !flipped);
    onFlip();
  }

  React.useEffect(() => {
    setFlipped(false);
  }, [flashcard])

  return (
    <Pressable style={{ ...styles.container, ...(reversed ? { backgroundColor: '#111' } : {}) }} onPress={flipCard}>
      <Text style={{ ...styles.wordType, ...(reversed ? { color: '#eee' } : {}) }}>{definition.wordType}</Text>
      <Text style={{ ...styles.mainText, ...(reversed ? { color: '#eee' } : {}) }}>{flipped ? back : front}</Text>
      <Text></Text>
      {/* <Text style={{ ...styles.hint, ...(flipped ? { color: '#555' } : {}) }}>Tap to flip</Text> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 16,
  },
  // flippedCard: {
  //   backgroundColor: '#111',
  // },
  wordType: {
    width: '100%',
    textAlign: 'left',
    fontWeight: '500',
    // color: '#777',
  },
  mainText: {
    fontSize: 26,
    fontWeight: '500',
    textAlign: 'center',
  },
  hint: {
    color: '#777',
  }
});

export default FlashcardComponent;
