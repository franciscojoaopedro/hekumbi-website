"use client"

import { useState, useCallback } from "react"
import { useApi } from "./use-api"

export interface Analytics {
  totalChats: number
  activeChats: number
  totalQuotes: number
  pendingQuotes: number
  approvedQuotes: number
  totalRevenue: number
  monthlyRevenue: number
  conversionRate: number
  averageResponseTime: number
  customerSatisfaction: number
  topServices: Array<{
    name: string
    count: number
    revenue: number
  }>
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const { request, loading, error } = useApi()

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await request("/api/analytics")
      setAnalytics(data)
      return data
    } catch (err) {
      console.error("Erro ao buscar analytics:", err)
      return null
    }
  }, [request])

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
  }
}
