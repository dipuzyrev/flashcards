import { useTheme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import isEqual from "lodash/isEqual";
import * as React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import AppButton from "~/components/AppButton";
import {
  deleteFlashcard,
  selectDefinitions,
  selectFlashcards,
  updateDefinition,
} from "~/store/reducers/dictionarySlice";
import { IFlashcard, IFlashcardContent } from "~/types/dictionary";
import { FlashcardsStackParamList } from "~/types/navigation";
import { useAppDispatch, useAppSelector } from "~/types/store";
import FlashcardSheet from "../components/FlashcardSheet";

type Props = NativeStackScreenProps<FlashcardsStackParamList, "FlashcardListScreen">;
const FlashcardListScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const flashcards = useAppSelector(selectFlashcards);
  const definitions = useAppSelector(selectDefinitions);

  const cards = React.useMemo(() => {
    return Object.entries(flashcards).map(([key, flashcard]) => {
      const definition = definitions[flashcard.definitionId];
      console.log("definition", definition);
      return {
        ...flashcard,
        ...definition,
        id: key,
        stats: `repeated ${flashcard.n} times`,
      };
    });
  }, [flashcards, definitions]);

  const [activeFlashcardKey, setActiveFlashcardKey] = React.useState();
  const [activeFlashcardUpdate, setActiveFlashcardUpdate] = React.useState<IFlashcardContent>();

  const onFlashcardPress = (item: any) => {
    setActiveFlashcardKey(item.id);
  };

  const updateFlashcard = (flashcard: IFlashcard, content: IFlashcardContent) => {
    dispatch(updateDefinition({ definitionKey: flashcard.definitionId, content }));
  };

  const onCardSave = () => {
    if (!activeFlashcardKey || !activeFlashcardUpdate) {
      console.log("no active flashcard key");
      return;
    }
    const flashcard = flashcards[activeFlashcardKey];
    updateFlashcard(flashcard, activeFlashcardUpdate);
    setActiveFlashcardKey(undefined);
    setActiveFlashcardUpdate(undefined);
  };
  const onCardDelete = () => {
    if (!activeFlashcardKey) {
      console.log("no active flashcard key");
      return;
    }
    dispatch(
      deleteFlashcard({
        flashcardKey: activeFlashcardKey,
        definitionKey: flashcards[activeFlashcardKey].definitionId,
      })
    );
    setActiveFlashcardKey(undefined);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlashcardSheet
        show={!!activeFlashcardKey}
        onHideModal={() => setActiveFlashcardKey(undefined)}
        setContentUpdate={setActiveFlashcardUpdate}
        leftButtonComponent={
          <AppButton onPress={onCardDelete} variant="inline" role="danger">
            Delete
          </AppButton>
        }
        rightButtonComponent={
          <AppButton
            onPress={onCardSave}
            disabled={
              !activeFlashcardKey ||
              !activeFlashcardUpdate ||
              isEqual(
                activeFlashcardUpdate,
                definitions[flashcards[activeFlashcardKey].definitionId]
              )
            }
            variant="inline"
            role="primary"
            bold
          >
            Save
          </AppButton>
        }
        content={
          activeFlashcardKey ? definitions[flashcards[activeFlashcardKey].definitionId] : undefined
        }
      />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* <View style={styles.container}> */}
        {cards.map((item) => {
          return (
            <Pressable
              key={item.id}
              onPress={() => onFlashcardPress(item)}
              style={[
                styles.flashcardItem,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.word, { color: colors.textPrimary }]}>
                {item.direction === "toDefinition" ? item.word : item.meaning}
              </Text>
              <Text style={[styles.meaning, { color: colors.textPrimary }]}>
                {item.direction === "fromDefinition" ? item.word : item.meaning}
              </Text>
              <Text style={[styles.stats, { color: colors.textSecondary }]}>{item.stats}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    width: "100%",
    gap: 16,
  },

  flashcardItem: {
    width: "100%",
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
  word: {
    fontWeight: "800",
    fontSize: 18,
  },
  meaning: {
    fontSize: 15,
    marginVertical: 8,
  },
  stats: {
    fontSize: 15,
  },
});

export default FlashcardListScreen;
