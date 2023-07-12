import * as React from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { IFlashcardContent } from "~/types/dictionary";

type Props = {
  content?: IFlashcardContent;
  show: boolean;
  leftButtonComponent: React.ReactNode;
  rightButtonComponent: React.ReactNode;
  setContentUpdate: (content: IFlashcardContent | undefined) => void;
  onHideModal: () => void;
};
const FlashcardSheet = ({
  show = true,
  leftButtonComponent,
  rightButtonComponent,
  onHideModal,
  content,
  setContentUpdate,
}: Props) => {
  const [word, setWord] = React.useState(content?.word);
  const [transcription, setTranscription] = React.useState(content?.transcription);
  const [meaning, setMeaning] = React.useState(content?.meaning);
  const [example, setExample] = React.useState(content?.example);
  const [synonyms, setSynonyms] = React.useState(content?.synonyms ?? []);
  const [antonyms, setAntonyms] = React.useState(content?.antonyms ?? []);

  React.useEffect(() => {
    setWord(content?.word);
    setTranscription(content?.transcription);
    setMeaning(content?.meaning);
    setExample(content?.example);
    setSynonyms(content?.synonyms ?? []);
    setAntonyms(content?.antonyms ?? []);
  }, [content]);

  const updatedContent = React.useMemo(() => {
    if (!word || !meaning) {
      return;
    }

    return { word, transcription, meaning, example, synonyms, antonyms } as IFlashcardContent;
  }, [word, transcription, meaning, example, synonyms, antonyms]);

  React.useEffect(() => {
    setContentUpdate(updatedContent);
  });

  const setWordsArray = (str: string, type: "synonyms" | "antonyms") => {
    const array = str.split(",").map((v) => v.trim());
    if (type === "synonyms") {
      setSynonyms(str && array.length ? array : []);
    } else {
      setAntonyms(str && array.length ? array : []);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={show}
      onRequestClose={onHideModal}
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        {!content ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <View style={styles.modalHeader}>
              {leftButtonComponent}
              {rightButtonComponent}
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              <View style={styles.modalBody}>
                <Text style={styles.inputLabel}>Word or Phrase (*)</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  value={word}
                  onChangeText={setWord}
                  placeholder="Word or phrase"
                />

                <Text style={styles.inputLabel}>Transcript</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  value={transcription}
                  onChangeText={setTranscription}
                  placeholder="Transcript"
                />

                <Text style={styles.inputLabel}>Meaning (*)</Text>
                <TextInput
                  multiline
                  style={[styles.input, styles.multilineInput]}
                  autoCapitalize="none"
                  value={meaning}
                  onChangeText={setMeaning}
                  placeholder="Meaning"
                />

                <Text style={styles.inputLabel}>Example</Text>
                <TextInput
                  multiline
                  style={[styles.input, styles.multilineInput]}
                  autoCapitalize="none"
                  value={example}
                  onChangeText={setExample}
                  placeholder="Example"
                />

                <Text style={styles.inputLabel}>Synonyms</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  value={synonyms.join(", ")}
                  onChangeText={(val) => setWordsArray(val, "synonyms")}
                  placeholder="Synonyms"
                />

                <Text style={styles.inputLabel}>Antonyms</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  value={antonyms.join(", ")}
                  onChangeText={(val) => setWordsArray(val, "antonyms")}
                  placeholder="Antonyms"
                />
              </View>
              <View style={{ height: 50 }} />
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  scrollViewContainer: {
    // flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBody: {
    flex: 1,
    width: "100%",
  },
  input: {
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    borderRadius: 12,
  },
  multilineInput: {
    height: 90,
    paddingTop: 16,
  },
  inputLabel: {
    fontSize: 15,
    marginBottom: 8,
    marginTop: 16,
    color: "#777",
    fontWeight: "500",
  },
});

export default FlashcardSheet;
