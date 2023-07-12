import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import AppButton from "~/components/AppButton";
import { selectFlashcards, selectFlashcardsToReview } from "~/store/reducers/dictionarySlice";
import { HomeStackParamList } from "~/types/navigation";
import { useAppSelector } from "~/types/store";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeScreen">;
const HomeScreen = ({ navigation }: Props) => {
  // Flashcards to review
  const totalFlashcards = Object.values(useAppSelector(selectFlashcards));
  const flashcardsToReview = Object.values(useAppSelector(selectFlashcardsToReview));
  const onReviewClick = () => {
    navigation.navigate("StudyCard");
  };

  // Explain form
  const [word, setWord] = React.useState("");
  const [context, setContext] = React.useState("");
  const [autoCardCreation, setAutoCardCreation] = React.useState(false);
  const onExplainClick = () => {
    if (!word) {
      return;
    }
    setWord("");
    setContext("");
    navigation.navigate("ExplanationScreen", {
      word,
      context,
      autoCardCreation,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.widget, styles.cardsInfoContainer]}>
          <Text style={styles.totalCards}>{totalFlashcards.length}</Text>
          <Text style={styles.totalCardsSubtitle}>Flashcards Total</Text>
          <AppButton disabled={!flashcardsToReview.length} onPress={onReviewClick}>
            {flashcardsToReview.length
              ? `Review ${flashcardsToReview.length} Card${
                  flashcardsToReview.length > 1 ? "s" : ""
                }`
              : "Nothing to Review"}
          </AppButton>
        </View>
        <View style={[styles.widget, styles.formContainer]}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={word}
            onChangeText={setWord}
            onSubmitEditing={onExplainClick}
            placeholder="Word or phrase"
          />
          {/* <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={context}
            onChangeText={setContext}
            onSubmitEditing={onExplainClick}
            placeholder="Optional context"
          /> */}
          {/* <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Auto flashcard creation</Text>
            <Switch onValueChange={setAutoCardCreation} value={autoCardCreation} />
          </View> */}
          <AppButton variant="secondary" width="full" disabled={!word} onPress={onExplainClick}>
            Explain
          </AppButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
    gap: 16,
  },
  widget: {
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    justifyContent: "center",
  },
  cardsInfoContainer: {
    flex: 1,
  },
  totalCards: {
    fontSize: 52,
    fontWeight: "800",
    textAlign: "center",
  },
  totalCardsSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 32,
    textAlign: "center",
  },
  formContainer: {
    justifyContent: "center",
  },
  input: {
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    borderRadius: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 0,
    marginBottom: 16,
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#222",
    marginRight: 8,
  },
});

export default HomeScreen;
