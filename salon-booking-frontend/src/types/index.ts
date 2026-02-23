export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: 'CUSTOMER' | 'SALON' | 'ADMIN'
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone: string
  role: 'CUSTOMER' | 'SALON'
}

export interface Salon {
  id: string
  _id?: string 
  name: string
  address: string
  city: string
  phone: string
  email: string
  rating: number
  image: string
  images?: string[]
  phoneNumber?: string
  ownerId?: string
  description: string
  createdAt: string
  openTime?: string
  closeTime?: string
}

export interface Service {
  id: string
  salonId: string
  name: string
  category: string
  price: number
  duration: number
  description: string
  createdAt: string
}

export interface Booking {
  id: string
  customerId: string
  salonId: string
  serviceId?: string
  serviceIds?: string[]
  date?: string  // Keep for backward compatibility
  time?: string  // Keep for backward compatibility
  startTime?: string  // Add this - from backend
  endTime?: string    // Add this - from backend
  status: 'PENDING' | 'CONFIRM' | 'COMPLETED' | 'CANCELLED'
  totalPrice: number
  paymentStatus?: string
  paymentMethod?: string
  notes?: string
  createdAt?: string
}

export interface BookingRequest {
  salonId: string
  serviceId: string
  date: string
  time: string
  notes?: string
}

export interface Category {
  id: string
  name: string
  description: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
