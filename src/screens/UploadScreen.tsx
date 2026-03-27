import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>AI Clipart Generator</Text>

      {uploadedImage ? (
        <Image
          source={{ uri: uploadedImage }}
          style={styles.previewImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.previewPlaceholder}>
          <Text style={styles.previewPlaceholderText}>
            Your photo preview appears here
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={takePhoto}
          style={[styles.button, styles.buttonPrimary]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>📸 Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.button, styles.buttonSecondary]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>🖼️ Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      {uploadedImage && (
        <TouchableOpacity
          onPress={goToGenerate}
          style={[styles.button, styles.buttonSuccess]}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>Next → Choose Styles</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 40,
  },
  previewImage: {
    width: '100%',
    height: 384,
    borderRadius: 24,
    marginTop: 32,
  },
  previewPlaceholder: {
    width: '100%',
    height: 384,
    borderRadius: 24,
    marginTop: 32,
    backgroundColor: '#27272a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#52525b',
  },
  previewPlaceholderText: {
    color: '#a1a1aa',
    fontSize: 18,
    textAlign: 'center',
  },
  actions: {
    marginTop: 32,
    gap: 16,
  },
  button: {
    paddingVertical: 24,
    borderRadius: 16,
  },
  buttonPrimary: {
    backgroundColor: '#2563eb',
  },
  buttonSecondary: {
    backgroundColor: '#3f3f46',
  },
  buttonSuccess: {
    backgroundColor: '#22c55e',
    marginTop: 40,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  nextButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
});