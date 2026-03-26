import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { useImageUpload } from '../hooks/useImageUpload';
import { useNavigation } from '@react-navigation/native';

export default function UploadScreen() {
  const navigation = useNavigation<any>();
  const { uploadedImage } = useAppStore();
  const { pickImage, takePhoto } = useImageUpload();

  const goToGenerate = () => {
    if (!uploadedImage) {
      Alert.alert('Upload first', 'Please upload an image before continuing');
      return;
    }
    navigation.navigate('Generate');
  };

  return (
    <ScrollView className="flex-1 bg-zinc-900 p-6">
      <Text className="text-3xl font-bold text-white text-center mt-10">AI Clipart Generator</Text>

      {uploadedImage ? (
        <Image source={{ uri: uploadedImage }} className="w-full h-96 rounded-3xl mt-8" resizeMode="cover" />
      ) : (
        <View className="h-96 bg-zinc-800 rounded-3xl mt-8 flex items-center justify-center border-2 border-dashed border-zinc-600">
          <Text className="text-zinc-400 text-lg">Your photo preview appears here</Text>
        </View>
      )}

      <View className="mt-8 space-y-4">
        <TouchableOpacity onPress={takePhoto} className="bg-blue-600 py-6 rounded-2xl">
          <Text className="text-white text-center text-xl font-semibold">📸 Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} className="bg-zinc-700 py-6 rounded-2xl">
          <Text className="text-white text-center text-xl font-semibold">🖼️ Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      {uploadedImage && (
        <TouchableOpacity
          onPress={goToGenerate}
          className="mt-10 bg-green-500 py-6 rounded-2xl"
        >
          <Text className="text-white text-center text-2xl font-bold">Next → Choose Styles</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}