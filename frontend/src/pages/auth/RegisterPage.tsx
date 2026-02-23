import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../../services/keycloakService'

export default function RegisterPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/')
    } else {
      // Simple Keycloak registration
      const keycloakUrl = 'http://localhost:8180'
      const realm = 'salon-booking-realm'
      const clientId = 'gateway-service'
      const redirectUri = encodeURIComponent(window.location.origin)
      
      const registrationUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/registrations?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`
      
      window.location.href = registrationUrl
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-xl">Redirecting to registration...</p>
      </div>
    </div>
  )
}