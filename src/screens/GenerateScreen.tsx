import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { useClipartGeneration } from '../hooks/useClipartGeneration';
import { useNavigation } from '@react-navigation/native';

export default function GenerateScreen() {
  const navigation = useNavigation<any>();
  const { uploadedImage } = useAppStore();
  const { generate } = useClipartGeneration();
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!uploadedImage) {
      Alert.alert('Error', 'Upload an image first!');
      return;
    }
    const isGenerated = await generate(prompt);
    if (!isGenerated) {
      return;
    }
    navigation.navigate('Results');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Describe the person</Text>
      <TextInput
        style={styles.input}
        placeholder="Young man with glasses, short black hair..."
        placeholderTextColor="#666"
        value={prompt}
        onChangeText={setPrompt}
        multiline
      />

      <TouchableOpacity
        onPress={handleGenerate}
        style={styles.generateButton}
        activeOpacity={0.85}
      >
        <Text style={styles.generateButtonText}>Generate All 5 Styles</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#27272a',
    color: '#ffffff',
    padding: 20,
    borderRadius: 16,
    height: 128,
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 24,
    borderRadius: 16,
    marginTop: 48,
  },
  generateButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
});