import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isLoggedIn, doLogout, getUsername, getUserRoles } from '../../services/keycloakService'
import { Menu, X, Home, Scissors, LayoutDashboard, Calendar, LogOut, User } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const loggedIn = isLoggedIn()
  const username = getUsername()
  const roles = getUserRoles()

  const handleLogout = () => {
    doLogout()
    setIsMenuOpen(false)
  }

  const getDashboardLink = () => {
    if (!loggedIn) return null
    
    if (roles.includes('ADMIN')) return '/admin/dashboard'
    if (roles.includes('SALON_OWNER')) return '/salon/dashboard'
    if (roles.includes('CUSTOMER')) return '/customer/dashboard'
    
    return null
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-slate-900 hover:text-slate-700 transition-colors"
            onClick={closeMenu}
          >
            <Scissors className="w-6 h-6" />
            <span className="text-xl font-semibold">Salon Booking</span>
          </Link>

          {/* Burger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Slide-down Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            
            {/* User Info */}
            {loggedIn && (
              <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
                  {username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{username}</p>
                  <p className="text-xs text-slate-500">Account settings</p>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="space-y-1">
              <Link
                to="/"
                className="flex items-center space-x-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                onClick={closeMenu}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>

              <Link
                to="/salons"
                className="flex items-center space-x-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                onClick={closeMenu}
              >
                <Scissors className="w-5 h-5" />
                <span className="font-medium">Browse Salons</span>
              </Link>

              {loggedIn && (
                <>
                  <Link
                    to={getDashboardLink() || '/'}
                    className="flex items-center space-x-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>

                  <Link
                    to="/customer/bookings"
                    className="flex items-center space-x-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">My Bookings</span>
                  </Link>
                </>
              )}
            </nav>

            {/* Auth Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {loggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2.5 text-center border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors font-medium"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-4 py-2.5 text-center bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors font-medium"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}