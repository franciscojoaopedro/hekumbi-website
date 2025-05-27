"use client"

import { useState, useCallback } from "react"

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = useCallback(async (url: string, options: RequestInit = {}, callbacks: UseApiOptions = {}) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      callbacks.onSuccess?.(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      callbacks.onError?.(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { request, loading, error }
}
