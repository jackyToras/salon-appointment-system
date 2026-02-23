import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doLogin, isLoggedIn } from '../../services/keycloakService'

export default function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // If already logged in, redirect to home
    if (isLoggedIn()) {
      navigate('/')
    } else {
      // Redirect to Keycloak login
      doLogin()
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-xl">Redirecting to login...</p>
      </div>
    </div>
  )
}