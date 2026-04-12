import { useEffect } from 'react'
import { usePreferencesStore } from '@/store/appStore'

export default function PreferencesProvider() {
  useEffect(() => {
    // Subscribe to store changes and apply to DOM
    const unsub = usePreferencesStore.subscribe((state) => {
      document.documentElement.classList.toggle('hc', state.highContrast)
      document.documentElement.dataset.fontSize = state.fontSize
    })

    // Apply current state immediately
    const state = usePreferencesStore.getState()
    document.documentElement.classList.toggle('hc', state.highContrast)
    document.documentElement.dataset.fontSize = state.fontSize

    return unsub
  }, [])

  return null
}
