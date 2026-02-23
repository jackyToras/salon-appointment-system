import { create } from 'zustand'
import { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  login: (user: User, token: string) => void
  logout: () => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => {
  // Try to restore from localStorage
  const savedUser = localStorage.getItem('user')
  const savedToken = localStorage.getItem('token')

  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken,
    loading: false,
    error: null,

    login: (user, token) => {
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      set({ user, token, error: null })
    },

    logout: () => {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      set({ user: null, token: null })
    },

    setError: (error) => set({ error }),
  }
})