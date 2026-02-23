import { create } from 'zustand'
import { Salon, Service, Category } from '../types'

interface SalonState {
  salons: Salon[]
  currentSalon: Salon | null
  services: Service[]
  categories: Category[]
  loading: boolean

  setSalons: (salons: Salon[]) => void
  setCurrentSalon: (salon: Salon | null) => void
  setServices: (services: Service[]) => void
  setCategories: (categories: Category[]) => void
  setLoading: (loading: boolean) => void
}

export const useSalonStore = create<SalonState>((set) => ({
  salons: [],
  currentSalon: null,
  services: [],
  categories: [],
  loading: false,

  setSalons: (salons) => set({ salons }),
  setCurrentSalon: (currentSalon) => set({ currentSalon }),
  setServices: (services) => set({ services }),
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),
}))
