import { Booking } from '../../types'
import { Calendar, Clock, CreditCard, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface BookingCardProps {
  booking: Booking
}

export default function BookingCard({ booking }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRM':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRM':
        return <CheckCircle className="w-4 h-4" />
      case 'PENDING':
        return <AlertCircle className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid Time'
      }
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return 'Invalid Time'
    }
  }

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-gray-100 text-gray-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'REFUNDED':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Booking #{booking.id.slice(-8)}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              {booking.status}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
              {booking.paymentStatus}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-slate-900">₹{booking.totalPrice}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 border-t border-slate-200 pt-4">
        <div className="flex items-center gap-3 text-slate-700">
          <Calendar className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-medium">Date:</p>
            <p className="text-sm">{formatDate(booking.startTime)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-700">
          <Clock className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-medium">Time:</p>
            <p className="text-sm">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-700">
          <CreditCard className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-medium">Payment Method:</p>
            <p className="text-sm capitalize">{booking.paymentMethod.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {booking.status === 'PENDING' && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <button className="w-full px-4 py-2 text-sm border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors font-medium">
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  )
}