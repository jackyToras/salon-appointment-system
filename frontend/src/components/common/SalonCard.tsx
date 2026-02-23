import { Link } from 'react-router-dom'
import { Salon } from '../../types'
import { apiClient } from '../services/apiClient'

interface SalonCardProps {
  salon: Salon
}

export default function SalonCard({ salon }: SalonCardProps) {
  // ✅ Safely get ID
  const salonId = salon.id || salon._id || ''
  
  // ✅ Get image with multiple fallbacks
  const getImageUrl = () => {
    // Check if images array exists and has items
    if (salon.images && Array.isArray(salon.images) && salon.images.length > 0) {
      const firstImage = salon.images[0]
      // Only use if it's a valid URL (starts with http)
      if (firstImage && (firstImage.startsWith('http://') || firstImage.startsWith('https://'))) {
        return firstImage
      }
    }
    // Fallback to default image
    return 'https://images.unsplash.com/photo-1633621821756-e60dab7fc92f?w=400&h=250&fit=crop'
  }

  const imageUrl = getImageUrl()

  return (
    <div className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col h-full">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 h-48">
        <img
          src={imageUrl}
          alt={salon.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            if (target.src !== 'https://images.unsplash.com/photo-1633621821756-e60dab7fc92f?w=400&h=250&fit=crop') {
              target.src = 'https://images.unsplash.com/photo-1633621821756-e60dab7fc92f?w=400&h=250&fit=crop'
            }
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">{salon.name}</h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-shrink-0">{salon.address}</p>

        <div className="flex justify-between items-center mb-5 mt-auto">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="font-semibold text-slate-900">
              {salon.rating && salon.rating > 0 ? salon.rating.toFixed(1) : 'New'}
            </span>
            <span className="text-xs text-slate-500">(4.2k)</span>
          </div>
          {salon.city && (
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
              {salon.city}
            </span>
          )}
        </div>

        <Link
          to={`/salons/${salonId}`}
          className="w-full bg-slate-700 text-white py-2.5 rounded-md text-center font-medium hover:bg-slate-800 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}