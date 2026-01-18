import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../services/apiClient'
import { Salon } from '../types'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { MapPin, Star, ArrowRight, Sparkles, Award, Zap, TrendingUp, Heart, Eye } from 'lucide-react'

export default function HomePage() {
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredSalon, setHoveredSalon] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const hasFetched = useRef(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      fetchSalons()
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        })
      }
    }

    const hero = heroRef.current
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove)
      return () => hero.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const fetchSalons = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getSalons()
      setSalons(data.slice(0, 6))
    } catch (error: any) {
      console.error('❌ Failed to fetch salons')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen -mx-6 md:-mx-8">
      {/* Hero Section - Interactive & Stunning */}
      <div ref={heroRef} className="relative bg-black text-white overflow-hidden">
        {/* Dynamic animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
          <div 
            className="absolute w-[800px] h-[800px] bg-blue-500/40 rounded-full blur-3xl transition-all duration-1000 ease-out"
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          ></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:64px_64px] animate-grid"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-32 md:py-40">
          <div className="text-center max-w-5xl mx-auto">
            {/* Premium Badge with hover effect */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium mb-8 shadow-lg hover:bg-white/20 hover:scale-105 hover:border-white/40 transition-all duration-300 cursor-default group">
              <Sparkles className="w-4 h-4 text-yellow-400 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Trusted by 10,000+ customers worldwide
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
              <span className="block hover:scale-105 transition-transform duration-300 inline-block">Your beauty,</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient hover:scale-110 transition-transform duration-500 inline-block cursor-default">
                redefined
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light hover:text-white transition-colors duration-300">
              Experience luxury salon services with world-class professionals. Book in seconds, transform in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link
                to="/salons"
                className="group relative w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full font-bold text-lg inline-flex items-center justify-center gap-3 shadow-2xl hover:shadow-white/30 transition-all duration-300 overflow-hidden hover:scale-105"
              >
                <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">Explore Salons</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white group-hover:scale-150 transition-transform duration-500 rounded-full"></div>
              </Link>
              <Link
                to="/salons"
                className="group w-full sm:w-auto px-10 py-5 border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm relative overflow-hidden hover:scale-105"
              >
                <span className="relative z-10">See How It Works</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </Link>
            </div>

            {/* Stats - Enhanced with hover effects */}
            <div className="grid grid-cols-3 gap-8 md:gap-16 max-w-3xl mx-auto">
              <div className="relative group cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:-rotate-2">
                  <div className="text-5xl font-black mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{salons.length}+</div>
                  <div className="text-sm text-neutral-400 font-medium group-hover:text-neutral-200 transition-colors">Premium Salons</div>
                </div>
              </div>
              <div className="relative group cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 hover:scale-110 hover:bg-white/10">
                  <div className="text-5xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">4.9★</div>
                  <div className="text-sm text-neutral-400 font-medium group-hover:text-neutral-200 transition-colors">Avg. Rating</div>
                </div>
              </div>
              <div className="relative group cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:rotate-2">
                  <div className="text-5xl font-black mb-2 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <div className="text-sm text-neutral-400 font-medium group-hover:text-neutral-200 transition-colors">Instant Booking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Strip - Ultra Modern with hover effects */}
      <div className="bg-neutral-900 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-neutral-800/50 transition-all duration-300 cursor-default hover:scale-105">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/50">
                <Zap className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Instant Booking</div>
                <div className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Book in under 60 seconds</div>
              </div>
            </div>
            <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-neutral-800/50 transition-all duration-300 cursor-default hover:scale-105">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/50">
                <Award className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">Verified Professionals</div>
                <div className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Licensed & certified experts</div>
              </div>
            </div>
            <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-neutral-800/50 transition-all duration-300 cursor-default hover:scale-105">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-pink-500/50">
                <TrendingUp className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">Best Price Guarantee</div>
                <div className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Exclusive member discounts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Salons - Magazine Style with enhanced interactions */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-32">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-bold mb-6 shadow-lg hover:scale-110 hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 cursor-default">
              <Star className="w-4 h-4 fill-white animate-spin-slow" />
              FEATURED
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-black mb-6 tracking-tight hover:scale-105 transition-transform duration-300 inline-block cursor-default">
              Discover excellence
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto hover:text-neutral-800 transition-colors">
              Handpicked salons delivering world-class experiences
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : salons.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {salons.map((salon, index) => (
                  <Link
                    key={salon.id}
                    to={`/salons/${salon.id}`}
                    className="group relative bg-white rounded-3xl overflow-hidden border border-neutral-200 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                    style={{ 
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` 
                    }}
                    onMouseEnter={() => setHoveredSalon(index)}
                    onMouseLeave={() => setHoveredSalon(null)}
                  >
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-sm -z-10"></div>
                    
                    <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                      <img
                        src={salon.image || salon.images?.[0] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'}
                        alt={salon.name}
                        className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Hover overlay icons */}
                      <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-125 transition-transform duration-300 cursor-pointer shadow-xl">
                          <Heart className="w-6 h-6 text-pink-500 hover:fill-pink-500 transition-all" />
                        </div>
                        <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-125 transition-transform duration-300 cursor-pointer shadow-xl">
                          <Eye className="w-6 h-6 text-blue-500" />
                        </div>
                      </div>
                      
                      {salon.rating > 0 && (
                        <div className="absolute top-5 right-5 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-xl backdrop-blur-sm group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-400 transition-all duration-300">
                          <Star className={`w-4 h-4 text-yellow-500 fill-yellow-500 ${hoveredSalon === index ? 'animate-bounce' : ''}`} />
                          <span className="text-sm font-black text-black group-hover:text-white transition-colors">{salon.rating}</span>
                        </div>
                      )}
                      <div className="absolute bottom-5 left-5 right-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex items-center gap-2 text-white text-sm font-medium bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
                          <MapPin className="w-4 h-4 animate-bounce" />
                          <span>{salon.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-7 bg-white group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-neutral-50 transition-all duration-500">
                      <h3 className="text-2xl font-black text-black mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {salon.name}
                      </h3>
                      <div className="flex items-center justify-between pt-5 border-t border-neutral-100 group-hover:border-neutral-200 transition-colors">
                        <span className="text-sm font-bold text-black group-hover:text-purple-600 transition-colors">View Details</span>
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-90">
                          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-16 text-center">
                <Link
                  to="/salons"
                  className="group relative inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-black/50 transition-all duration-300 overflow-hidden hover:scale-110"
                >
                  <span className="relative z-10">View All Salons</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-black group-hover:scale-150 transition-transform duration-700"></div>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-600">No salons available</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section - Enhanced with interactions */}
      <div className="relative bg-black text-white overflow-hidden group cursor-default">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30 group-hover:from-blue-600/50 group-hover:via-purple-600/50 group-hover:to-pink-600/50 transition-all duration-1000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:64px_64px] group-hover:bg-[size:32px_32px] transition-all duration-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight hover:scale-105 transition-transform duration-500">
              Ready to look
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient hover:scale-110 transition-transform duration-300 inline-block">
                absolutely stunning?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-neutral-300 mb-12 font-light hover:text-white transition-colors">
              Join thousands transforming their beauty routine every day
            </p>
            <Link
              to="/salons"
              className="group/btn relative inline-flex items-center gap-3 px-12 py-6 bg-white text-black rounded-full font-black text-xl shadow-2xl hover:shadow-white/40 transition-all duration-300 overflow-hidden hover:scale-110"
            >
              <span className="relative z-10 group-hover/btn:scale-110 transition-transform">Start Your Journey</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover/btn:translate-x-2 group-hover/btn:scale-125 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white group-hover/btn:scale-150 transition-transform duration-700 rounded-full"></div>
            </Link>
          </div>
        </div>
      </div>

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
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
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
        
        @keyframes particle {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx, 100px), var(--ty, -100px)) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes grid {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 64px 64px;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-particle {
          animation: particle linear infinite;
        }
        
        .animate-grid {
          animation: grid 20s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}