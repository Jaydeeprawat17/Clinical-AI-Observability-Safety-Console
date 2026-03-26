import { create } from 'zustand'

interface Result {
  style: string
  image: string
}

interface AppState {
  uploadedImage: string | null
  results: Result[]
  isGenerating: boolean
  setUploadedImage: (uri: string) => void
  setResults: (results: Result[]) => void
  setIsGenerating: (loading: boolean) => void
  clearResults: () => void
}

export const useAppStore = create<AppState>((set) => ({
  uploadedImage: null,
  results: [],
  isGenerating: false,
  setUploadedImage: (uri) => set({ uploadedImage: uri }),
  setResults: (results) => set({ results }),
  setIsGenerating: (loading) => set({ isGenerating: loading }),
  clearResults: () => set({ results: [] }),
}))