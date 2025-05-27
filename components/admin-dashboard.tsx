"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import {
  MessageSquare,
  Calculator,
  TrendingUp,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  X,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { Interactive3DCard } from "./interactive-3d-card"

interface ChatMessage {
  id: string
  customerName: string
  customerEmail: string
  lastMessage: string
  timestamp: Date
  status: "active" | "waiting" | "resolved"
  unreadCount: number
  priority: "low" | "medium" | "high"
}

interface Quote {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: string
  area: number
  frequency: string
  urgency: string
  estimatedValue: number
  status: "pending" | "sent" | "approved" | "rejected"
  createdAt: Date
  location: string
}

export function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChat, setSelectedChat] = useState<ChatMessage | null>(null)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const { haptic } = useHapticFeedback()

  // Mock data - em produção, vir do backend
  const [chats] = useState<ChatMessage[]>([
    {
      id: "1",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      lastMessage: "Preciso de orçamento para limpeza de condomínio",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: "active",
      unreadCount: 3,
      priority: "high",
    },
    {
      id: "2",
      customerName: "Maria Santos",
      customerEmail: "maria@email.com",
      lastMessage: "Quando podem começar o serviço?",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: "waiting",
      unreadCount: 1,
      priority: "medium",
    },
    {
      id: "3",
      customerName: "Pedro Costa",
      customerEmail: "pedro@email.com",
      lastMessage: "Obrigado pelo excelente serviço!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "resolved",
      unreadCount: 0,
      priority: "low",
    },
  ])

  const [quotes] = useState<Quote[]>([
    {
      id: "HEK-001",
      customerName: "Ana Ferreira",
      customerEmail: "ana@email.com",
      customerPhone: "+244 123 456 789",
      serviceType: "condominio",
      area: 500,
      frequency: "semanal",
      urgency: "normal",
      estimatedValue: 75000,
      status: "pending",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      location: "Talatona",
    },
    {
      id: "HEK-002",
      customerName: "Carlos Mendes",
      customerEmail: "carlos@email.com",
      customerPhone: "+244 987 654 321",
      serviceType: "hospital",
      area: 1200,
      frequency: "diaria",
      urgency: "urgente",
      estimatedValue: 180000,
      status: "sent",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: "Maianga",
    },
    {
      id: "HEK-003",
      customerName: "Luisa Rodrigues",
      customerEmail: "luisa@email.com",
      customerPhone: "+244 555 123 456",
      serviceType: "empresa",
      area: 300,
      frequency: "quinzenal",
      urgency: "normal",
      estimatedValue: 45000,
      status: "approved",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      location: "Ingombota",
    },
  ])

  const stats = {
    totalChats: chats.length,
    activeChats: chats.filter((c) => c.status === "active").length,
    totalQuotes: quotes.length,
    pendingQuotes: quotes.filter((q) => q.status === "pending").length,
    approvedQuotes: quotes.filter((q) => q.status === "approved").length,
    totalRevenue: quotes.filter((q) => q.status === "approved").reduce((sum, q) => sum + q.estimatedValue, 0),
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "pending":
        return "bg-yellow-500"
      case "waiting":
      case "sent":
        return "bg-blue-500"
      case "resolved":
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d atrás`
    if (hours > 0) return `${hours}h atrás`
    return `${minutes}min atrás`
  }

  return (
    <>
      {/* Admin Access Button */}
      <motion.div
        className="fixed bottom-6 right-52 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 3, duration: 0.5 }}
      >
        <motion.button
          onClick={() => {
            setIsOpen(true)
            haptic("button")
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300"
        >
          <BarChart3 className="w-7 h-7" />
        </motion.button>
      </motion.div>

      {/* Dashboard Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: -15 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 15 }}
              className="bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
              style={{ transformPerspective: 1000 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-white text-2xl font-bold">Dashboard Administrativo</h2>
                  <p className="text-white/80 text-sm">Gerencie chats e orçamentos</p>
                </div>
                <div className="flex items-center gap-4">
                  <motion.div
                    className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm">Online</span>
                  </motion.div>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[80vh]">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Visão Geral
                    </TabsTrigger>
                    <TabsTrigger value="chats" className="data-[state=active]:bg-indigo-600">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chats ({stats.activeChats})
                    </TabsTrigger>
                    <TabsTrigger value="quotes" className="data-[state=active]:bg-indigo-600">
                      <Calculator className="w-4 h-4 mr-2" />
                      Orçamentos ({stats.pendingQuotes})
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600">
                      <PieChart className="w-4 h-4 mr-2" />
                      Relatórios
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Interactive3DCard intensity={0.5}>
                        <Card className="bg-slate-700/50 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-gray-400 text-sm">Chats Ativos</p>
                                <p className="text-2xl font-bold text-white">{stats.activeChats}</p>
                              </div>
                              <MessageSquare className="w-8 h-8 text-cyan-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </Interactive3DCard>

                      <Interactive3DCard intensity={0.5}>
                        <Card className="bg-slate-700/50 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-gray-400 text-sm">Orçamentos Pendentes</p>
                                <p className="text-2xl font-bold text-white">{stats.pendingQuotes}</p>
                              </div>
                              <Clock className="w-8 h-8 text-yellow-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </Interactive3DCard>

                      <Interactive3DCard intensity={0.5}>
                        <Card className="bg-slate-700/50 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-gray-400 text-sm">Aprovados</p>
                                <p className="text-2xl font-bold text-white">{stats.approvedQuotes}</p>
                              </div>
                              <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </Interactive3DCard>

                      <Interactive3DCard intensity={0.5}>
                        <Card className="bg-slate-700/50 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-gray-400 text-sm">Receita Total</p>
                                <p className="text-lg font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                              </div>
                              <DollarSign className="w-8 h-8 text-green-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </Interactive3DCard>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Interactive3DCard intensity={0.8}>
                        <Card className="bg-slate-700/50 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Bell className="w-5 h-5 text-cyan-400" />
                              Atividade Recente
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {chats.slice(0, 3).map((chat) => (
                              <motion.div
                                key={chat.id}
                                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
                                whileHover={{ x: 5, scale: 1.02 }}
                              >
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(chat.status)}`} />
                                <div className="flex-1">
                                  <p className="text-white text-sm font-medium">{chat.customerName}</p>
                                  <p className="text-gray-400 text-xs">{chat.lastMessage.substring(0, 30)}...</p>
                                </div>
                                <span className="text-gray-500 text-xs">{formatTimeAgo(chat.timestamp)}</span>
                              </motion.div>
                            ))}
                          </CardContent>
                        </Card>
                      </Interactive3DCard>

                      <Interactive3DCard intensity={0.8}>
                        <Card className="bg-slate-700/50 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Calculator className="w-5 h-5 text-purple-400" />
                              Orçamentos Recentes
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {quotes.slice(0, 3).map((quote) => (
                              <motion.div
                                key={quote.id}
                                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
                                whileHover={{ x: 5, scale: 1.02 }}
                              >
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(quote.status)}`} />
                                <div className="flex-1">
                                  <p className="text-white text-sm font-medium">{quote.customerName}</p>
                                  <p className="text-gray-400 text-xs">{formatCurrency(quote.estimatedValue)}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {quote.id}
                                </Badge>
                              </motion.div>
                            ))}
                          </CardContent>
                        </Card>
                      </Interactive3DCard>
                    </div>
                  </TabsContent>

                  {/* Chats Tab */}
                  <TabsContent value="chats" className="space-y-4">
                    {/* Search and Filters */}
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Buscar chats..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <Button variant="outline" className="border-slate-600 text-gray-300">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtros
                      </Button>
                    </div>

                    {/* Chats List */}
                    <div className="grid gap-4">
                      {chats.map((chat) => (
                        <Interactive3DCard key={chat.id} intensity={0.5}>
                          <motion.div
                            className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 cursor-pointer"
                            whileHover={{ scale: 1.02, rotateY: 2 }}
                            onClick={() => {
                              setSelectedChat(chat)
                              haptic("selection")
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">{chat.customerName.charAt(0)}</span>
                                  </div>
                                  {chat.unreadCount > 0 && (
                                    <motion.div
                                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                    >
                                      <span className="text-white text-xs font-bold">{chat.unreadCount}</span>
                                    </motion.div>
                                  )}
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-white font-semibold">{chat.customerName}</h3>
                                    <Badge className={`text-xs ${getStatusColor(chat.status)}`}>{chat.status}</Badge>
                                  </div>
                                  <p className="text-gray-400 text-sm">{chat.lastMessage}</p>
                                  <p className="text-gray-500 text-xs mt-1">{chat.customerEmail}</p>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-gray-500 text-xs">{formatTimeAgo(chat.timestamp)}</p>
                                <div className={`text-xs mt-1 ${getPriorityColor(chat.priority)}`}>
                                  {chat.priority} priority
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </Interactive3DCard>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Quotes Tab */}
                  <TabsContent value="quotes" className="space-y-4">
                    {/* Actions Bar */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Buscar orçamentos..."
                            className="pl-10 bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <Button variant="outline" className="border-slate-600 text-gray-300">
                          <Filter className="w-4 h-4 mr-2" />
                          Filtros
                        </Button>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </Button>
                    </div>

                    {/* Quotes List */}
                    <div className="grid gap-4">
                      {quotes.map((quote) => (
                        <Interactive3DCard key={quote.id} intensity={0.5}>
                          <motion.div
                            className="bg-slate-700/50 border border-slate-600 rounded-lg p-6"
                            whileHover={{ scale: 1.01, rotateY: 1 }}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-white font-bold text-lg">{quote.id}</h3>
                                  <Badge className={`${getStatusColor(quote.status)} text-white`}>{quote.status}</Badge>
                                </div>
                                <p className="text-gray-300">{quote.customerName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-cyan-400">
                                  {formatCurrency(quote.estimatedValue)}
                                </p>
                                <p className="text-gray-500 text-sm">{formatTimeAgo(quote.createdAt)}</p>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300 text-sm">{quote.customerPhone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300 text-sm">{quote.customerEmail}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300 text-sm">{quote.location}</span>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-4 gap-4 mb-4 text-sm">
                              <div>
                                <span className="text-gray-400">Serviço:</span>
                                <p className="text-white capitalize">{quote.serviceType}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Área:</span>
                                <p className="text-white">{quote.area} m²</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Frequência:</span>
                                <p className="text-white capitalize">{quote.frequency}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Urgência:</span>
                                <p className="text-white capitalize">{quote.urgency}</p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-600 text-gray-300"
                                onClick={() => setSelectedQuote(quote)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalhes
                              </Button>
                              {quote.status === "pending" && (
                                <>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Aprovar
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                                    Rejeitar
                                  </Button>
                                </>
                              )}
                            </div>
                          </motion.div>
                        </Interactive3DCard>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Analytics Tab */}
                  <TabsContent value="analytics" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Interactive3DCard intensity={0.8}>
                        <Card className="bg-slate-700/50 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-white">Conversões por Mês</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
                              <p className="text-gray-400">Gráfico de conversões aqui</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Interactive3DCard>

                      <Interactive3DCard intensity={0.8}>
                        <Card className="bg-slate-700/50 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-white">Serviços Mais Solicitados</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
                              <p className="text-gray-400">Gráfico de pizza aqui</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Interactive3DCard>
                    </div>

                    <Interactive3DCard intensity={0.8}>
                      <Card className="bg-slate-700/50 border-slate-600">
                        <CardHeader>
                          <CardTitle className="text-white">Receita por Período</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
                            <p className="text-gray-400">Gráfico de linha temporal aqui</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Interactive3DCard>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Detail Modal */}
      <AnimatePresence>
        {selectedChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
            onClick={() => setSelectedChat(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: -15 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 15 }}
              className="bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">{selectedChat.customerName}</h3>
                  <p className="text-white/80 text-sm">{selectedChat.customerEmail}</p>
                </div>
                <Button
                  onClick={() => setSelectedChat(null)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-6">
                <p className="text-gray-300">Detalhes do chat e histórico de mensagens...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote Detail Modal */}
      <AnimatePresence>
        {selectedQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
            onClick={() => setSelectedQuote(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: -15 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 15 }}
              className="bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">Orçamento {selectedQuote.id}</h3>
                  <p className="text-white/80 text-sm">{selectedQuote.customerName}</p>
                </div>
                <Button
                  onClick={() => setSelectedQuote(null)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-6">
                <p className="text-gray-300">Detalhes completos do orçamento...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
