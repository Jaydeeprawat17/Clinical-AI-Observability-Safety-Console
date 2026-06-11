import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { useOfflineClipartGeneration } from '../hooks/useOfflineClipartGeneration';
import { useNavigation } from '@react-navigation/native';

export default function GenerateScreen() {
  const navigation = useNavigation<any>();
  const { uploadedImage } = useAppStore();
  const { generate } = useOfflineClipartGeneration();

  const handleGenerate = async () => {
    if (!uploadedImage) {
      Alert.alert('Error', 'Upload an image first!');
      return;
    }
    
    // Using setTimeout to allow the UI to transition/render navigating before Skia blocks the JS thread intensely
    navigation.navigate('Results');
    setTimeout(async () => {
      await generate();
    }, 100);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready to apply filters</Text>
      <Text style={styles.subtitle}>5 vibrant styles generated entirely on-device</Text>

      {uploadedImage && (
        <Image
          source={{ uri: uploadedImage }}
          style={styles.previewImage}
          resizeMode="cover"
        />
      )}

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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    marginBottom: 32,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 384,
    borderRadius: 24,
    marginBottom: 24,
  },
  generateButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 24,
    borderRadius: 16,
    marginTop: 'auto',
    marginBottom: 16,
  },
  generateButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
});