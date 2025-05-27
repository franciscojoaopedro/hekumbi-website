"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Chat {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: string
  priority: string
  serviceType: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

interface Quote {
  id: string
  quoteNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: string
  description: string
  status: string
  priority: string
  value: number
  validUntil: string
  createdAt: string
}

interface Analytics {
  overview: {
    totalChats: number
    activeChats: number
    totalQuotes: number
    pendingQuotes: number
    approvedQuotes: number
    totalRevenue: number
    monthlyRevenue: number
    conversionRate: number
    customerSatisfaction: number
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
}

interface SupabaseAdminContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  chats: Chat[]
  chatStats: { total: number; active: number; pending: number; closed: number }
  chatLoading: boolean
  chatError: string | null
  fetchChats: (filters?: any) => Promise<void>
  updateChatStatus: (id: string, status: string) => Promise<void>
  quotes: Quote[]
  quoteStats: { total: number; pending: number; approved: number; rejected: number; sent: number }
  quoteLoading: boolean
  quoteError: string | null
  fetchQuotes: (filters?: any) => Promise<void>
  updateQuoteStatus: (id: string, status: string) => Promise<void>
  analytics: Analytics | null
  analyticsLoading: boolean
  notifications: Notification[]
  removeNotification: (id: string) => void
  isOnline: boolean
  lastUpdate: Date | null
}

const SupabaseAdminContext = createContext<SupabaseAdminContextType | undefined>(undefined)

export function SupabaseAdminProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    }

    setNotifications((prev) => [newNotification, ...prev.slice(0, 9)])

    // Auto-remover após 5 segundos
    setTimeout(() => removeNotification(newNotification.id), 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const fetchChats = async (filters: any = {}) => {
    setChatLoading(true)
    setChatError(null)

    try {
      const params = new URLSearchParams()
      if (filters.status && filters.status !== "all") params.append("status", filters.status)
      if (filters.search) params.append("search", filters.search)

      const response = await fetch(`/api/chats?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Erro ao buscar chats")
      }

      const data = await response.json()
      setChats(data.chats)
      setLastUpdate(new Date())
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Erro desconhecido")
      addNotification({
        type: "error",
        title: "Erro",
        message: "Falha ao carregar chats",
      })
    } finally {
      setChatLoading(false)
    }
  }

  const updateChatStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/chats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar chat")
      }

      setChats((prev) => prev.map((chat) => (chat.id === id ? { ...chat, status } : chat)))

      addNotification({
        type: "success",
        title: "Chat atualizado",
        message: `Status alterado para ${status}`,
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro",
        message: "Falha ao atualizar chat",
      })
    }
  }

  const fetchQuotes = async (filters: any = {}) => {
    setQuoteLoading(true)
    setQuoteError(null)

    try {
      const params = new URLSearchParams()
      if (filters.status && filters.status !== "all") params.append("status", filters.status)
      if (filters.search) params.append("search", filters.search)

      const response = await fetch(`/api/quotes?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Erro ao buscar orçamentos")
      }

      const data = await response.json()
      setQuotes(data.quotes)
      setLastUpdate(new Date())
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : "Erro desconhecido")
      addNotification({
        type: "error",
        title: "Erro",
        message: "Falha ao carregar orçamentos",
      })
    } finally {
      setQuoteLoading(false)
    }
  }

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar orçamento")
      }

      setQuotes((prev) => prev.map((quote) => (quote.id === id ? { ...quote, status } : quote)))

      addNotification({
        type: "success",
        title: "Orçamento atualizado",
        message: `Status alterado para ${status}`,
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro",
        message: "Falha ao atualizar orçamento",
      })
    }
  }

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)

    try {
      const response = await fetch("/api/analytics")

      if (!response.ok) {
        throw new Error("Erro ao buscar analytics")
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro",
        message: "Falha ao carregar analytics",
      })
    } finally {
      setAnalyticsLoading(false)
    }
  }

  // Calcular estatísticas
  const chatStats = {
    total: chats.length,
    active: chats.filter((c) => c.status === "active").length,
    pending: chats.filter((c) => c.status === "pending").length,
    closed: chats.filter((c) => c.status === "closed").length,
  }

  const quoteStats = {
    total: quotes.length,
    pending: quotes.filter((q) => q.status === "pending").length,
    approved: quotes.filter((q) => q.status === "approved").length,
    rejected: quotes.filter((q) => q.status === "rejected").length,
    sent: quotes.filter((q) => q.status === "sent").length,
  }

  // Carregar dados iniciais
  useEffect(() => {
    fetchChats()
    fetchQuotes()
    fetchAnalytics()
  }, [])

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOpen) {
        fetchChats()
        fetchQuotes()
        fetchAnalytics()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isOpen])

  // Verificar conexão
  useEffect(() => {
    const checkConnection = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("online", checkConnection)
    window.addEventListener("offline", checkConnection)

    return () => {
      window.removeEventListener("online", checkConnection)
      window.removeEventListener("offline", checkConnection)
    }
  }, [])

  return (
    <SupabaseAdminContext.Provider
      value={{
        isOpen,
        setIsOpen,
        chats,
        chatStats,
        chatLoading,
        chatError,
        fetchChats,
        updateChatStatus,
        quotes,
        quoteStats,
        quoteLoading,
        quoteError,
        fetchQuotes,
        updateQuoteStatus,
        analytics,
        analyticsLoading,
        notifications,
        removeNotification,
        isOnline,
        lastUpdate,
      }}
    >
      {children}
    </SupabaseAdminContext.Provider>
  )
}

export function useSupabaseAdmin() {
  const context = useContext(SupabaseAdminContext)
  if (context === undefined) {
    throw new Error("useSupabaseAdmin must be used within a SupabaseAdminProvider")
  }
  return context
}
