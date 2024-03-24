import { createWithEqualityFn } from 'zustand/traditional'

interface DocumentPathState {
  path: string
  set: (path: string) => void
}

export const useDocumentPathStore = createWithEqualityFn<DocumentPathState>()(
  (set) => ({
    path: '',
    set: (path: string) => set({ path }),
  })
)
