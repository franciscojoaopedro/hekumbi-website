"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSupabaseAdmin } from "@/contexts/supabase-admin-context"
import {
  Settings,
  MessageSquare,
  FileText,
  BarChart3,
  Bell,
  RefreshCw,
  X,
  Clock,
  TrendingUp,
  DollarSign,
  Eye,
  Star,
  Wifi,
  WifiOff,
} from "lucide-react"

export function AdminDashboardDynamic() {
  const {
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
  } = useSupabaseAdmin()

  const [activeTab, setActiveTab] = useState("overview")
  const [chatFilters, setChatFilters] = useState({ search: "", status: "all" })
  const [quoteFilters, setQuoteFilters] = useState({ search: "", status: "all" })

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      >
        <Settings className="w-6 h-6" />
      </motion.button>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "closed":
        return "bg-gray-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "sent":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Header */}
        <motion.div
          className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 p-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.h1 className="text-2xl font-bold text-white" whileHover={{ scale: 1.05, rotateY: 5 }}>
                Dashboard Administrativo
              </motion.h1>

              <div className="flex items-center gap-2">
                {isOnline ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-sm">Offline</span>
                  </div>
                )}

                {lastUpdate && (
                  <span className="text-xs text-gray-400">
                    Última atualização: {formatDate(lastUpdate.toISOString())}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>

              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Notifications Panel */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-20 right-4 w-80 max-h-96 overflow-y-auto bg-slate-800 rounded-lg border border-slate-700 shadow-xl z-60"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Notificações</h3>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-700 p-3 rounded-lg relative"
                  >
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="pr-6">
                      <h4 className="font-medium text-white">{notification.title}</h4>
                      <p className="text-sm text-gray-300">{notification.message}</p>
                      <span className="text-xs text-gray-400">{formatDate(notification.timestamp.toISOString())}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <motion.div
              className="bg-slate-800/50 border-b border-slate-700 px-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <TabsList className="bg-transparent">
                <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="chats" className="data-[state=active]:bg-slate-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chats ({chats.length})
                </TabsTrigger>
                <TabsTrigger value="quotes" className="data-[state=active]:bg-slate-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Orçamentos ({quotes.length})
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {analytics && (
                    <>
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-400">Total de Chats</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-white">{analytics.overview.totalChats}</div>
                          <p className="text-xs text-green-400">
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            {analytics.overview.activeChats} ativos
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-400">Orçamentos</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-white">{analytics.overview.totalQuotes}</div>
                          <p className="text-xs text-yellow-400">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {analytics.overview.pendingQuotes} pendentes
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-400">Receita Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-white">
                            {formatCurrency(analytics.overview.totalRevenue)}
                          </div>
                          <p className="text-xs text-green-400">
                            <DollarSign className="w-3 h-3 inline mr-1" />
                            {formatCurrency(analytics.overview.monthlyRevenue)} este mês
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-400">Taxa de Conversão</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-white">{analytics.overview.conversionRate}%</div>
                          <p className="text-xs text-blue-400">
                            <Star className="w-3 h-3 inline mr-1" />
                            {analytics.overview.customerSatisfaction}/5 satisfação
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </motion.div>

                {/* Recent Activity */}
                {analytics && analytics.recentActivity && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Atividade Recente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analytics.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
                              <div
                                className={`w-2 h-2 rounded-full ${activity.type === "chat" ? "bg-blue-500" : "bg-green-500"}`}
                              />
                              <div className="flex-1">
                                <p className="text-white text-sm">{activity.description}</p>
                                <p className="text-gray-400 text-xs">{formatDate(activity.timestamp)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>

              {/* Chats Tab */}
              <TabsContent value="chats" className="mt-0">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  {/* Filters */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Buscar chats..."
                        value={chatFilters.search}
                        onChange={(e) => setChatFilters({ ...chatFilters, search: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <Select
                      value={chatFilters.status}
                      onValueChange={(value) => setChatFilters({ ...chatFilters, status: value })}
                    >
                      <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Ativos</SelectItem>
                        <SelectItem value="pending">Pendentes</SelectItem>
                        <SelectItem value="closed">Fechados</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => fetchChats(chatFilters)}
                      disabled={chatLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {chatLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Chats List */}
                  <div className="space-y-4">
                    {chats.map((chat) => (
                      <motion.div
                        key={chat.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-white">{chat.customerName}</h3>
                            <Badge className={`${getStatusColor(chat.status)} text-white`}>{chat.status}</Badge>
                            <Badge className={`${getPriorityColor(chat.priority)} text-white`}>{chat.priority}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Select
                              value={chat.status}
                              onValueChange={(value) => updateChatStatus(chat.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8 bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="closed">Fechado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Email:</p>
                            <p className="text-white">{chat.customerEmail}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Telefone:</p>
                            <p className="text-white">{chat.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Serviço:</p>
                            <p className="text-white">{chat.serviceType}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Última mensagem:</p>
                            <p className="text-white">{formatDate(chat.lastMessageTime)}</p>
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-slate-700/50 rounded">
                          <p className="text-gray-300 text-sm">{chat.lastMessage}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              {/* Quotes Tab */}
              <TabsContent value="quotes" className="mt-0">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  {/* Filters */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Buscar orçamentos..."
                        value={quoteFilters.search}
                        onChange={(e) => setQuoteFilters({ ...quoteFilters, search: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <Select
                      value={quoteFilters.status}
                      onValueChange={(value) => setQuoteFilters({ ...quoteFilters, status: value })}
                    >
                      <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendentes</SelectItem>
                        <SelectItem value="approved">Aprovados</SelectItem>
                        <SelectItem value="rejected">Rejeitados</SelectItem>
                        <SelectItem value="sent">Enviados</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => fetchQuotes(quoteFilters)}
                      disabled={quoteLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {quoteLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Quotes List */}
                  <div className="space-y-4">
                    {quotes.map((quote) => (
                      <motion.div
                        key={quote.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-white">{quote.customerName}</h3>
                            <Badge className={`${getStatusColor(quote.status)} text-white`}>{quote.status}</Badge>
                            <Badge className={`${getPriorityColor(quote.priority)} text-white`}>{quote.priority}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-green-400">{formatCurrency(quote.value)}</span>
                            <Select
                              value={quote.status}
                              onValueChange={(value) => updateQuoteStatus(quote.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8 bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="approved">Aprovado</SelectItem>
                                <SelectItem value="rejected">Rejeitado</SelectItem>
                                <SelectItem value="sent">Enviado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-400">Email:</p>
                            <p className="text-white">{quote.customerEmail}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Telefone:</p>
                            <p className="text-white">{quote.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Serviço:</p>
                            <p className="text-white">{quote.serviceType}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Válido até:</p>
                            <p className="text-white">{formatDate(quote.validUntil)}</p>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-700/50 rounded">
                          <p className="text-gray-300 text-sm">{quote.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
