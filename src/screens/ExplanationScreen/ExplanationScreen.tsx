import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { callApi } from "~/api/openai";
import AppButton from "~/components/AppButton";
import { addDefinitions } from "~/store/reducers/dictionarySlice";
import { IFlashcardContent } from "~/types/dictionary";
import { HomeStackParamList } from "~/types/navigation";
import { useAppDispatch } from "~/types/store";
import { Meaning, explanationPrompt, flashcardPrompt } from "~/utils/prompts";
import FlashcardSheet from "./FlashcardSheet";

type Props = NativeStackScreenProps<HomeStackParamList, "ExplanationScreen">;
const ExplanationScreen = ({ navigation, route }: Props) => {
  const { word, context } = route.params;
  const dispatch = useAppDispatch();

  const [meanings, setMeanings] = React.useState<Meaning[]>([]);

  const handleResponse = (response?: string) => {
    if (!response) {
      return;
    }
    const meanings = JSON.parse(response) as Meaning[];
    setMeanings(meanings);
  };

  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    const prompt = explanationPrompt(word, context);

    callApi(prompt)
      .then(handleResponse)
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const [selectedDefinition, setSelectedDefinition] = React.useState<number>();
  const onDefinitionPress = (index: number) => {
    setSelectedDefinition(index);
  };

  const handleFlashcardResponse = (response?: string) => {
    if (!response) {
      return;
    }
    const flashcard = JSON.parse(response) as IFlashcardContent;
    setFlashcardContent(flashcard);
    setFlashcardContentUpdate(flashcard);
  };

  const onAddClick = () => {
    if (selectedDefinition === undefined) {
      return;
    }
    const meaning = meanings[selectedDefinition].meaning;
    setShowModal(true);
    const prompt = flashcardPrompt(word, meaning);
    callApi(prompt)
      .then(handleFlashcardResponse)
      .catch((error) => {
        setError(error.message);
      });
  };

  const [showModal, setShowModal] = React.useState(false);
  const [flashcardContent, setFlashcardContent] = React.useState<IFlashcardContent>();
  const [flashcardContentUpdate, setFlashcardContentUpdate] = React.useState<IFlashcardContent>();

  const onConfirm = () => {
    if (!flashcardContentUpdate) {
      return;
    }

    setShowModal(false);
    dispatch(addDefinitions([flashcardContentUpdate]));
    setSelectedDefinition(undefined);
    setFlashcardContent(undefined);
  };
  const onHideModal = () => {
    setShowModal(false);
    setFlashcardContentUpdate(undefined);
    setSelectedDefinition(undefined);
    setFlashcardContent(undefined);
  };

  // const dummyFlashcardContent = {
  //   word: "apple",
  //   type: "noun",
  //   transcription: "[apple]",
  //   meaning: "red / green fruit",
  //   example: "I eat apples every day.",
  //   synonyms: ["pear", "banana"],
  //   antonyms: [""],
  // };

  return (
    <SafeAreaView style={styles.safeArea}>
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
          <AppButton onPress={onConfirm} disabled={!flashcardContentUpdate} variant="inline" bold>
            Add Card
          </AppButton>
        }
      />
      {!meanings.length ? (
        error ? (
          <View style={styles.loaderContainer}>
            <Text>{error}</Text>
          </View>
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator />
          </View>
        )
      ) : (
        <View style={styles.wrapper}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topContent}>
              <View>
                <Text>
                  Text: <Text style={{ fontWeight: "bold" }}>{word}</Text>
                </Text>
              </View>
              {!!context && (
                <View>
                  <Text>Context: {context}</Text>
                </View>
              )}
              {meanings.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => onDefinitionPress(index)}
                  style={[
                    styles.definition,
                    {
                      backgroundColor: selectedDefinition === index ? "#ddd" : "transparent",
                    },
                  ]}
                >
                  <Text style={{ color: "#777" }}>{item.type}</Text>
                  <Text style={{ paddingVertical: 10, fontSize: 18 }}>{item.meaning}</Text>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Example:</Text> {item.example}
                  </Text>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Popularity:</Text> {item.popularity}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
          <View style={styles.buttonWrapper}>
            <Pressable
              onPress={onAddClick}
              disabled={selectedDefinition === undefined}
              style={({ pressed }) => {
                return [
                  styles.mainActionBtn,
                  { opacity: pressed || selectedDefinition === undefined ? 0.5 : 1 },
                ];
              }}
            >
              <Text style={styles.mainActionBtnText}>Create Flashcard</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
  },
  buttonWrapper: {
    padding: 16,
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
  },
  topContent: {},
  definition: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 16,
  },
  mainActionBtn: {
    padding: 32,
    paddingVertical: 16,
    backgroundColor: "#222",
    borderRadius: 8,
  },
  mainActionBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 15,
  },
});

export default ExplanationScreen;
