import { useTheme } from "@react-navigation/native";
import * as React from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
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
  footerComponent?: React.ReactNode;
};
const FlashcardSheet = ({
  show = true,
  leftButtonComponent,
  rightButtonComponent,
  onHideModal,
  content,
  footerComponent,
  setContentUpdate,
}: Props) => {
  const { colors } = useTheme();

  const [word, setWord] = React.useState(content?.word);
  const [type, setType] = React.useState(content?.type);
  const [transcription, setTranscription] = React.useState(content?.transcription);
  const [meaning, setMeaning] = React.useState(content?.meaning);
  const [example, setExample] = React.useState(content?.example);

  React.useEffect(() => {
    setWord(content?.word);
    setType(content?.type);
    setTranscription(content?.transcription);
    setMeaning(content?.meaning);
    setExample(content?.example);
  }, [content]);

  const updatedContent = React.useMemo(() => {
    if (!word || !meaning) {
      return;
    }

    return { word, type, transcription, meaning, example } as IFlashcardContent;
  }, [word, type, transcription, meaning, example]);

  React.useEffect(() => {
    setContentUpdate(updatedContent);
  });

  return (
    <Modal
      animationType="slide"
      visible={show}
      onRequestClose={onHideModal}
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 36 : 36}
        style={[styles.modalContainer, { backgroundColor: colors.surfaceSecondary }]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                    Word or Phrase (*)
                  </Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    autoCapitalize="none"
                    value={word}
                    onChangeText={setWord}
                    placeholder="Word or phrase"
                  />

                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Type</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    autoCapitalize="none"
                    value={type}
                    onChangeText={setType}
                    placeholder="Type"
                  />

                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                    Transcript
                  </Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    autoCapitalize="none"
                    value={transcription}
                    onChangeText={setTranscription}
                    placeholder="Transcript"
                  />

                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                    Meaning (*)
                  </Text>
                  <TextInput
                    multiline
                    style={[
                      styles.input,
                      styles.multilineInput,
                      { color: colors.text, borderColor: colors.border },
                    ]}
                    autoCapitalize="none"
                    value={meaning}
                    onChangeText={setMeaning}
                    placeholder="Meaning"
                  />

                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Example</Text>
                  <TextInput
                    multiline
                    style={[
                      styles.input,
                      styles.multilineInput,
                      { color: colors.text, borderColor: colors.border },
                    ]}
                    autoCapitalize="none"
                    value={example}
                    onChangeText={setExample}
                    placeholder="Example"
                  />
                </View>
                <View style={{ height: footerComponent ? 0 : 50 }} />
              </ScrollView>
              {footerComponent && (
                <View
                  style={[
                    styles.footerComponentWrap,
                    { backgroundColor: colors.surfaceSecondary, borderTopColor: colors.border },
                  ]}
                >
                  {footerComponent}
                </View>
              )}
            </>
          )}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    fontWeight: "500",
  },
  footerComponentWrap: {
    borderTopWidth: 1,
    padding: 16,
    paddingBottom: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
});

export default FlashcardSheet;
