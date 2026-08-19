import { createContext, useContext, useState, useEffect } from 'react'
import api from '@/services/api'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [loadingSettings, setLoadingSettings] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings')
        setSettings(data)
      } catch (err) {
        console.error('Failed to load settings', err)
      } finally {
        setLoadingSettings(false)
      }
    }
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loadingSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
