import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient'
import { User, Salon, Booking } from '../../types'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [salons, setSalons] = useState<Salon[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const usersData = await apiClient.getAllUsers()
      const salonsData = await apiClient.getAllSalons()
      const bookingsData = await apiClient.getAllBookings()
      setUsers(usersData)
      setSalons(salonsData)
      setBookings(bookingsData)
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <p className="text-gray-600 text-sm">Total Salons</p>
          <p className="text-3xl font-bold text-green-600">{salons.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <p className="text-gray-600 text-sm">Total Bookings</p>
          <p className="text-3xl font-bold text-purple-600">{bookings.length}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-6">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-orange-600">
            ₹{bookings.reduce((sum, b) => sum + b.totalPrice, 0)}
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-8">
          {/* Users Table */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left font-semibold">Name</th>
                    <th className="px-6 py-3 text-left font-semibold">Email</th>
                    <th className="px-6 py-3 text-left font-semibold">Role</th>
                    <th className="px-6 py-3 text-left font-semibold">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 10).map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{user.name}</td>
                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                          user.role === 'SALON' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-3">{user.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Salons Table */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Salons</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left font-semibold">Name</th>
                    <th className="px-6 py-3 text-left font-semibold">City</th>
                    <th className="px-6 py-3 text-left font-semibold">Rating</th>
                    <th className="px-6 py-3 text-left font-semibold">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {salons.slice(0, 10).map((salon) => (
                    <tr key={salon.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium">{salon.name}</td>
                      <td className="px-6 py-3">{salon.city}</td>
                      <td className="px-6 py-3">⭐ {salon.rating.toFixed(1)}</td>
                      <td className="px-6 py-3">{salon.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
