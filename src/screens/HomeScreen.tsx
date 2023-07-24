import { useTheme } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { callApi } from "~/api/openai";
import AppButton from "~/components/AppButton";
import { addDefinitions, selectFlashcardsToReview } from "~/store/reducers/dictionarySlice";
import { IFlashcardContent } from "~/types/dictionary";
import { HomeStackParamList } from "~/types/navigation";
import { useAppDispatch, useAppSelector } from "~/types/store";
import { flashcardPrompt } from "~/utils/prompts";
import FlashcardSheet from "./ExplanationScreen/FlashcardSheet";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeScreen">;
const HomeScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  // Flashcards to review widget

  const flashcardsToReview = Object.values(useAppSelector(selectFlashcardsToReview));
  const onReviewClick = () => {
    navigation.navigate("StudyCard");
  };

  // Create flashcard widget

  const [word, setWord] = React.useState("");
  const [context, setContext] = React.useState("");

  const onCreateClick = () => {
    if (!word) {
      return;
    }
    setContext("");
    setShowModal(true);
    const prompt = flashcardPrompt(word, context);
    callApi(prompt)
      .then(handleFlashcardResponse)
      .catch((error) => {
        // @ts-ignore
        alert(error.message);
      });
  };

  const handleFlashcardResponse = (response?: string) => {
    if (!response) {
      return;
    }
    const flashcard = JSON.parse(response) as IFlashcardContent;
    setFlashcardContent(flashcard);
    setFlashcardContentUpdate(flashcard);
  };

  // Flashcard sheet

  const [showModal, setShowModal] = React.useState(false);
  const [flashcardContent, setFlashcardContent] = React.useState<IFlashcardContent>();
  const [flashcardContentUpdate, setFlashcardContentUpdate] = React.useState<IFlashcardContent>();

  const onCardConfirm = () => {
    if (!flashcardContentUpdate) {
      return;
    }
    setWord("");
    setContext("");
    setShowModal(false);
    dispatch(addDefinitions([flashcardContentUpdate]));
    setFlashcardContent(undefined);
  };

  const onHideModal = () => {
    setWord("");
    setContext("");
    setShowModal(false);
    setFlashcardContentUpdate(undefined);
    setFlashcardContent(undefined);
  };

  const onRegenerateClick = () => {
    if (!context) {
      return;
    }
    setShowModal(false);
    setFlashcardContentUpdate(undefined);
    setFlashcardContent(undefined);
    onCreateClick();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.safeArea}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View
            style={[
              styles.widget,
              styles.cardsInfoContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardToReview, { color: colors.textPrimary }]}>
              {flashcardsToReview.length}
            </Text>
            <Text style={[styles.cardsToReviewCaption, { color: colors.textSecondary }]}>
              Card(s) to Review
            </Text>
            {!!flashcardsToReview.length && <AppButton onPress={onReviewClick}>Review</AppButton>}
          </View>
          <View
            style={[
              styles.widget,
              styles.formContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.inputsWrapper}>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
                // autoCapitalize="none"
                value={word}
                onChangeText={setWord}
                onSubmitEditing={onCreateClick}
                placeholder="Word or phrase"
              />

              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
                // autoCapitalize="none"
                value={context}
                onChangeText={setContext}
                onSubmitEditing={onCreateClick}
                placeholder="Context (optional)"
              />
            </View>
            <AppButton
              variant="solid"
              role="secondary"
              width="full"
              disabled={!word}
              onPress={onCreateClick}
            >
              Create Flashcard
            </AppButton>
          </View>
          <FlashcardSheet
            show={showModal}
            onHideModal={onHideModal}
            content={flashcardContent}
            setContentUpdate={setFlashcardContentUpdate}
            leftButtonComponent={
              <AppButton onPress={onHideModal} variant="inline">
                Cancel
              </AppButton>
            }
            rightButtonComponent={
              <AppButton
                onPress={onCardConfirm}
                disabled={!flashcardContentUpdate}
                variant="inline"
                bold
              >
                Add Card
              </AppButton>
            }
            footerComponent={
              <View style={styles.footer}>
                <TextInput
                  style={[
                    styles.footerInput,
                    { borderColor: colors.border, color: colors.textPrimary },
                  ]}
                  value={context}
                  onChangeText={setContext}
                  placeholder="Context"
                  onSubmitEditing={onRegenerateClick}
                />
                <AppButton onPress={onRegenerateClick} disabled={!context} width="auto">
                  Regenerate
                </AppButton>
              </View>
            }
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
  },
  // Flashcards to review widget
  cardsInfoContainer: {
    flex: 1,
  },
  cardToReview: {
    fontSize: 52,
    fontWeight: "800",
    textAlign: "center",
  },
  cardsToReviewCaption: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 32,
    textAlign: "center",
  },
  // Create flashcard widget
  formContainer: {
    justifyContent: "center",
  },
  inputsWrapper: {
    display: "flex",
  },
  input: {
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
  },
  // Flashcard sheet footer
  footer: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    width: "100%",
  },
  footerInput: {
    fontSize: 15,
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    flex: 1,
  },
});

export default HomeScreen;
