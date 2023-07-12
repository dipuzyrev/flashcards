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
import AppButton from "~/components/AppButton";
import { IFlashcardContent } from "~/types/dictionary";

type Props = {
  content?: IFlashcardContent;
  show?: boolean;
  onConfirm: (content: IFlashcardContent) => void;
  onCancel: () => void;
};
const FlashcardSheet = ({ show = true, onConfirm, onCancel, content }: Props) => {
  const [showModal, setShowModal] = React.useState(show);

  const hideModal = () => {
    setShowModal(false);
    onCancel();
  };

  React.useEffect(() => {
    setShowModal(show);
  }, [show]);

  const [word, setWord] = React.useState(content?.word);
  const [transcript, setTranscript] = React.useState(content?.transcription);
  const [meaning, setMeaning] = React.useState(content?.meaning);
  const [example, setExample] = React.useState(content?.example);
  const [synonyms, setSynonyms] = React.useState(content?.synonyms ?? []);
  const [antonyms, setAntonyms] = React.useState(content?.antonyms ?? []);

  React.useEffect(() => {
    setWord(content?.word);
    setTranscript(content?.transcription);
    setMeaning(content?.meaning);
    setExample(content?.example);
    setSynonyms(content?.synonyms ?? []);
    setAntonyms(content?.antonyms ?? []);
  }, [content]);

  const updatedContent = React.useMemo(() => {
    if (!word || !meaning) {
      return;
    }

    return {
      word,
      transcription: transcript,
      meaning,
      example,
      synonyms,
      antonyms,
    } as IFlashcardContent;
  }, [word, transcript, meaning, example, synonyms, antonyms]);

  const onConfirmPress = () => {
    onConfirm(updatedContent!);
  };

  return (
    <Modal
      animationType="slide"
      visible={showModal}
      onRequestClose={hideModal}
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        {!content ? (
          <ActivityIndicator />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.modalHeader}>
              <AppButton onPress={hideModal} variant="inline">
                Cancel
              </AppButton>
              <AppButton onPress={onConfirmPress} disabled={!updatedContent} variant="inline" bold>
                Add Card
              </AppButton>
            </View>
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
                value={transcript}
                onChangeText={setTranscript}
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
                onChangeText={(val) => setSynonyms(val.split(",").map((v) => v.trim()))}
                placeholder="Synonyms"
              />

              <Text style={styles.inputLabel}>Antonyms</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={antonyms.join(", ")}
                onChangeText={(val) => setAntonyms(val.split(",").map((v) => v.trim()))}
                placeholder="Antonyms"
              />
            </View>
            <View style={{ height: 50 }} />
          </ScrollView>
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
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
