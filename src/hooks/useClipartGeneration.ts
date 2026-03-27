import { useAppStore } from '../store/useAppStore';
import { generateClipart } from '../services/api';
import { uriToBase64 } from '../utils/imageToBase64';
import { Alert } from 'react-native';

export const useClipartGeneration = () => {
  const { uploadedImage, setIsGenerating, setResults, clearResults } = useAppStore();

  const generate = async (prompt: string) => {
    if (!uploadedImage) {
      Alert.alert('Error', 'Upload an image first!');
      return;
    }
    if (!prompt) {
      Alert.alert('Error', 'Please describe the person');
      return;
    }

    clearResults();
    setIsGenerating(true);

    try {
      const imageBase64 = await uriToBase64(uploadedImage);
      const data = await generateClipart(prompt, imageBase64);
      setResults(data.results);
    } catch (err: any) {
      Alert.alert('Generation failed', err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate };
};