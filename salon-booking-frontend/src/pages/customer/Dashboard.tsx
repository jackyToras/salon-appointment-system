import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../services/apiClient'
import { Booking } from '../../types'
import { Calendar, Clock, ArrowUpRight, TrendingUp, CheckCircle2, XCircle, Sparkles, Eye } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalSpent: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
      const customerId = userInfo.sub
      
      if (!customerId) {
        console.error('No customer ID found')
        return
      }

      const bookingsData = await apiClient.getCustomerBookings(customerId)
      setBookings(bookingsData)

      const now = new Date()
      const upcoming = bookingsData.filter((b: Booking) => {
        if (b.startTime) {
          return new Date(b.startTime) >= now
        }
        return b.status === 'PENDING' || b.status === 'CONFIRM'
      })
      const completed = bookingsData.filter((b: Booking) => b.status === 'COMPLETED')
      const totalSpent = bookingsData
        .filter((b: Booking) => b.paymentStatus === 'PAID')
        .reduce((sum: number, b: Booking) => sum + b.totalPrice, 0)

      setStats({
        totalBookings: bookingsData.length,
        upcomingBookings: upcoming.length,
        completedBookings: completed.length,
        totalSpent
      })

    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (booking: Booking) => {
    if (booking.startTime) {
      const date = new Date(booking.startTime)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
    return booking.date || 'Date not available'
  }

  const formatTime = (booking: Booking) => {
    if (booking.startTime) {
      return new Date(booking.startTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }
    return booking.time || ''
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-neutral-600 mt-0.5">Overview of your bookings and activity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Bookings */}
          <div className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-600">Total Bookings</span>
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-neutral-900 tracking-tight mb-1">
                {stats.totalBookings}
              </div>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500" />
            </div>
          </div>

          {/* Upcoming */}
          <div className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-600">Upcoming</span>
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-neutral-900 tracking-tight mb-1">
                {stats.upcomingBookings}
              </div>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500" />
            </div>
          </div>

          {/* Completed */}
          <div className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-600">Completed</span>
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-neutral-900 tracking-tight mb-1">
                {stats.completedBookings}
              </div>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500" />
            </div>
          </div>

          {/* Total Spent */}
          <div className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-600">Total Spent</span>
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-neutral-900 tracking-tight mb-1">
                ₹{stats.totalSpent.toLocaleString()}
              </div>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" />
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-200/50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Recent Bookings</h2>
              <p className="text-sm text-neutral-600 mt-1">Your latest appointments</p>
            </div>
            <Link
              to="/customer/bookings"
              className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
            >
              View all
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200/50 bg-gray-50/50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/50">
                  {bookings.slice(0, 5).map((booking) => (
                    <tr key={booking.id} className="group hover:bg-indigo-50/50 transition-all duration-200">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 font-mono bg-neutral-100 group-hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors">
                          #{booking.id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
                          {formatDate(booking)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors">
                          <Clock className="w-4 h-4 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
                          {formatTime(booking)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          booking.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 group-hover:shadow-md group-hover:shadow-emerald-200'
                            : booking.status === 'CONFIRM'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200 group-hover:shadow-md group-hover:shadow-blue-200'
                            : booking.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-700 border border-red-200 group-hover:shadow-md group-hover:shadow-red-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200 group-hover:shadow-md group-hover:shadow-amber-200'
                        }`}>
                          {booking.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {booking.status === 'CANCELLED' && <XCircle className="w-3.5 h-3.5" />}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                          ₹{booking.totalPrice.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:gap-2">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-20 text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-2xl rounded-full" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-xl">
                  <Calendar className="w-10 h-10 text-indigo-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">No bookings yet</h3>
              <p className="text-sm text-neutral-600 mb-8 max-w-md mx-auto">
                Start booking appointments with salons and enjoy premium beauty services
              </p>
              <Link
                to="/salons"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
              >
                Browse Salons
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}