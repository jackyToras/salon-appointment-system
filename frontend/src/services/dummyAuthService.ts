/**
 * ============================================
 * DUMMY AUTH SERVICE - For Development/Testing
 * ============================================
 * 
 * This service provides hardcoded test users for development
 * Replace this with real API calls when backend is ready
 */

export interface DummyUser {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'SALON_OWNER' | 'ADMIN'
  phone: string
  profileImage?: string
}

const DUMMY_USERS: Record<string, DummyUser & { password: string }> = {
  // Customer user
  customer: {
    id: 'user-001',
    name: 'Aditya Singh',
    email: 'customer@gmail.com',
    password: 'password123',
    role: 'CUSTOMER',
    phone: '9876543210',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Customer',
  },
  // Salon owner user
  salonowner: {
    id: 'salon-owner-001',
    name: 'Priya Kapoor',
    email: 'salonowner@gmail.com',
    password: 'password123',
    role: 'SALON_OWNER',
    phone: '9876543211',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SalonOwner',
  },
  // Admin user
  admin: {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'password123',
    role: 'ADMIN',
    phone: '9876543212',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  },
}

// Simulate authentication with delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Generate mock JWT token (NOT REAL - for development only)
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
      roles: ['ROLE_USER'],
    })
  )
  const signature = btoa('dummy-signature-for-development')
  return `${header}.${payload}.${signature}`
}

export class DummyAuthService {
  /**
   * Simulate login with dummy users
   * Email: customer@gmail.com | Password: password123
   * Email: salonowner@gmail.com | Password: password123
   * Email: admin@gmail.com | Password: password123
   */
  static async login(
    email: string,
    password: string
  ): Promise<{ user: DummyUser; token: string }> {
    await delay(500) // Simulate network delay

    // Find user by email
    const user = Object.values(DUMMY_USERS).find((u) => u.email === email)

    if (!user) {
      throw {
        response: {
          status: 401,
          data: {
            message: 'User not found. Please use one of the test accounts.',
            testAccounts: [
              { email: 'customer@gmail.com', password: 'password123', role: 'CUSTOMER' },
              { email: 'salonowner@gmail.com', password: 'password123', role: 'SALON_OWNER' },
              { email: 'admin@gmail.com', password: 'password123', role: 'ADMIN' },
            ],
          },
        },
      }
    }

    // Check password
    if (user.password !== password) {
      throw {
        response: {
          status: 401,
          data: {
            message: 'Invalid password. Correct password is: password123',
          },
        },
      }
    }

    // Remove password from returned user
    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token: generateMockToken(user.id),
    }
  }

  /**
   * Simulate registration (for testing)
   */
  static async register(data: {
    name: string
    email: string
    password: string
    role: 'CUSTOMER' | 'SALON_OWNER' | 'ADMIN'
    phone: string
  }): Promise<{ user: DummyUser; token: string }> {
    await delay(500)

    // Check if user already exists
    const existingUser = Object.values(DUMMY_USERS).find((u) => u.email === data.email)
    if (existingUser) {
      throw {
        response: {
          status: 400,
          data: {
            message: 'User with this email already exists',
          },
        },
      }
    }

    // Create new user (in-memory only)
    const newUser: DummyUser & { password: string } = {
      id: `user-${Date.now()}`,
      ...data,
    }

    const { password: _, ...userWithoutPassword } = newUser

    return {
      user: userWithoutPassword,
      token: generateMockToken(newUser.id),
    }
  }

  /**
   * Get test users for display
   */
  static getTestUsers() {
    return Object.entries(DUMMY_USERS).map(([key, user]) => ({
      label: `${user.name} (${user.role})`,
      email: user.email,
      password: user.password,
      role: user.role,
    }))
  }
}
