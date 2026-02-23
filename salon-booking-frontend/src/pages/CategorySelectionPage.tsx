import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../services/apiClient'
import LoadingSpinner from '../components/common/LoadingSpinner'

interface Category {
  id: string
  salonId: string
  name: string
  image?: string
}

export default function CategorySelectionPage() {
  const { salonId, serviceId } = useParams<{ salonId: string; serviceId: string }>()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [serviceName, setServiceName] = useState<string>('')

  useEffect(() => {
    if (salonId) {
      fetchCategories()
    }
  }, [salonId])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getCategoriesBySalonId(salonId!)
      setCategories(Array.isArray(response) ? response : [])
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch categories'
      console.error('Failed to fetch categories:', err)
      setError(errorMsg)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/book/${salonId}/${serviceId}/${categoryId}`)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8 md:mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Select a Category</h1>
        <p className="text-slate-600 text-lg">
          Choose a category to continue with your booking
          {serviceName && <span className="font-medium"> for {serviceName}</span>}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Error Loading Categories</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchCategories}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-slate-300 transition-all duration-200 group"
            >
              {/* Category Image */}
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 h-48">
                <img
                  src={category.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop'}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              {/* Category Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                  {category.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Select this category</span>
                  <svg
                    className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-lg border border-slate-200">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-slate-900 font-medium text-lg">No categories available</p>
          <p className="text-slate-600 text-sm mt-2">Please try again later or contact the salon</p>
        </div>
      )}
    </div>
  )
}