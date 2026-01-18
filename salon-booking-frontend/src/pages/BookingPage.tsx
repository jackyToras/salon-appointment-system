import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiClient } from '../services/apiClient'
import { Salon, Service } from '../types'
import { getUsername } from '../services/keycloakService'
import { MapPin, Clock, Calendar, CreditCard, CheckCircle, AlertCircle, Sparkles, ArrowRight, Shield, Star, TrendingUp, Users, Award } from 'lucide-react'

export default function BookingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { salon, services, totalPrice } = location.state as {
    salon: Salon
    services: Service[]
    totalPrice: number
  }

  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const username = getUsername()

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00'
  ]

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
      const keycloakId = userInfo.sub
      const email = userInfo.email || ''
      const name = userInfo.name || username || ''

      if (!keycloakId) {
        throw new Error('User not authenticated. Please login again.')
      }

      const totalDuration = services.reduce((sum, s) => sum + s.duration, 0)
      const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`)
      const endDateTime = new Date(startDateTime.getTime() + totalDuration * 60000)

      const bookingData = {
        salonId: salon.id,
        customerId: keycloakId,
        customerName: name,
        customerEmail: email,
        serviceIds: services.map(s => s.id),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        totalPrice: totalPrice,
        paymentMethod: 'CARD',
        status: 'PENDING'
      }

      const bookingResponse = await apiClient.createBooking(bookingData)
      const paymentResponse = await apiClient.createPaymentLink(bookingResponse)

      if (paymentResponse.payment_link_url) {
        sessionStorage.setItem('pendingBookingId', bookingResponse.id || bookingResponse._id)
        window.location.href = paymentResponse.payment_link_url
      } else {
        throw new Error('Payment link not received from server')
      }

    } catch (err: any) {
      console.error('❌ Booking error:', err)
      setError(
        err.response?.data?.message || 
        err.response?.data ||
        err.message || 
        'Failed to process booking. Please try again.'
      )
      setLoading(false)
    }
  }

  const getTotalDuration = () => {
    return services.reduce((sum, s) => sum + s.duration, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with enhanced design */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full shadow-lg mb-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-default">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute"></div>
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-neutral-900">Step 3 of 3 - Almost Done!</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600">
            Complete Your Booking
          </h1>
          <p className="text-xl text-neutral-600 mb-8">Choose your preferred date and time</p>
          
          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-neutral-600">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>Verified Salon</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Best Price</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Salon Info - Enhanced */}
            <div className="group relative bg-white rounded-2xl border-2 border-neutral-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-300">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating particles effect */}
              <div className="absolute top-4 right-4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative p-6 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors duration-300">Salon Details</h2>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </div>
                </div>
              </div>
              <div className="relative p-6">
                <p className="text-3xl font-bold text-neutral-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{salon.name}</p>
                <div className="flex items-center gap-3 text-neutral-600 bg-gradient-to-r from-neutral-50 to-blue-50 px-4 py-3 rounded-xl group-hover:translate-x-2 transition-all duration-300 border border-neutral-200">
                  <MapPin className="w-5 h-5 text-blue-600 group-hover:scale-125 transition-transform" />
                  <span className="font-medium">{salon.address}, {salon.city}</span>
                </div>
                
                {/* Additional info */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-default">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-neutral-600">10K+ Customers</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-default">
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span className="text-neutral-600">Top Rated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Services - Enhanced */}
            <div className="group relative bg-white rounded-2xl border-2 border-neutral-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-purple-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative p-6 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 shadow-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 group-hover:text-purple-600 transition-colors duration-300">Selected Services</h2>
                  </div>
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                    {services.length} Service{services.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <div className="relative p-6 space-y-3">
                {services.map((service, index) => (
                  <div 
                    key={service.id} 
                    className="service-card group/service relative flex justify-between items-center p-5 bg-gradient-to-r from-neutral-50 to-purple-50 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.03] cursor-default border border-neutral-200 hover:border-purple-300 overflow-hidden"
                    style={{ 
                      transitionDelay: `${index * 50}ms`
                    }}
                  >
                    {/* Animated background bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 scale-y-0 group-hover/service:scale-y-100 transition-transform duration-300"></div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/service:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative z-10">
                      <p className="font-bold text-lg text-neutral-900 mb-1 group-hover/service:translate-x-2 transition-transform duration-300">{service.name}</p>
                      <div className="flex items-center gap-2 text-sm text-neutral-600 group-hover/service:translate-x-2 transition-transform duration-300" style={{ transitionDelay: '50ms' }}>
                        <Clock className="w-4 h-4 group-hover/service:rotate-180 transition-transform duration-500" />
                        <span className="font-medium">{service.duration} minutes</span>
                      </div>
                    </div>
                    <div className="relative z-10 text-right">
                      <p className="text-2xl font-black text-neutral-900 group-hover/service:text-purple-600 group-hover/service:scale-125 transition-all duration-300">₹{service.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time Selection - Enhanced */}
            <div className="group relative bg-white rounded-2xl border-2 border-neutral-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-green-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-4 left-4 w-32 h-32 bg-green-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative p-6 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 group-hover:text-green-600 transition-colors duration-300">Select Date & Time</h2>
                </div>
              </div>
              
              <div className="relative p-6 space-y-8">
                {/* Date Picker */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-700 mb-3">
                    <Calendar className="w-4 h-4" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-5 py-4 border-2 border-neutral-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 focus:outline-none transition-all hover:border-neutral-400 hover:shadow-lg text-lg font-semibold"
                  />
                </div>

                {/* Time Picker with Enhanced Effects */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-700 mb-4">
                    <Clock className="w-4 h-4" />
                    Appointment Time
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    {timeSlots.map((time, index) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`time-slot relative px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden ${
                          selectedTime === time
                            ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-2xl scale-110 -translate-y-1'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-gradient-to-r hover:from-neutral-900 hover:to-neutral-700 hover:text-white hover:scale-110 hover:-translate-y-1 hover:shadow-xl'
                        }`}
                        style={{
                          transitionDelay: `${index * 20}ms`
                        }}
                      >
                        <span className="relative z-10">{time}</span>
                        {selectedTime === time && (
                          <>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white animate-ping"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 animate-shake hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-red-900 text-lg mb-1">Unable to complete booking</p>
                    <p className="text-sm text-red-700">{typeof error === 'string' ? error : JSON.stringify(error)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar - Super Enhanced */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-2xl sticky top-4 overflow-hidden hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
              {/* Premium header */}
              <div className="relative p-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                <div className="relative flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-xl">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Booking Summary</h2>
                    <p className="text-xs text-neutral-300">Review your selection</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-3">
                <div className="group/item flex justify-between items-center p-4 bg-gradient-to-r from-neutral-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-purple-50 hover:scale-105 transition-all duration-300 cursor-default border border-neutral-200 hover:border-blue-300 hover:shadow-lg">
                  <span className="text-neutral-700 font-semibold text-sm group-hover/item:text-blue-600 transition-colors">Services ({services.length})</span>
                  <span className="font-bold text-lg text-neutral-900 group-hover/item:text-blue-600 group-hover/item:scale-125 transition-all">₹{totalPrice}</span>
                </div>
                <div className="group/item flex justify-between items-center p-4 bg-gradient-to-r from-neutral-50 to-purple-50 rounded-xl hover:from-purple-50 hover:to-pink-50 hover:scale-105 transition-all duration-300 cursor-default border border-neutral-200 hover:border-purple-300 hover:shadow-lg">
                  <span className="text-neutral-700 font-semibold text-sm group-hover/item:text-purple-600 transition-colors">Duration</span>
                  <span className="font-bold text-lg text-neutral-900 group-hover/item:text-purple-600 group-hover/item:scale-125 transition-all">
                    {getTotalDuration()} min
                  </span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 animate-fadeIn hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-default">
                    <span className="text-green-700 font-semibold text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Date Selected
                    </span>
                    <span className="font-bold text-green-900">{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 animate-fadeIn hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-default">
                    <span className="text-green-700 font-semibold text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Time Selected
                    </span>
                    <span className="font-bold text-green-900">{selectedTime}</span>
                  </div>
                )}
              </div>

              <div className="px-6 py-5 border-t-2 border-neutral-200 bg-gradient-to-b from-neutral-50 to-white">
                <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-md">
                  <span className="text-base font-bold text-neutral-700">Total Amount</span>
                  <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">₹{totalPrice}</span>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={loading || !selectedDate || !selectedTime}
                  className={`group relative w-full py-5 rounded-xl font-bold text-lg transition-all duration-500 overflow-hidden ${
                    loading || !selectedDate || !selectedTime
                      ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-2xl hover:shadow-3xl hover:scale-105 animate-gradient'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Confirm & Pay
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                  {!loading && !(!selectedDate || !selectedTime) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  )}
                </button>

                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300 cursor-default border border-blue-200">
                  <p className="text-xs text-neutral-700 text-center font-semibold flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    256-bit encrypted secure payment via Stripe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}