import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { apiClient } from '../../services/apiClient'
import { Booking, Service } from '../../types'
import BookingCard from '../../components/common/BookingCard'
import ServiceCard from '../../components/common/ServiceCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function SalonOwnerDashboard() {
  const user = useAuthStore((state) => state.user)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddService, setShowAddService] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    duration: '',
    description: '',
  })

  useEffect(() => {
    if (user) fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      const bookingsData = await apiClient.getSalonBookings(user!.id)
      const servicesData = await apiClient.getServices(user!.id)
      setBookings(bookingsData)
      setServices(servicesData)
    } catch (error) {
      console.error('Failed to fetch salon data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.addService(user!.id, {
        name: formData.name,
        category: formData.category,
        price: parseInt(formData.price),
        duration: parseInt(formData.duration),
        description: formData.description,
      })
      setFormData({ name: '', category: '', price: '', duration: '', description: '' })
      setShowAddService(false)
      fetchData()
    } catch (error) {
      console.error('Failed to add service:', error)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Salon Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-gray-600">Total Bookings</p>
          <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <p className="text-gray-600">Services</p>
          <p className="text-3xl font-bold text-green-600">{services.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <p className="text-gray-600">Revenue</p>
          <p className="text-3xl font-bold text-purple-600">
            ₹{bookings.reduce((sum, b) => sum + b.totalPrice, 0)}
          </p>
        </div>
      </div>

      {/* Add Service Section */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddService(!showAddService)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
        >
          {showAddService ? 'Cancel' : 'Add New Service'}
        </button>

        {showAddService && (
          <form onSubmit={handleAddService} className="bg-white rounded-lg shadow p-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Service Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                rows={2}
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Add Service
            </button>
          </form>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bookings */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No bookings yet</p>
            )}
          </div>

          {/* Services */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Services</h2>
            {services.length > 0 ? (
              <div className="space-y-4">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No services added</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
