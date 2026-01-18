/**
 * EXAMPLE: Complete booking flow with multiple microservices
 * 
 * This example demonstrates:
 * 1. Fetching salon details (SALON-SERVICE)
 * 2. Fetching services for that salon (SERVICE-OFFERING)
 * 3. Creating a booking (BOOKING-SERVICE)
 * 4. Processing payment (PAYMENT-SERVICE)
 * 5. Handling notifications (NOTIFICATION-SERVICE)
 * 
 * All requests go through Gateway (8888)
 * 
 * API Flow:
 * Frontend ->
 *   1. GET /api/salons/{id} -> Gateway -> SALON-SERVICE (8002)
 *   2. GET /api/salons/{id}/services -> Gateway -> SERVICE-OFFERING (8003)
 *   3. POST /api/bookings -> Gateway -> BOOKING-SERVICE (8005)
 *   4. POST /api/payments -> Gateway -> PAYMENT-SERVICE (8006)
 *   5. Notifications sent by BOOKING-SERVICE -> NOTIFICATION-SERVICE
 */

import React, { useState } from 'react'
import { apiClient } from '@/services/apiClient'
import { useMutation, useQuery } from '@/hooks/useApi'

interface BookingFormData {
  salonId: string
  serviceId: string
  bookingDate: string
  bookingTime: string
  notes: string
}

export function BookingFlowExample({ salonId }: { salonId: string }) {
  const [step, setStep] = useState<'salon' | 'services' | 'booking' | 'payment' | 'success'>(
    'salon'
  )
  const [formData, setFormData] = useState<BookingFormData>({
    salonId,
    serviceId: '',
    bookingDate: '',
    bookingTime: '',
    notes: '',
  })
  const [bookingId, setBookingId] = useState<string>('')

  // Step 1: Fetch salon details from SALON-SERVICE
  const { data: salon, loading: salonLoading, error: salonError } = useQuery(
    () => apiClient.getSalonById(salonId),
    true
  )

  // Step 2: Fetch services for this salon from SERVICE-OFFERING
  const { data: services, loading: servicesLoading } = useQuery(
    () => apiClient.getServices(formData.salonId),
    !!salon
  )

  // Step 3: Create booking via BOOKING-SERVICE
  const { mutate: createBooking, loading: bookingLoading } = useMutation(
    async (data: BookingFormData) => {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await apiClient.createBooking({
        userId: user.id,
        salonId: data.salonId,
        serviceId: data.serviceId,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
        notes: data.notes,
      })
      return response
    },
    (data) => {
      setBookingId(data.bookingId)
      setStep('payment')
    },
    (error) => alert(`Booking failed: ${error}`)
  )

  // Step 4: Process payment via PAYMENT-SERVICE
  const { mutate: processPayment, loading: paymentLoading } = useMutation(
    async (data: any) => {
      return await apiClient.processPayment(data.paymentId, {
        cardNumber: data.cardNumber,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
      })
    },
    (data) => {
      setStep('success')
    },
    (error) => alert(`Payment failed: ${error}`)
  )

  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    setFormData({ ...formData, serviceId })
    setStep('booking')
  }

  // Handle booking form submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createBooking(formData)
  }

  // Handle payment submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formDataPayment = new FormData(e.target as HTMLFormElement)
    await processPayment({
      paymentId: bookingId,
      cardNumber: formDataPayment.get('cardNumber'),
      expiryDate: formDataPayment.get('expiryDate'),
      cvv: formDataPayment.get('cvv'),
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Booking Flow Example</h1>

      {/* Step Indicator */}
      <div className="flex justify-between mb-8">
        {['salon', 'services', 'booking', 'payment', 'success'].map((s, i) => (
          <div
            key={s}
            className={`flex items-center ${
              i !== 4 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === s || (['salon', 'services', 'booking', 'payment', 'success'].indexOf(step) > i)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300'
              }`}
            >
              {i + 1}
            </div>
            {i !== 4 && <div className="flex-1 h-1 bg-gray-300 mx-2"></div>}
          </div>
        ))}
      </div>

      {/* Step 1: Salon Details */}
      {step === 'salon' && (
        <div>
          {salonLoading && <p>Loading salon...</p>}
          {salonError && <p className="text-red-500">Error: {salonError}</p>}
          {salon && (
            <div className="border rounded-lg p-6 bg-white shadow">
              <h2 className="text-2xl font-bold mb-4">{salon.name}</h2>
              <p className="text-gray-600 mb-2">📍 {salon.address}</p>
              <p className="text-gray-600 mb-4">⭐ {salon.rating}/5</p>
              <p className="text-gray-700 mb-6">{salon.description}</p>
              <button
                onClick={() => setStep('services')}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                View Services
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Service */}
      {step === 'services' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
          {servicesLoading && <p>Loading services...</p>}
          {services && (
            <div className="space-y-4">
              {Array.isArray(services) && services.length > 0 ? (
                services.map((service: any) => (
                  <div
                    key={service.id}
                    className="border rounded-lg p-4 hover:shadow-lg cursor-pointer"
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-2">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">
                        ₹{service.price}
                      </span>
                      <span className="text-gray-600">⏱️ {service.duration} mins</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No services available</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Booking Details */}
      {step === 'booking' && (
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              required
              value={formData.bookingDate}
              onChange={(e) =>
                setFormData({ ...formData, bookingDate: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <input
              type="time"
              required
              value={formData.bookingTime}
              onChange={(e) =>
                setFormData({ ...formData, bookingTime: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Any special requests..."
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={bookingLoading}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {bookingLoading ? 'Creating booking...' : 'Continue to Payment'}
          </button>
        </form>
      )}

      {/* Step 4: Payment */}
      {step === 'payment' && (
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Expiry</label>
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CVV</label>
              <input
                type="text"
                name="cvv"
                placeholder="123"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={paymentLoading}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {paymentLoading ? 'Processing payment...' : 'Complete Payment'}
          </button>
        </form>
      )}

      {/* Step 5: Success */}
      {step === 'success' && (
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your booking has been confirmed.</p>
          <p className="text-lg font-bold mb-6">Booking ID: {bookingId}</p>
          <p className="text-gray-600 mb-6">
            A confirmation email has been sent to your registered email address.
          </p>
          <button
            onClick={() => window.location.href = '/bookings'}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            View My Bookings
          </button>
        </div>
      )}
    </div>
  )
}
