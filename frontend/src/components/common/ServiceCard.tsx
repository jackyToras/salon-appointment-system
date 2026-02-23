import { Service } from '../../types'

interface ServiceCardProps {
  service: Service
  onBook?: (service: Service) => void
}

export default function ServiceCard({ service, onBook }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 p-5 md:p-6 transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-lg text-slate-900 mb-1">{service.name}</h4>
          <p className="text-sm text-slate-600 font-medium">{service.category}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold text-slate-900">₹{service.price}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-700 text-sm mb-4 leading-relaxed line-clamp-2">
        {service.description || 'Premium salon service'}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{service.duration} mins</span>
        </div>
        {onBook && (
          <button
            onClick={() => onBook(service)}
            className="px-4 py-2 bg-slate-700 text-white rounded-md font-medium text-sm hover:bg-slate-800 transition-colors duration-200"
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  )
}
