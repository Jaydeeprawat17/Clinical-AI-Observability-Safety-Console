import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
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
    await generate(prompt);
    navigation.navigate('Results');
  };

  return (
    <View className="flex-1 bg-zinc-900 p-6">
      <Text className="text-2xl font-bold text-white mb-2">Describe the person</Text>
      <TextInput
        className="bg-zinc-800 text-white p-5 rounded-2xl h-32"
        placeholder="Young man with glasses, short black hair..."
        placeholderTextColor="#666"
        value={prompt}
        onChangeText={setPrompt}
        multiline
      />

      <TouchableOpacity
        onPress={handleGenerate}
        className="bg-green-500 py-6 rounded-2xl mt-12"
      >
        <Text className="text-white text-center text-2xl font-bold">Generate All 5 Styles</Text>
      </TouchableOpacity>
    </View>
  );
}