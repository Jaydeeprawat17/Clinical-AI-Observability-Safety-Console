import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { Alert } from 'react-native'
import { useAppStore } from '../store/useAppStore'

export const useImageUpload = () => {
  const { setUploadedImage } = useAppStore()

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled && result.assets[0]) {
      await compressAndSet(result.assets[0].uri)
    }
  }

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled && result.assets[0]) {
      await compressAndSet(result.assets[0].uri)
    }
  }

  const compressAndSet = async (uri: string) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }],
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
    )
    setUploadedImage(manipResult.uri)
  }

  return { pickImage, takePhoto }
}