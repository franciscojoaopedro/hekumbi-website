"use client"

import { useState, useCallback, useEffect } from "react"
import { supabase, type Quote } from "@/lib/supabase"

export interface QuoteFilters {
  status: string
  priority: string
  urgency: string
  search: string
  page: number
  limit: number
}

export function useSupabaseQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    approved: 0,
    rejected: 0,
    totalValue: 0,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const fetchQuotes = useCallback(async (filters: Partial<QuoteFilters> = {}) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status)
      }
      if (filters.priority && filters.priority !== "all") {
        params.append("priority", filters.priority)
      }
      if (filters.urgency && filters.urgency !== "all") {
        params.append("urgency", filters.urgency)
      }
      if (filters.search) {
        params.append("search", filters.search)
      }
      if (filters.page) {
        params.append("page", filters.page.toString())
      }
      if (filters.limit) {
        params.append("limit", filters.limit.toString())
      }

      const response = await fetch(`/api/quotes?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Falha ao buscar orçamentos")
      }

      const data = await response.json()

      setQuotes(data.quotes)
      setStats(data.stats)
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        total: data.total,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      console.error("Erro ao buscar orçamentos:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateQuoteStatus = useCallback(async (id: string, status: Quote["status"]) => {
    try {
      const response = await fetch("/api/quotes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar orçamento")
      }

      const { quote } = await response.json()

      setQuotes((prev) => prev.map((q) => (q.id === id ? quote : q)))

      return quote
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      throw err
    }
  }, [])

  const createQuote = useCallback(
    async (quoteData: {
      customerName: string
      customerEmail: string
      customerPhone?: string
      serviceType: string
      propertyType?: string
      area?: number
      frequency?: string
      urgency?: string
      location?: string
      description?: string
      estimatedValue?: number
      chatId?: string
    }) => {
      try {
        const response = await fetch("/api/quotes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quoteData),
        })

        if (!response.ok) {
          throw new Error("Falha ao criar orçamento")
        }

        const { quote } = await response.json()

        setQuotes((prev) => [quote, ...prev])

        return quote
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
        throw err
      }
    },
    [],
  )

  // Configurar real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("quotes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quotes",
        },
        (payload) => {
          console.log("Quote change received:", payload)

          if (payload.eventType === "INSERT") {
            setQuotes((prev) => [payload.new as Quote, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setQuotes((prev) => prev.map((quote) => (quote.id === payload.new.id ? (payload.new as Quote) : quote)))
          } else if (payload.eventType === "DELETE") {
            setQuotes((prev) => prev.filter((quote) => quote.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    quotes,
    loading,
    error,
    stats,
    pagination,
    fetchQuotes,
    updateQuoteStatus,
    createQuote,
    refetch: fetchQuotes,
  }
}
