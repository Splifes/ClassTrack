import { useState, useEffect } from 'react'

export function useApi<T>(apiCall: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall()
        if (!cancelled) {
          setData(result)
        }
      } catch (err: any) {
        console.error("API call failed:", err); // Debugging más explícito
        if (!cancelled) {
          setError(err as Error)
          setData(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, deps)

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err: any) {
      setError(err as Error)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}
