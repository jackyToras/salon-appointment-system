import { Navigate } from 'react-router-dom'
import { isLoggedIn, getUserRoles } from '../../services/keycloakService'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'CUSTOMER' | 'SALON' | 'ADMIN'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const loggedIn = isLoggedIn()
  const roles = getUserRoles()

  console.log('============================')
  console.log('🔒 ProtectedRoute DEBUG')
  console.log('Required role:', requiredRole)
  console.log('Is logged in:', loggedIn)
  console.log('User roles:', roles)
  console.log('Has required role:', requiredRole ? roles.includes(requiredRole) : 'N/A')
  console.log('============================')

  if (!loggedIn) {
    console.log('❌ REDIRECTING TO LOGIN - Not logged in')
    return <Navigate to="/login" replace />
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    console.log('❌ REDIRECTING TO HOME - Wrong role')
    return <Navigate to="/" replace />
  }

  console.log('✅ ACCESS GRANTED - Rendering children')
  return <>{children}</>
}