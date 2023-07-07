import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "~/types/store";
import { practice, selectFlashcardsToReview } from "~/store/reducers/dictionarySlice";
import FlashcardComponent from "~/components/Flashcard";
import { shuffleArray } from "~/utils/shuffle";
import { SuperMemoGrade } from "supermemo";
import ReviewButton from "./ReviewButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StudyStackParamList } from "~/types/navigation";

type Props = NativeStackScreenProps<StudyStackParamList, "StudyCard">;
const StudyCard = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();

  const cardsToReviewState = useAppSelector(selectFlashcardsToReview);
  const [carsToReview] = React.useState(shuffleArray(cardsToReviewState));

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentCard = carsToReview[currentIndex] ? carsToReview[currentIndex][1] : null;
  const currentCardId = carsToReview[currentIndex] ? carsToReview[currentIndex][0] : null;

  const onReviewedPress = (grade: SuperMemoGrade) => {
    dispatch(practice({ id: Number(currentCardId), grade }));
    setFlipped(false);
    setCurrentIndex((currentIndex) => currentIndex + 1);
  };

  React.useEffect(() => {
    if (currentCard === null) {
      // Navigate to home when there are no more cards to review
      navigation.navigate("StudyHome");
    }
  }, [currentCard]);

  const [flipped, setFlipped] = React.useState(false);

  return (
    <View style={styles.container}>
      {currentCard && (
        <FlashcardComponent
          flashcard={currentCard}
          onFlip={() => setFlipped((flipped) => !flipped)}
        />
      )}
      <View style={styles.footer}>
        {!flipped ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Tap card to flip</Text>
          </View>
        ) : (
          <View style={styles.buttons}>
            <ReviewButton onPress={onReviewedPress} level="again" flashcard={currentCard} />
            <ReviewButton onPress={onReviewedPress} level="hard" flashcard={currentCard} />
            <ReviewButton onPress={onReviewedPress} level="good" flashcard={currentCard} />
            <ReviewButton onPress={onReviewedPress} level="easy" flashcard={currentCard} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  footer: {
    marginTop: 16,
    height: 56,
  },
  buttons: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    gap: 16,
  },
  placeholder: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  placeholderText: {
    textAlign: "center",
    color: "#777",
  },
});

export default StudyCard;
