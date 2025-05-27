"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useChats, type Chat, type ChatFilters } from "@/hooks/use-chats"
import { useQuotes, type Quote, type QuoteFilters } from "@/hooks/use-quotes"
import { useAnalytics, type Analytics } from "@/hooks/use-analytics"

interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  timestamp: Date
}

interface AdminContextType {
  // Dashboard state
  isOpen: boolean
  setIsOpen: (open: boolean) => void

  // Chats
  chats: Chat[]
  chatFilters: ChatFilters
  setChatFilters: (filters: ChatFilters) => void
  fetchChats: (filters?: ChatFilters) => Promise<Chat[]>
  updateChatStatus: (id: string, status: Chat["status"]) => Promise<void>
  chatsLoading: boolean

  // Quotes
  quotes: Quote[]
  quoteFilters: QuoteFilters
  setQuoteFilters: (filters: QuoteFilters) => void
  fetchQuotes: (filters?: QuoteFilters) => Promise<Quote[]>
  updateQuoteStatus: (id: string, status: Quote["status"]) => Promise<void>
  quotesLoading: boolean

  // Analytics
  analytics: Analytics | null
  fetchAnalytics: () => Promise<Analytics | null>
  analyticsLoading: boolean

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  removeNotification: (id: string) => void

  // Connection status
  isOnline: boolean
  lastUpdate: Date | null
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Chat filters
  const [chatFilters, setChatFilters] = useState<ChatFilters>({
    status: "all",
    priority: "all",
    search: "",
  })

  // Quote filters
  const [quoteFilters, setQuoteFilters] = useState<QuoteFilters>({
    status: "all",
    priority: "all",
    search: "",
  })

  // Hooks
  const { chats, loading: chatsLoading, fetchChats, updateChatStatus } = useChats()
  const { quotes, loading: quotesLoading, fetchQuotes, updateQuoteStatus } = useQuotes()
  const { analytics, loading: analyticsLoading, fetchAnalytics } = useAnalytics()

  // Notification management
  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    }

    setNotifications((prev) => [newNotification, ...prev.slice(0, 9)])

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, 5000)
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  // Auto-refresh data
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        fetchChats(chatFilters)
        fetchQuotes(quoteFilters)
        fetchAnalytics()
        setLastUpdate(new Date())
      }, 60000) // Refresh every minute

      return () => clearInterval(interval)
    }
  }, [isOpen, chatFilters, quoteFilters, fetchChats, fetchQuotes, fetchAnalytics])

  // Simulate real-time notifications
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        if (Math.random() > 0.8) {
          addNotification({
            type: "info",
            title: "Nova atividade",
            message: "Você tem novas mensagens ou orçamentos",
          })
        }
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [isOpen, addNotification])

  // Initial data load
  useEffect(() => {
    if (isOpen) {
      fetchChats(chatFilters)
      fetchQuotes(quoteFilters)
      fetchAnalytics()
      setLastUpdate(new Date())
    }
  }, [isOpen])

  const value: AdminContextType = {
    isOpen,
    setIsOpen,
    chats,
    chatFilters,
    setChatFilters,
    fetchChats,
    updateChatStatus,
    chatsLoading,
    quotes,
    quoteFilters,
    setQuoteFilters,
    fetchQuotes,
    updateQuoteStatus,
    quotesLoading,
    analytics,
    fetchAnalytics,
    analyticsLoading,
    notifications,
    addNotification,
    removeNotification,
    isOnline,
    lastUpdate,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
