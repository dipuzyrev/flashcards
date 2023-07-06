import * as React from 'react';
import { Button, Text, View, StyleSheet, SafeAreaView, TextInput, Pressable } from 'react-native';

const TranslateForm = ({ navigation }) => {
  const [text, onChangeText] = React.useState('');
  const [contextPhrase, onChangeContextPhrase] = React.useState('');

  const onTranslateClick = () => {
    if (!text) {
      return;
    }
    onChangeText('')
    onChangeContextPhrase('')
    navigation.navigate('TranslateResult', {
      text,
      contextPhrase
    })
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={text}
            onChangeText={onChangeText}
            onSubmitEditing={onTranslateClick}
            placeholder="Word or idiom"
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            // multiline
            // numberOfLines={4}
            value={contextPhrase}
            onChangeText={onChangeContextPhrase}
            onSubmitEditing={onTranslateClick}
            placeholder="Optional context — sentence or phrase"
          />
        </View>
        <Pressable onPress={onTranslateClick} style={({ pressed }) => {
          return [
            styles.mainActionBtn,
            { opacity: pressed ? 0.5 : 1 }
          ]
        }}>
          <Text style={styles.mainActionBtnText}>Explain</Text>
        </Pressable>
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 16,
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
  input: {
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    padding: 12,
    paddingVertical: 16,
    borderRadius: 8
  },
  // bigInput: {
  //   fontSize: 16,
  //   borderWidth: 1,
  //   padding: 12,
  //   paddingTop: 20,
  //   paddingBottom: 20,
  //   height: 100,
  //   borderRadius: 8
  // },
});

export default TranslateForm;
