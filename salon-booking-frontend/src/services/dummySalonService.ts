/**
 * ============================================
 * DUMMY SALON SERVICE - For Development/Testing
 * ============================================
 * 
 * This service provides hardcoded salon data for testing
 * Replace this with real API calls when backend is ready
 */

export interface Salon {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  phone: string
  email: string
  image: string
  rating: number
  reviewCount: number
  openingTime: string
  closingTime: string
  services: string[]
  priceRange: string
}

const DUMMY_SALONS: Salon[] = [
  {
    id: 'salon-001',
    name: 'Glam Studio Baddi',
    description: 'Premium beauty and wellness salon with expert stylists',
    address: 'Mall Road, Baddi',
    city: 'Baddi',
    state: 'Himachal Pradesh',
    phone: '9876543210',
    email: 'glamstudio@example.com',
    image: 'https://images.unsplash.com/photo-1521746906895-fea6c2f51c3d?w=400&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 245,
    openingTime: '09:00 AM',
    closingTime: '09:00 PM',
    services: ['Hair Cut', 'Hair Color', 'Facial', 'Massage', 'Manicure', 'Pedicure'],
    priceRange: '$$$',
  },
  {
    id: 'salon-002',
    name: 'Beauty Bliss',
    description: 'Complete beauty solutions with trained professionals',
    address: 'City Center, Baddi',
    city: 'Baddi',
    state: 'Himachal Pradesh',
    phone: '9876543211',
    email: 'beautybliss@example.com',
    image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 189,
    openingTime: '10:00 AM',
    closingTime: '08:00 PM',
    services: ['Hair Cut', 'Facial', 'Waxing', 'Threading', 'Makeup', 'Bridal'],
    priceRange: '$$',
  },
  {
    id: 'salon-003',
    name: 'Style Express',
    description: 'Quick makeover and styling salon',
    address: 'Market Area, Baddi',
    city: 'Baddi',
    state: 'Himachal Pradesh',
    phone: '9876543212',
    email: 'styleexpress@example.com',
    image: 'https://images.unsplash.com/photo-1596729921213-1b3cfd4ca196?w=400&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 156,
    openingTime: '08:00 AM',
    closingTime: '09:00 PM',
    services: ['Hair Cut', 'Shave', 'Beard Trim', 'Color', 'Highlights'],
    priceRange: '$',
  },
  {
    id: 'salon-004',
    name: 'Luxe Spa & Salon',
    description: 'Luxury spa with world-class treatments',
    address: 'Hotel Complex, Baddi',
    city: 'Baddi',
    state: 'Himachal Pradesh',
    phone: '9876543213',
    email: 'luxespa@example.com',
    image: 'https://images.unsplash.com/photo-1600948836101-f3419079a8ee?w=400&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 312,
    openingTime: '10:00 AM',
    closingTime: '10:00 PM',
    services: ['Spa', 'Massage', 'Facial', 'Body Treatment', 'Therapy'],
    priceRange: '$$$$',
  },
  {
    id: 'salon-005',
    name: 'Chic Cuts Unisex',
    description: 'Modern unisex salon for all your styling needs',
    address: 'Main Street, Baddi',
    city: 'Baddi',
    state: 'Himachal Pradesh',
    phone: '9876543214',
    email: 'chicccuts@example.com',
    image: 'https://images.unsplash.com/photo-1579958618182-3123dd979885?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 203,
    openingTime: '09:00 AM',
    closingTime: '08:30 PM',
    services: ['Hair Cut', 'Color', 'Treatment', 'Styling', 'Kids Cut'],
    priceRange: '$$',
  },
  {
    id: 'salon-006',
    name: 'Divine Beauty Studio',
    description: 'Specialized in bridal and party makeup',
    address: 'Fashion Street, Baddi',
    city: 'Baddi',
    state: 'Himachal Pradesh',
    phone: '9876543215',
    email: 'divinebeauty@example.com',
    image: 'https://images.unsplash.com/photo-1560066169-b2a92f63d590?w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 278,
    openingTime: '10:00 AM',
    closingTime: '07:00 PM',
    services: ['Bridal Makeup', 'Party Makeup', 'Facial', 'Threading', 'Hair Design'],
    priceRange: '$$$',
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class DummySalonService {
  /**
   * Get all salons with pagination and search
   */
  static async getSalons(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ salons: Salon[]; total: number; page: number; limit: number }> {
    await delay(400) // Simulate network delay

    let filtered = DUMMY_SALONS

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = DUMMY_SALONS.filter(
        (salon) =>
          salon.name.toLowerCase().includes(searchLower) ||
          salon.city.toLowerCase().includes(searchLower) ||
          salon.address.toLowerCase().includes(searchLower) ||
          salon.services.some((service) => service.toLowerCase().includes(searchLower))
      )
    }

    const start = (page - 1) * limit
    const end = start + limit
    const paginatedSalons = filtered.slice(start, end)

    return {
      salons: paginatedSalons,
      total: filtered.length,
      page,
      limit,
    }
  }

  /**
   * Get single salon by ID
   */
  static async getSalonById(id: string): Promise<Salon> {
    await delay(300)

    const salon = DUMMY_SALONS.find((s) => s.id === id)
    if (!salon) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'Salon not found',
          },
        },
      }
    }
    return salon
  }

  /**
   * Search salons
   */
  static async searchSalons(
    query: string,
    city?: string
  ): Promise<Salon[]> {
    await delay(300)

    return DUMMY_SALONS.filter(
      (salon) =>
        (salon.name.toLowerCase().includes(query.toLowerCase()) ||
          salon.description.toLowerCase().includes(query.toLowerCase())) &&
        (!city || salon.city.toLowerCase() === city.toLowerCase())
    )
  }

  /**
   * Get all cities with salons
   */
  static getCities(): string[] {
    return [...new Set(DUMMY_SALONS.map((s) => s.city))]
  }

  /**
   * Get salon count
   */
  static getSalonCount(): number {
    return DUMMY_SALONS.length
  }
}
