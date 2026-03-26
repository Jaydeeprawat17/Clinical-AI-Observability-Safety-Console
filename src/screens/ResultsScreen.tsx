import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import SkeletonLoader from '../components/SkeletonLoader';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function ResultsScreen() {
  const { results, isGenerating, uploadedImage } = useAppStore();

  const downloadImage = async (uri: string, style: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('✅ Saved!', `Clipart (${style}) saved to your Gallery`);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not save image');
    }
  };

  const shareImage = async (uri: string) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('Sharing not available');
    }
  };

  if (isGenerating) {
    return (
      <ScrollView className="flex-1 bg-zinc-900 p-6">
        <Text className="text-white text-2xl mb-6">Generating 5 styles in parallel...</Text>
        <View className="flex-row flex-wrap justify-between gap-4">
          {Array(5).fill(0).map((_, i) => <SkeletonLoader key={i} />)}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-zinc-900 p-6">
      <Text className="text-white text-2xl mb-6">Your AI Clipart Styles</Text>

      {/* Before / After section (bonus) */}
      {uploadedImage && (
        <View className="mb-8 bg-zinc-800 rounded-3xl p-4">
          <Text className="text-zinc-400 text-center mb-3">Original vs Clipart</Text>
          <View className="flex-row justify-between">
            <Image source={{ uri: uploadedImage }} className="w-[48%] h-56 rounded-2xl" />
            <Image source={{ uri: results[0]?.image }} className="w-[48%] h-56 rounded-2xl" />
          </View>
        </View>
      )}

      <View className="flex-row flex-wrap justify-between gap-4">
        {results.map((result, index) => (
          <View key={index} className="w-[48%] bg-zinc-800 rounded-3xl p-3">
            <Image source={{ uri: result.image }} className="w-full h-64 rounded-2xl" resizeMode="cover" />
            <Text className="text-white text-center mt-3 capitalize font-semibold">{result.style}</Text>

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                onPress={() => downloadImage(result.image, result.style)}
                className="flex-1 bg-blue-600 py-3 rounded-2xl mr-2"
              >
                <Text className="text-white text-center text-sm font-bold">⬇️ Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => shareImage(result.image)}
                className="flex-1 bg-zinc-700 py-3 rounded-2xl"
              >
                <Text className="text-white text-center text-sm font-bold">↗️ Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}