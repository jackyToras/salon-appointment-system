import { create } from 'zustand'
import { Booking } from '../types'

interface BookingState {
  bookings: Booking[]
  currentBooking: Booking | null
  loading: boolean

  setBookings: (bookings: Booking[]) => void
  setCurrentBooking: (booking: Booking | null) => void
  setLoading: (loading: boolean) => void
  addBooking: (booking: Booking) => void
  updateBooking: (booking: Booking) => void
  removeBooking: (id: string) => void
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  currentBooking: null,
  loading: false,

  setBookings: (bookings) => set({ bookings }),
  setCurrentBooking: (currentBooking) => set({ currentBooking }),
  setLoading: (loading) => set({ loading }),

  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),

  updateBooking: (booking) =>
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === booking.id ? booking : b)),
    })),

  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),
}))
