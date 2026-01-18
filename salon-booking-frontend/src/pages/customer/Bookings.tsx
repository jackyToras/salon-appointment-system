import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient'
import { getUserId } from '../../services/keycloakService'
import { Booking } from '../../types'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Calendar, Clock, MapPin, XCircle, AlertTriangle, AlertCircle, CheckCircle, CreditCard, Scissors, Download, Search, Filter, Eye, Star, Phone, User, ChevronDown, Receipt, MoreVertical } from 'lucide-react'

export default function CustomerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      const customerId = getUserId()

      if (!customerId) {
        setError('No customer ID found - please log in again')
        return
      }

      const data = await apiClient.getCustomerBookings(customerId)
      console.log('Bookings data:', data)
      console.log('First booking:', data[0])
      
      const sortedBookings = Array.isArray(data) 
        ? data.sort((a: Booking, b: Booking) => 
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          )
        : []
      
      setBookings(sortedBookings)

    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const openCancelModal = (id: string) => {
    setBookingToCancel(id)
    setShowCancelModal(true)
  }

  const closeCancelModal = () => {
    setShowCancelModal(false)
    setBookingToCancel(null)
  }

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return

    try {
      setCancellingId(bookingToCancel)
      await apiClient.cancelBooking(bookingToCancel)

      setBookings(bookings.map(b =>
        b.id === bookingToCancel ? { ...b, status: 'CANCELLED' } : b
      ))

      closeCancelModal()

    } catch (error: any) {
      alert('Failed to cancel booking')
    } finally {
      setCancellingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
      CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
      CANCELLED: 'bg-red-50 text-red-700 border-red-200',
      COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200'
    }

    const icons = {
      PENDING: <AlertCircle className="w-3.5 h-3.5" />,
      CONFIRMED: <CheckCircle className="w-3.5 h-3.5" />,
      CANCELLED: <XCircle className="w-3.5 h-3.5" />,
      COMPLETED: <CheckCircle className="w-3.5 h-3.5" />
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.PENDING}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    )
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const styles = {
      PENDING: 'bg-gray-50 text-gray-700 border-gray-200',
      PAID: 'bg-green-50 text-green-700 border-green-200',
      FAILED: 'bg-red-50 text-red-700 border-red-200',
      REFUNDED: 'bg-orange-50 text-orange-700 border-orange-200'
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[paymentStatus as keyof typeof styles] || styles.PENDING}`}>
        <CreditCard className="w-3 h-3" />
        {paymentStatus}
      </span>
    )
  }

  const filteredBookings = bookings
    .filter(booking => {
      if (filter === 'all') return true
      
      const bookingDate = new Date(booking.startTime)
      const now = new Date()
      
      if (filter === 'upcoming') {
        return bookingDate >= now
      } else {
        return bookingDate < now
      }
    })
    .filter(booking => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return booking.id.toLowerCase().includes(search)
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Bookings</h3>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Bookings
                </h1>
              </div>
              <p className="text-sm text-gray-600 ml-14">View and manage your salon appointments</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200">
                <Download className="w-4 h-4 inline mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => new Date(b.startTime) >= new Date()).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{bookings.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  filter === 'upcoming'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  filter === 'past'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Past
              </button>
            </div>

            {/* Search */}
            <div className="flex-1 flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200">
                <Filter className="w-4 h-4 inline mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-16 text-center shadow-sm">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-2xl rounded-full" />
              <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <Calendar className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto">
              {filter === 'all' 
                ? "You haven't made any bookings yet. Start exploring salons near you!" 
                : `You have no ${filter} bookings.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="group bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
                              <Scissors className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Booking #{booking.id.slice(-8).toUpperCase()}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {booking.salonId?.name || booking.salon?.name || 'Premium Salon Appointment'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap mb-4">
                            {getStatusBadge(booking.status)}
                            {booking.paymentStatus && getPaymentStatusBadge(booking.paymentStatus)}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="font-medium">
                                  {booking.startTime ? formatDate(booking.startTime) : booking.date || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Clock className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Time</p>
                                <p className="font-medium">
                                  {booking.startTime && booking.endTime
                                    ? `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`
                                    : booking.time || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <CreditCard className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Payment</p>
                                <p className="font-medium capitalize">{booking.paymentMethod || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                              <div className="p-2 bg-orange-100 rounded-lg">
                                <MapPin className="w-4 h-4 text-orange-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="font-medium text-blue-600">
                                  {booking.location || 'View on map'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Expandable Details */}
                          {expandedBooking === booking.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                              <div className="flex items-center gap-3 text-sm">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Stylist: <span className="font-medium text-gray-900">Professional Stylist</span></span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Contact: <span className="font-medium text-gray-900">Available after confirmation</span></span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-gray-600">Rating: <span className="font-medium text-gray-900">4.8 / 5.0</span></span>
                              </div>
                            </div>
                          )}

                          <button 
                            onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                          >
                            {expandedBooking === booking.id ? 'Show less' : 'Show more details'}
                            <ChevronDown className={`w-4 h-4 transition-transform ${expandedBooking === booking.id ? 'rotate-180' : ''}`} />
                          </button>
                        </div>

                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Right: Price & Actions */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-6 min-w-[200px]">
                      <div className="text-left lg:text-right">
                        <p className="text-xs font-medium text-gray-500 mb-2">Total Amount</p>
                        <div className="flex items-baseline gap-1 lg:justify-end">
                          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ₹{booking.totalPrice.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                      </div>
                      
                      <div className="flex flex-col gap-2 w-full lg:w-auto">
                        <button className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        {booking.status === 'PENDING' && (
                          <button 
                            onClick={() => openCancelModal(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="px-4 py-2.5 text-sm font-medium border-2 border-red-300 text-red-700 bg-white rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                        {booking.status === 'COMPLETED' && (
                          <button className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2">
                            <Receipt className="w-4 h-4" />
                            Get Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Gradient Bottom Border */}
                <div className="h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-blue-500 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-500" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Cancel Booking?</h3>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={closeCancelModal}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
              >
                No, Keep it
              </button>
              <button
                onClick={confirmCancelBooking}
                disabled={!!cancellingId}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all disabled:opacity-50"
              >
                {cancellingId ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}