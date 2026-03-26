import { useAppStore } from '../store/useAppStore'
import { generateClipart } from '../services/api'
import { Alert } from 'react-native'

export const useClipartGeneration = () => {
  const { setIsGenerating, setResults, clearResults } = useAppStore()

  const generate = async (prompt: string) => {
    if (!prompt) {
      Alert.alert('Error', 'Please enter a description of the person in the photo')
      return
    }

    clearResults()
    setIsGenerating(true)

    try {
      const data = await generateClipart(prompt)
      setResults(data.results)
    } catch (err: any) {
      Alert.alert('Generation failed', err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return { generate }
}