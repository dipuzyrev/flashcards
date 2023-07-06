import * as React from 'react';
import Config from "react-native-config";
import { Button, Text, View, StyleSheet, ActivityIndicator, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { addDefinitions } from "~/store/reducers/dictionarySlice";
import { useAppDispatch } from "~/store/types";
import { Configuration, OpenAIApi } from "openai";

const TranslateResult = ({ navigation, route }) => {
  const { text, contextPhrase } = route.params;
  const dispatch = useAppDispatch();

  // const dummyData = [
  //   {
  //     definition: "Related to or coming from a god; holy",
  //     example: "The divine light shone from the artifact.",
  //     synonyms: ["Sacred", "godly", "heavenly"],
  //     wordType: "adjective",
  //   },
  //   {
  //     definition: "Exceptionally good or beautiful; perfect.",
  //     example: "Leeloo was seen as divine by Korben Dallas.",
  //     synonyms: ["Wonderful", "marvelous", "magnificent"],
  //     wordType: "adjective",
  //   },
  // ]

  const [data, setData] = React.useState([]);

  const handleResponse = (response) => {
    const definitions = response.split('***').map(item => {
      const rawText = item.trim();
      const wordType = rawText.match(/\[T\]\{(.*?)\}/)[1];
      const definition = rawText.match(/\[D\]\{(.*?)\}/)[1];
      const example = rawText.match(/\[E\]\{(.*?)\}/)[1];
      const synonyms = rawText.match(/\[S\]\{(.*?)\}/)[1].split('|');
      return {
        wordType,
        definition,
        example,
        synonyms,
      }
    });
    setData(definitions);
  }

  const callApi = () => {
    const configuration = new Configuration({
      apiKey: Config.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    let prompt = `Common meanings for word "${text}". Explanations shouldn't be longer than 5-8 words and should consist of basic vocabulary where possible. For each explanation provide simple example of usage, type of word (part of speed or "idiom" if it is) and few synonyms corresponding to the explanation. `

    prompt += `\nEach definition should be separated with 3 asterics (***). Each definition format: 
      [T]{<type>}[D]{<definition>}[E]{<example>}[S]{<synonym1>|<synonym2>...>}
    `;

    if (contextPhrase) {
      prompt += `\nShow only definitions which correspond to meaning of this word in following sentence: ${contextPhrase}`
    }

    // console.log('prompt', prompt);

    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are English language professional helping user to create flashcards to learn words." },
        { role: "user", content: prompt }
      ],
    }).then((response) => {
      console.log(response.data.choices[0].message.content);
      handleResponse(response.data.choices[0].message.content);
    }).catch((error) => {
      console.log(error);
    });
    // console.log(chatCompletion.data.choices[0].message);
  }

  React.useEffect(() => {
    callApi();
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
      {!data.length ? <View style={styles.loaderContainer}>
        <ActivityIndicator />
      </View> :
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
                  <Text><Text style={{ fontWeight: 'bold' }}>Synonyms:</Text> {item.synonyms.join(' ')}</Text>
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
