import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../services/apiClient'
import { Salon, Service } from '../types'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { MapPin, Phone, Clock, Star, Check, Award, Sparkles, Calendar, Heart, Share2, ChevronRight } from 'lucide-react'

export default function SalonDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [salon, setSalon] = useState<Salon | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (id) {
      fetchSalonDetails()
      fetchServices()
    }
  }, [id])

  const fetchSalonDetails = async () => {
    try {
      console.log('🔄 Fetching salon details for:', id)
      const data = await apiClient.getSalonById(id!)
      console.log('✅ Got salon:', data)
      setSalon(data)
    } catch (error) {
      console.error('❌ Failed to fetch salon:', error)
    }
  }

  const fetchServices = async () => {
    try {
      console.log('🔄 Fetching services for salon:', id)
      const data = await apiClient.getServicesBySalonId(id!)
      console.log('✅ Got services with images:', data)
      console.log('📸 First service image:', data[0]?.image)
      setServices(data)
    } catch (error) {
      console.error('❌ Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleServiceSelection = (service: Service) => {
    setSelectedServices(prev => {
      const serviceId = service.id || service._id
      const isSelected = prev.find(s => {
        const existingId = s.id || s._id
        return existingId === serviceId
      })
      
      if (isSelected) {
        return prev.filter(s => {
          const existingId = s.id || s._id
          return existingId !== serviceId
        })
      } else {
        return [...prev, service]
      }
    })
  }

  const isServiceSelected = (service: Service) => {
    const serviceId = service.id || service._id
    return selectedServices.some(s => {
      const existingId = s.id || s._id
      return existingId === serviceId
    })
  }

  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0)
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0)

  const handleBookNow = () => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service')
      return
    }
    
    navigate('/booking', {
      state: {
        salon,
        services: selectedServices,
        totalPrice,
        totalDuration
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!salon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Salon not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pb-32">
      {/* Hero Header - Ultra Premium Design */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Salon Image */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                {salon.image ? (
                  <img
                    src={salon.image}
                    alt={salon.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center relative overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-grid"></div>
                    </div>
                    
                    {/* Floating gradient orbs */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-float-delayed"></div>
                    
                    {/* Main logo/icon */}
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 group-hover:opacity-75 animate-pulse"></div>
                        <div className="relative w-32 h-32 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform duration-500">
                          <Sparkles className="w-16 h-16 text-white animate-pulse-slow" />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-white mb-1">{salon.name}</div>
                        <div className="text-sm text-white/70 font-medium">Premium Beauty Services</div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Floating action buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 ${
                      isLiked 
                        ? 'bg-pink-500 text-white scale-110' 
                        : 'bg-white/90 text-slate-700 hover:scale-110'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                  </button>
                  <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform text-slate-700">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Verified badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-slate-900">Verified Salon</span>
                </div>
              </div>
            </div>

            {/* Right: Salon Info */}
            <div className="space-y-6">
              {/* Premium badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold">Premium Experience</span>
              </div>

              {/* Salon name */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight hover:scale-105 transition-transform duration-300 inline-block">
                {salon.name}
              </h1>

              {/* Quick info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all cursor-default">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Star className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-black">{salon.rating || '4.9'}</div>
                      <div className="text-xs text-white/70">Rating</div>
                    </div>
                  </div>
                </div>

                <div className="group p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all cursor-default">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-black">{services.length}+</div>
                      <div className="text-xs text-white/70">Services</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-semibold mb-1 text-lg">Location</div>
                  <div className="text-white/80">{salon.address}, {salon.city}</div>
                </div>
              </div>

              {/* Phone */}
              {salon.phone && (
                <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all group">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="font-semibold mb-1 text-lg">Contact</div>
                    <div className="text-white/80">{salon.phone}</div>
                  </div>
                </div>
              )}

              {/* Description */}
              {salon.description && (
                <div className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-bold text-lg">About</h3>
                  </div>
                  <p className="text-white/90 leading-relaxed">{salon.description}</p>
                </div>
              )}

              {/* Quick action buttons */}
              <div className="flex gap-3">
                <button className="group flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Quick Book</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all hover:scale-105">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-16" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="url(#wave-gradient)" />
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(248 250 252)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="rgb(248 250 252)" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Services Section - Enhanced */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-sm font-bold text-blue-700 mb-4 hover:scale-105 transition-transform cursor-default">
            <Sparkles className="w-4 h-4" />
            <span>Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 hover:scale-105 transition-transform inline-block">
            Available Services
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose from our premium selection of services
          </p>
        </div>

        {services.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-600 text-lg">No services available at this salon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => {
              const selected = isServiceSelected(service)
              return (
                <div
                  key={service.id || service._id}
                  onClick={() => toggleServiceSelection(service)}
                  className={`group relative bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${
                    selected
                      ? 'ring-4 ring-blue-500 shadow-2xl shadow-blue-500/20 scale-105'
                      : 'hover:shadow-2xl hover:-translate-y-2 border-2 border-slate-100'
                  }`}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Animated gradient border for selected */}
                  {selected && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-75 animate-pulse"></div>
                  )}

                  <div className="relative bg-white rounded-3xl overflow-hidden">
                    {/* Service Image */}
                    <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-7xl group-hover:scale-110 transition-transform">✂️</span>
                        </div>
                      )}
                      
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Selection Indicator */}
                      {selected && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-2.5 shadow-xl animate-bounce">
                          <Check className="w-6 h-6" />
                        </div>
                      )}

                      {/* Price badge */}
                      <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg group-hover:scale-110 transition-transform">
                        <div className="text-xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                          ₹{service.price}
                        </div>
                      </div>

                      {/* Duration badge */}
                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex items-center gap-2 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full text-white">
                          <Clock className="w-4 h-4" />
                          <span className="font-semibold">{service.duration} min</span>
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="p-6 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-slate-50 transition-all duration-500">
                      <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
                        {service.name}
                      </h3>

                      <p className="text-slate-600 text-sm mb-4 line-clamp-2 group-hover:text-slate-700">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                          {selected ? 'Selected' : 'Add Service'}
                        </span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                          selected
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 rotate-90'
                            : 'bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500'
                        }`}>
                          {selected ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Fixed Bottom Booking Bar - Enhanced */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-slate-200 shadow-2xl z-50 animate-slideUp">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-sm font-semibold text-slate-600">
                    {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{totalPrice}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-bold text-slate-900">{totalDuration} min</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden hover:scale-110"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book Now
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 30px) scale(0.9);
          }
          66% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        @keyframes grid {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(40px, 40px);
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-grid {
          animation: grid 20s linear infinite;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}