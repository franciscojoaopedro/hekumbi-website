"use client"

import { useState, useCallback } from "react"
import { useApi } from "./use-api"

export interface Quote {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: string
  description: string
  status: "pending" | "approved" | "rejected" | "sent"
  priority: "low" | "medium" | "high"
  value: number
  createdAt: string
  validUntil: string
}

export interface QuoteFilters {
  status: string
  priority: string
  search: string
}

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const { request, loading, error } = useApi()

  const fetchQuotes = useCallback(
    async (filters: QuoteFilters = { status: "all", priority: "all", search: "" }) => {
      try {
        const params = new URLSearchParams()
        if (filters.status !== "all") params.append("status", filters.status)
        if (filters.priority !== "all") params.append("priority", filters.priority)
        if (filters.search) params.append("search", filters.search)

        const data = await request(`/api/quotes?${params.toString()}`)
        setQuotes(data.quotes)
        return data.quotes
      } catch (err) {
        console.error("Erro ao buscar orçamentos:", err)
        return []
      }
    },
    [request],
  )

  const updateQuoteStatus = useCallback(
    async (id: string, status: Quote["status"]) => {
      try {
        await request(`/api/quotes/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        })

        setQuotes((prev) => prev.map((quote) => (quote.id === id ? { ...quote, status } : quote)))
      } catch (err) {
        console.error("Erro ao atualizar orçamento:", err)
        throw err
      }
    },
    [request],
  )

  return {
    quotes,
    loading,
    error,
    fetchQuotes,
    updateQuoteStatus,
  }
}
