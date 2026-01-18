import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiClient } from '../services/apiClient'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    verifyPayment()
  }, [])

  const verifyPayment = async () => {
    try {
      const paymentOrderId = searchParams.get('order_id')

      if (!paymentOrderId) {
        setError('Payment order ID not found')
        setLoading(false)
        return
      }

      console.log('🔍 Verifying payment:', paymentOrderId)

      const paymentOrder = await apiClient.getPaymentOrder(paymentOrderId)

      console.log('✅ Payment verified:', paymentOrder)

      setPaymentDetails(paymentOrder)
      setLoading(false)

      // AUTO REDIRECT REMOVED – User will navigate manually

    } catch (err: any) {
      console.error('❌ Payment verification failed:', err)
      setError('Failed to verify payment. Please contact support.')
      setLoading(false)
    }
  }

  // SAFE HELPERS – convert anything to displayable text
  const safeText = (value: any) => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  const safeAmount = (value: any) => {
    if (!value) return ''
    if (typeof value === 'object') {
      return value.amount || value.value || JSON.stringify(value)
    }
    return value
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl text-slate-700">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Payment Verification Failed</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">

        <div className="mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful! 🎉</h1>
        <p className="text-lg text-slate-600 mb-6">Your booking has been confirmed</p>

        {paymentDetails && (
          <div className="bg-slate-50 rounded-lg p-6 mb-6 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Amount Paid:</span>
                <span className="font-bold text-slate-900">
                  ₹{safeAmount(paymentDetails.amount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Payment ID:</span>
                <span className="font-mono text-sm text-slate-700">
                  {safeText(paymentDetails.id)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {safeText(paymentDetails.status)}
                </span>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-slate-500 mb-6">
          A confirmation email has been sent to your registered email address.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            View My Bookings
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  )
}
