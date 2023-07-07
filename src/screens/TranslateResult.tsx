import * as React from 'react';
import Config from "react-native-config";
import { Button, Text, View, StyleSheet, ActivityIndicator, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { addDefinitions } from "~/store/reducers/dictionarySlice";
import { useAppDispatch } from "~/store/types";
import { Configuration, OpenAIApi } from "openai";
import { callApi } from '~/api/open-ai';
import { buildExplanationPrompt } from '~/utils/prompt';

const TranslateResult = ({ navigation, route }) => {
  const { text, contextPhrase } = route.params;
  const dispatch = useAppDispatch();

  const [data, setData] = React.useState([]);

  const handleResponse = (response) => {
    const definitions = response.split('***').map(item => {
      const rawText = item.trim();
      if (!rawText) return null;
      const wordType = rawText.match(/\[T\]\{(.*?)\}/)[1];
      const definition = rawText.match(/\[D\]\{(.*?)\}/)[1];
      const example = rawText.match(/\[E\]\{(.*?)\}/)[1];
      const synonyms = rawText.match(/\[S\]\{(.*?)\}/)[1];
      return {
        wordType,
        definition,
        example,
        synonyms: synonyms.trim() && synonyms.trim() != '""' ? synonyms.trim().split('|') : ['-'],
      }
    }).filter(item => item);
    setData(definitions);
  }

  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    callApi(buildExplanationPrompt(text, contextPhrase))
      .then(handleResponse)
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const [selectedDefinitions, setSelectedDefinitions] = React.useState([]);
  const onDefinitionPress = (index) => {
    if (selectedDefinitions.includes(index)) {
      setSelectedDefinitions(s => s.filter(i => i !== index))
    } else {
      setSelectedDefinitions(s => [...s, index])
    }
  }

  const onAddClick = () => {
    dispatch(addDefinitions(selectedDefinitions.map(index => ({ ...data[index], word: text }))));
    navigation.navigate('TranslateForm');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {!data.length ?
        error ?
          <View style={styles.loaderContainer}>
            <Text>{error}</Text>
          </View>
          :
          <View style={styles.loaderContainer}>
            <ActivityIndicator />
          </View>
        :
        <View style={styles.wrapper}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topContent}>
              <View><Text>Text: <Text style={{ fontWeight: 'bold' }}>{text}</Text></Text></View>
              {!!contextPhrase && <View><Text>Context: {contextPhrase}</Text></View>}
              {data.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => onDefinitionPress(index)}
                  style={{
                    ...styles.definition,
                    backgroundColor: selectedDefinitions.includes(index) ? '#ddd' : 'transparent'
                  }}
                >
                  <Text style={{ color: '#777' }}>{item.wordType}</Text>
                  <Text style={{ paddingVertical: 10, fontSize: 18, }}>{item.definition}</Text>
                  <Text><Text style={{ fontWeight: 'bold' }}>Example:</Text> {item.example}</Text>
                  <Text><Text style={{ fontWeight: 'bold' }}>Synonyms:</Text> {item.synonyms.join(', ')}</Text>
                </Pressable>
              ))
              }
            </View>
          </ScrollView>
          <View style={styles.buttonWrapper}>
            <Pressable onPress={onAddClick} disabled={!selectedDefinitions.length} style={({ pressed }) => {
              return [
                styles.mainActionBtn,
                { opacity: (pressed || !selectedDefinitions.length) ? 0.5 : 1 }
              ]
            }}>
              <Text style={styles.mainActionBtnText}>Add ({selectedDefinitions.length})</Text>
            </Pressable>
          </View>
        </View>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
  },
  buttonWrapper: {
    padding: 16,
    backgroundColor: '#fff',
  },
  container: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 16,
  },
  topContent: {
  },
  definition: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 16,
  },
  mainActionBtn: {
    padding: 32,
    paddingVertical: 16,
    backgroundColor: '#000',
    borderRadius: 8
  },
  mainActionBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16
  },
});

export default TranslateResult;
