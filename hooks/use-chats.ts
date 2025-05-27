"use client"

import { useState, useCallback } from "react"
import { useApi } from "./use-api"

export interface Chat {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: "active" | "pending" | "closed"
  priority: "low" | "medium" | "high"
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  serviceType: string
  createdAt: string
}

export interface ChatFilters {
  status: string
  priority: string
  search: string
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([])
  const { request, loading, error } = useApi()

  const fetchChats = useCallback(
    async (filters: ChatFilters = { status: "all", priority: "all", search: "" }) => {
      try {
        const params = new URLSearchParams()
        if (filters.status !== "all") params.append("status", filters.status)
        if (filters.priority !== "all") params.append("priority", filters.priority)
        if (filters.search) params.append("search", filters.search)

        const data = await request(`/api/chats?${params.toString()}`)
        setChats(data.chats)
        return data.chats
      } catch (err) {
        console.error("Erro ao buscar chats:", err)
        return []
      }
    },
    [request],
  )

  const updateChatStatus = useCallback(
    async (id: string, status: Chat["status"]) => {
      try {
        await request(`/api/chats/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        })

        setChats((prev) => prev.map((chat) => (chat.id === id ? { ...chat, status } : chat)))
      } catch (err) {
        console.error("Erro ao atualizar chat:", err)
        throw err
      }
    },
    [request],
  )

  return {
    chats,
    loading,
    error,
    fetchChats,
    updateChatStatus,
  }
}
