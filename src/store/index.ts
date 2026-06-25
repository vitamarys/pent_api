import { create } from 'zustand'

interface SearchState {
  query: string
  setQuery: (query: string) => void
  reset: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  reset: () => set({ query: '' }),
}))
