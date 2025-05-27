"use client"

import { useState, useCallback, useEffect } from "react"
import { supabase, type Chat } from "@/lib/supabase"

export interface ChatFilters {
  status: string
  priority: string
  search: string
  page: number
  limit: number
}

export function useSupabaseChats() {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    closed: 0,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const fetchChats = useCallback(async (filters: Partial<ChatFilters> = {}) => {
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
      if (filters.search) {
        params.append("search", filters.search)
      }
      if (filters.page) {
        params.append("page", filters.page.toString())
      }
      if (filters.limit) {
        params.append("limit", filters.limit.toString())
      }

      const response = await fetch(`/api/chats?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Falha ao buscar chats")
      }

      const data = await response.json()

      setChats(data.chats)
      setStats(data.stats)
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        total: data.total,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      console.error("Erro ao buscar chats:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateChatStatus = useCallback(async (id: string, status: Chat["status"]) => {
    try {
      const response = await fetch("/api/chats", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar chat")
      }

      const { chat } = await response.json()

      setChats((prev) => prev.map((c) => (c.id === id ? chat : c)))

      return chat
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      throw err
    }
  }, [])

  const createChat = useCallback(
    async (chatData: {
      customerName: string
      customerEmail: string
      customerPhone?: string
      message: string
      serviceType?: string
    }) => {
      try {
        const response = await fetch("/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chatData),
        })

        if (!response.ok) {
          throw new Error("Falha ao criar chat")
        }

        const { chat } = await response.json()

        setChats((prev) => [chat, ...prev])

        return chat
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
      .channel("chats-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
        },
        (payload) => {
          console.log("Chat change received:", payload)

          if (payload.eventType === "INSERT") {
            setChats((prev) => [payload.new as Chat, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setChats((prev) => prev.map((chat) => (chat.id === payload.new.id ? (payload.new as Chat) : chat)))
          } else if (payload.eventType === "DELETE") {
            setChats((prev) => prev.filter((chat) => chat.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    chats,
    loading,
    error,
    stats,
    pagination,
    fetchChats,
    updateChatStatus,
    createChat,
    refetch: fetchChats,
  }
}
