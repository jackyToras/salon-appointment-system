import { useState, useCallback } from 'react'
import { apiClient } from '@/services/apiClient'
import { AxiosError } from 'axios'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface ApiError {
  status?: number
  message?: string
  data?: any
}

/**
 * Custom hook for API calls with loading and error states
 * 
 * Usage:
 * const { data, loading, error, execute } = useApi()
 * 
 * const handleFetch = async () => {
 *   await execute(async () => apiClient.getSalons())
 * }
 */

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (apiCall: () => Promise<T>): Promise<T | null> => {
      setState({ data: null, loading: true, error: null })

      try {
        const result = await apiCall()
        setState({ data: result, loading: false, error: null })
        return result
      } catch (err) {
        const axiosError = err as AxiosError<any>
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred'
        setState({ data: null, loading: false, error: errorMessage })
        return null
      }
    },
    []
  )

  return {
    ...state,
    execute,
  }
}

/**
 * Hook for mutations (POST, PUT, DELETE) with callback support
 */
export function useMutation<T = any, V = any>(
  mutationFn: (data: V) => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const mutate = useCallback(
    async (variables: V): Promise<T | null> => {
      setState({ data: null, loading: true, error: null })

      try {
        const result = await mutationFn(variables)
        setState({ data: result, loading: false, error: null })
        onSuccess?.(result)
        return result
      } catch (err) {
        const axiosError = err as AxiosError<any>
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred'
        setState({ data: null, loading: false, error: errorMessage })
        onError?.(errorMessage)
        return null
      }
    },
    [mutationFn, onSuccess, onError]
  )

  return {
    ...state,
    mutate,
  }
}

/**
 * Hook for queries with automatic fetching
 */
export function useQuery<T = any>(
  queryFn: () => Promise<T>,
  enabled = true
) {
  const { data, loading, error, execute } = useApi<T>()
  const [isInitialized, setIsInitialized] = useState(false)

  const refetch = useCallback(async () => {
    await execute(queryFn)
  }, [execute, queryFn])

  // Auto-fetch on mount if enabled
  React.useEffect(() => {
    if (enabled && !isInitialized) {
      refetch()
      setIsInitialized(true)
    }
  }, [enabled, isInitialized, refetch])

  return {
    data,
    loading,
    error,
    refetch,
  }
}

/**
 * Hook for paginated queries
 */
export function usePaginatedQuery<T = any>(
  queryFn: (page: number, limit: number) => Promise<any>,
  limit = 10
) {
  const [page, setPage] = useState(1)
  const { data, loading, error, refetch } = useQuery(
    () => queryFn(page, limit)
  )

  const goToNextPage = () => setPage((p) => p + 1)
  const goToPreviousPage = () => setPage((p) => Math.max(1, p - 1))
  const goToPage = (p: number) => setPage(p)

  return {
    data,
    loading,
    error,
    page,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    refetch,
  }
}
