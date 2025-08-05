'use client'

import { Provider } from 'jotai'
import { jotaiStore } from '@/lib/store'

interface FormStoreProviderProps {
  children: React.ReactNode
}

export function FormStoreProvider({ children }: FormStoreProviderProps) {
  return <Provider store={jotaiStore}>{children}</Provider>
}
