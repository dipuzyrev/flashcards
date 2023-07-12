import * as React from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { selectDefinitions } from "~/store/reducers/dictionarySlice";
import { IFlashcard } from "~/types/dictionary";
import { useAppSelector } from "~/types/store";

type Props = { flashcard: IFlashcard; onFlip: () => void };
const FlashcardComponent = ({ flashcard, onFlip }: Props) => {
  const definitions = useAppSelector(selectDefinitions);
  const definition = definitions[flashcard.definitionId];

  const front = flashcard.direction === "toDefinition" ? definition.word : definition.meaning;
  const back = flashcard.direction === "toDefinition" ? definition.meaning : definition.word;
  const [flipped, setFlipped] = React.useState(false);
  const reversed = flashcard.direction !== "toDefinition";

  const flipCard = () => {
    if (flipped) {
      return;
    }
    setFlipped((flipped) => !flipped);
    onFlip();
  };

  React.useEffect(() => {
    setFlipped(false);
  }, [flashcard]);

  const bgImage = require("~/img/card-bg.png");
  const emptyBgImage = require("~/img/card-bg-empty.png");

  return (
    <ImageBackground source={flipped ? emptyBgImage : bgImage} style={styles.image}>
      <Pressable style={{ ...styles.container, ...(reversed ? {} : {}) }} onPress={flipCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.type}>{definition.type}</Text>
          <View style={styles.dot}></View>
        </View>

        <View style={styles.cardBody}>
          <Text
            style={[
              styles.word,
              {
                fontWeight: reversed ? "800" : "500",
                opacity: reversed ? (flipped ? 1 : 0) : 1,
              },
            ]}
          >
            {definition.word}
          </Text>
          <Text style={[styles.transcription, { opacity: reversed ? (flipped ? 1 : 0) : 1 }]}>
            [{definition.transcription}]
          </Text>
          <Text
            style={[
              styles.meaning,
              {
                fontWeight: reversed ? "500" : "800",
                opacity: reversed ? 1 : flipped ? 1 : 0,
              },
            ]}
          >
            {definition.meaning}
          </Text>
          <Text style={[styles.example, { opacity: flipped ? 1 : 0 }]}>“{definition.example}”</Text>
        </View>

        <View style={[styles.cardFooter, { opacity: flipped ? 1 : 0 }]}>
          <View>
            <Text style={styles.synonymsTitle}>Synonyms</Text>
            {definition.synonyms.length ? (
              definition.synonyms.map((synonym) => (
                <Text style={styles.synonymItem}>{synonym}</Text>
              ))
            ) : (
              <Text style={styles.synonymItem}>–</Text>
            )}
          </View>
          <View>
            <Text style={styles.synonymsTitle}>Antonyms</Text>
            {definition.antonyms.length ? (
              definition.antonyms.map((synonym) => (
                <Text style={styles.antonymItem}>{synonym}</Text>
              ))
            ) : (
              <Text style={styles.antonymItem}>–</Text>
            )}
          </View>
        </View>
      </Pressable>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    backgroundColor: "#fff",
  },
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  cardHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardFooter: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F1F1F1",
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },
  type: {
    color: "#777",
    fontSize: 15,
  },
  transcription: {
    fontSize: 15,
  },

  word: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 2,
  },
  meaning: {
    fontWeight: "800",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 24,
  },
  example: {
    fontSize: 15,
  },

  synonymsTitle: {
    fontSize: 15,
    color: "#777",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  synonymItem: {
    fontSize: 15,
    marginBottom: 2,
  },
  antonymItem: {
    fontSize: 15,
    marginBottom: 2,
    textAlign: "right",
  },
});

export default FlashcardComponent;
