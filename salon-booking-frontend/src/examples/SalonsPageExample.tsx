/**
 * EXAMPLE: How to use API Client with real microservices through Gateway
 * 
 * This example shows:
 * 1. Fetching salons from SALON-SERVICE via Gateway
 * 2. Search and pagination
 * 3. Error handling
 * 4. Loading states
 * 
 * API Flow:
 * Frontend -> Gateway (8888) -> SALON-SERVICE (8002)
 */

import React, { useState } from 'react'
import { apiClient } from '@/services/apiClient'
import { useQuery, usePaginatedQuery } from '@/hooks/useApi'

export function SalonsPageExample() {
  const [searchTerm, setSearchTerm] = useState('')

  // Example 1: Simple query with auto-fetch
  const { data: allSalons, loading, error, refetch } = useQuery(
    () => apiClient.getSalons(1, 10),
    true // auto-fetch on mount
  )

  // Example 2: Paginated query
  const {
    data: paginatedSalons,
    page,
    goToNextPage,
    goToPreviousPage,
  } = usePaginatedQuery(
    (page, limit) => apiClient.getSalons(page, limit),
    10
  )

  // Example 3: Search with manual execution
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await refetch()
      return
    }

    try {
      const results = await apiClient.searchSalons(searchTerm)
      console.log('Search results:', results)
    } catch (err) {
      console.error('Search error:', err)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Salons Microservice Example</h1>

      {/* Search Bar */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search salons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Loading State */}
      {loading && <p className="text-center text-gray-600">Loading salons...</p>}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
          <p>Error: {error}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      )}

      {/* Salons Grid */}
      {allSalons && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(allSalons) ? (
            allSalons.map((salon: any) => (
              <div key={salon.id} className="border rounded-lg p-4 shadow">
                <h3 className="text-xl font-bold mb-2">{salon.name}</h3>
                <p className="text-gray-600 mb-2">📍 {salon.address}</p>
                <p className="text-gray-600 mb-2">⭐ {salon.rating}/5</p>
                <p className="text-gray-600 mb-4">{salon.description}</p>
                <button
                  onClick={() => console.log('View salon:', salon.id)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p>No salons found</p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={goToPreviousPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={goToNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  )
}
