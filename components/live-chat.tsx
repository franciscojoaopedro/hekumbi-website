"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface Message {
  id: string
  chat_id: string
  sender: "customer" | "admin" | "bot"
  content: string
  message_type: "text" | "image" | "file"
  created_at: string
}

interface Chat {
  id: string
  customer_id: string
  status: "active" | "pending" | "closed"
  priority: "low" | "medium" | "high"
  service_type?: string
  last_message?: string
  last_message_time: string
  unread_count: number
  created_at: string
  updated_at: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  created_at: string
  updated_at: string
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [customerData, setCustomerData] = useState<Customer | null>(null)
  const [chatData, setChatData] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null)
  const [showPhoneDialog, setShowPhoneDialog] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [customerName, setCustomerName] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { haptic } = useHapticFeedback()

  const quickReplies = [
    "Solicitar orçamento",
    "Nossos serviços",
    "Falar com atendente",
    "Horário de funcionamento",
    "Localização",
    "Contacto",
  ]

  const botResponses: Record<string, string> = {
    "solicitar orçamento":
      "🎯 Perfeito! Para solicitar um orçamento:\n\n1️⃣ Clique no botão ROXO 'Orçamento' na tela\n2️⃣ Preencha nosso formulário rápido\n3️⃣ Receba sua proposta em até 24h\n\n💰 Orçamento 100% GRATUITO!",
    "nossos serviços":
      "🧹 **SERVIÇOS HEKUMBI**\n\n🏢 **EMPRESARIAIS:**\n• Escritórios e Corporações\n• Shoppings e Centros Comerciais\n• Bancos e Instituições\n\n🏥 **ESPECIALIZADOS:**\n• Hospitais e Clínicas\n• Escolas e Universidades\n• Laboratórios\n\n🏠 **RESIDENCIAIS:**\n• Condomínios\n• Casas e Apartamentos\n• Igrejas e Templos\n\n✨ Qual serviço você precisa?",
    "falar com atendente":
      "👨‍💼 **CONECTANDO COM ATENDENTE...**\n\n🔄 Transferindo seu chat para nossa equipe especializada\n⏱️ Tempo de espera: 2-5 minutos\n📞 Para urgências: +244 923 456 789\n\n💬 Continue enviando mensagens, nosso atendente verá todo o histórico!",
    "horário de funcionamento":
      "🕐 **HORÁRIO DE ATENDIMENTO**\n\n📅 **Segunda a Sexta:**\n⏰ 08:00 às 18:00\n\n📅 **Sábados:**\n⏰ 08:00 às 12:00\n\n🚨 **EMERGÊNCIAS 24H:**\n📞 +244 923 456 789\n📧 emergencia@hekumbi.com\n\n🌙 Fora do horário? Deixe sua mensagem!",
    localização:
      "📍 **NOSSA LOCALIZAÇÃO**\n\n🏢 **Sede Principal:**\nLuanda, Angola\n\n🌍 **Área de Cobertura:**\n• Luanda (todas as regiões)\n• Benguela\n• Huambo\n• Lobito\n\n🚚 Atendimento em toda Angola!\n📞 Consulte disponibilidade: +244 923 456 789",
    contacto:
      "📞 **FALE CONOSCO**\n\n💬 **WhatsApp:** +244 923 456 789\n📧 **Email:** contacto@hekumbi.com\n🌐 **Site:** www.hekumbi.com\n📍 **Endereço:** Luanda, Angola\n\n⚡ **Resposta Rápida:**\n• WhatsApp: Imediato\n• Email: Até 2 horas\n• Chat: Tempo real",
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !customerData) {
      initializeChat()
    }
  }, [isOpen])

  // Configurar realtime subscription com melhor controle
  useEffect(() => {
    if (!chatData?.id) return

    console.log("🔄 [REALTIME] Configurando para chat:", chatData.id)
    setConnectionStatus("connecting")

    // Limpar canal anterior se existir
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
    }

    const channel = supabase
      .channel(`chat-${chatData.id}-${Date.now()}`, {
        config: {
          broadcast: { self: true },
          presence: { key: chatData.id },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "*", // Capturar todos os eventos (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatData.id}`,
        },
        (payload) => {
          console.log("📨 [REALTIME] Evento de mensagem:", payload.eventType, payload.new)

          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as Message

            console.log("📨 [REALTIME] Nova mensagem:", newMessage.sender, newMessage.content.slice(0, 30))

            // Adicionar todas as mensagens, independente do remetente
            setMessages((prev) => {
              const exists = prev.some((msg) => msg.id === newMessage.id)
              if (exists) {
                console.log("⚠️ [REALTIME] Mensagem duplicada ignorada")
                return prev
              }

              console.log("✅ [REALTIME] Mensagem adicionada:", newMessage.content.slice(0, 30))
              return [...prev, newMessage]
            })

            // Notificação se chat não estiver aberto
            if ((!isOpen || isMinimized) && newMessage.sender !== "customer") {
              setHasUnreadMessages(true)
              haptic("notification")
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chats",
          filter: `id=eq.${chatData.id}`,
        },
        (payload) => {
          console.log("🔄 [REALTIME] Chat atualizado:", payload.new)
          setChatData(payload.new as Chat)
        },
      )
      .subscribe((status) => {
        console.log("📡 [REALTIME] Status:", status)
        if (status === "SUBSCRIBED") {
          setConnectionStatus("connected")
          setIsConnected(true)
          console.log("✅ [REALTIME] Conectado com sucesso!")
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setConnectionStatus("disconnected")
          setIsConnected(false)
          console.log("❌ [REALTIME] Erro na conexão:", status)

          // Tentar reconectar após 5 segundos
          setTimeout(() => {
            if (chatData?.id) {
              console.log("🔄 [REALTIME] Tentando reconectar...")
              setupRealtimeSubscription(chatData.id)
            }
          }, 5000)
        }
      })

    setRealtimeChannel(channel)

    return () => {
      console.log("🔌 [REALTIME] Desconectando canal")
      if (channel) {
        supabase.removeChannel(channel)
      }
      setIsConnected(false)
    }
  }, [chatData?.id, isOpen])

  // Função separada para configurar realtime (para reconexão)
  const setupRealtimeSubscription = (chatId: string) => {
    // Limpar canal anterior se existir
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
    }

    const channel = supabase
      .channel(`chat-${chatId}-${Date.now()}`, {
        config: {
          broadcast: { self: true },
          presence: { key: chatId },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "*", // Capturar todos os eventos
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log("📨 [REALTIME] Evento de mensagem:", payload.eventType, payload.new)

          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as Message

            console.log("📨 [REALTIME] Nova mensagem:", newMessage.sender, newMessage.content.slice(0, 30))

            // Adicionar todas as mensagens, independente do remetente
            setMessages((prev) => {
              const exists = prev.some((msg) => msg.id === newMessage.id)
              if (exists) {
                console.log("⚠️ [REALTIME] Mensagem duplicada ignorada")
                return prev
              }

              console.log("✅ [REALTIME] Mensagem adicionada:", newMessage.content.slice(0, 30))
              return [...prev, newMessage]
            })

            // Notificação se chat não estiver aberto
            if ((!isOpen || isMinimized) && newMessage.sender !== "customer") {
              setHasUnreadMessages(true)
              haptic("notification")
            }
          }
        },
      )
      .subscribe((status) => {
        console.log("📡 [REALTIME] Status:", status)
        if (status === "SUBSCRIBED") {
          setConnectionStatus("connected")
          setIsConnected(true)
          console.log("✅ [REALTIME] Conectado com sucesso!")
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setConnectionStatus("disconnected")
          setIsConnected(false)
          console.log("❌ [REALTIME] Erro na conexão:", status)
        }
      })

    setRealtimeChannel(channel)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const initializeChat = async () => {
    setIsLoading(true)
    try {
      console.log("🚀 [INIT] Inicializando chat...")

      const customer = await getOrCreateCustomer()
      if (!customer) throw new Error("Falha ao criar cliente")

      const chat = await getOrCreateChat(customer.id)
      if (!chat) throw new Error("Falha ao criar chat")

      await loadMessages(chat.id)

      // Enviar mensagem de boas-vindas se for um novo chat
      if (messages.length === 0) {
        await sendWelcomeMessage(chat.id)
      }

      // Verificar se precisamos coletar o telefone
      if (!customer.phone || customer.phone === "+244 XXX XXX XXX") {
        setShowPhoneDialog(true)
        setCustomerName(customer.name)
      }

      console.log("✅ [INIT] Chat inicializado com sucesso!")
    } catch (error) {
      console.error("❌ [INIT] Erro ao inicializar chat:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getOrCreateCustomer = async (): Promise<Customer | null> => {
    if (customerData) return customerData

    try {
      const existingCustomerId = localStorage.getItem("hekumbi_customer_id")

      if (existingCustomerId) {
        const { data: customer, error } = await supabase
          .from("customers")
          .select("*")
          .eq("id", existingCustomerId)
          .single()

        if (!error && customer) {
          setCustomerData(customer)
          console.log("✅ [CUSTOMER] Cliente existente encontrado:", customer.name)
          return customer
        }
      }

      const guestEmail = `guest_${Date.now()}@hekumbi.com`
      const guestName = `Visitante ${Date.now().toString().slice(-4)}`

      const { data: customer, error } = await supabase
        .from("customers")
        .insert({
          name: guestName,
          email: guestEmail,
          phone: "+244 XXX XXX XXX",
        })
        .select()
        .single()

      if (error) throw error

      localStorage.setItem("hekumbi_customer_id", customer.id)
      setCustomerData(customer)
      console.log("✅ [CUSTOMER] Novo cliente criado:", customer.name)
      return customer
    } catch (error) {
      console.error("❌ [CUSTOMER] Erro:", error)
      return null
    }
  }

  const getOrCreateChat = async (customerId: string): Promise<Chat | null> => {
    if (chatData) return chatData

    try {
      const { data: existingChats, error: searchError } = await supabase
        .from("chats")
        .select("*")
        .eq("customer_id", customerId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)

      if (!searchError && existingChats && existingChats.length > 0) {
        const chat = existingChats[0]
        setChatData(chat)
        console.log("✅ [CHAT] Chat existente encontrado:", chat.id)
        return chat
      }

      const { data: chat, error } = await supabase
        .from("chats")
        .insert({
          customer_id: customerId,
          status: "active",
          priority: "medium",
          service_type: "Consulta Geral",
          last_message: "Chat iniciado",
          last_message_time: new Date().toISOString(),
          unread_count: 0,
        })
        .select()
        .single()

      if (error) throw error

      setChatData(chat)
      console.log("✅ [CHAT] Novo chat criado:", chat.id)
      return chat
    } catch (error) {
      console.error("❌ [CHAT] Erro:", error)
      return null
    }
  }

  const loadMessages = async (chatId: string) => {
    try {
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true })

      if (error) throw error

      setMessages(messages || [])
      console.log("✅ [MESSAGES] Carregadas:", messages?.length || 0)
    } catch (error) {
      console.error("❌ [MESSAGES] Erro ao carregar:", error)
    }
  }

  const sendWelcomeMessage = async (chatId: string) => {
    const welcomeText =
      "👋 **Olá! Bem-vindo à HEKUMBI!**\n\nSou seu assistente virtual e estou aqui para ajudá-lo com:\n\n🧹 **Informações sobre serviços**\n💰 **Solicitação de orçamentos**\n👨‍💼 **Contacto com nossa equipe**\n📞 **Suporte e dúvidas**\n\n✨ **Como posso ajudá-lo hoje?**"

    await saveMessage(chatId, welcomeText, "bot")
  }

  const saveMessage = async (chatId: string, content: string, sender: "customer" | "bot" | "admin") => {
    try {
      const { data: message, error } = await supabase
        .from("messages")
        .insert({
          chat_id: chatId,
          sender,
          content,
          message_type: "text",
        })
        .select()
        .single()

      if (error) throw error

      await supabase
        .from("chats")
        .update({
          last_message: content,
          last_message_time: new Date().toISOString(),
          unread_count: sender === "customer" ? 0 : 1,
        })
        .eq("id", chatId)

      console.log("✅ [SAVE] Mensagem salva:", { sender, content: content.slice(0, 30) })
      return message
    } catch (error) {
      console.error("❌ [SAVE] Erro ao salvar mensagem:", error)
      return null
    }
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !chatData || isLoading) return

    haptic("selection")
    setInputValue("")

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      chat_id: chatData.id,
      content: text,
      sender: "customer",
      message_type: "text",
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempMessage])

    await saveMessage(chatData.id, text, "customer")

    setIsTyping(true)
    setTimeout(async () => {
      const lowerText = text.toLowerCase()
      let botResponse =
        "Obrigado pela sua mensagem! 😊\n\nUm de nossos atendentes entrará em contacto em breve. Enquanto isso, posso ajudá-lo com informações básicas sobre nossos serviços.\n\n💡 **Dica:** Use as respostas rápidas abaixo para agilizar o atendimento!"

      for (const [key, response] of Object.entries(botResponses)) {
        if (lowerText.includes(key.replace(/\s+/g, "")) || lowerText.includes(key)) {
          botResponse = response
          break
        }
      }

      await saveMessage(chatData.id, botResponse, "bot")
      setIsTyping(false)
      haptic("notification")
    }, 2000)
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  const handleSavePhone = async () => {
    if (!phoneNumber || !customerData) return

    try {
      // Atualizar cliente com telefone
      const { error } = await supabase
        .from("customers")
        .update({
          phone: phoneNumber,
          name: customerName || customerData.name,
        })
        .eq("id", customerData.id)

      if (error) throw error

      // Atualizar estado local
      setCustomerData({
        ...customerData,
        phone: phoneNumber,
        name: customerName || customerData.name,
      })

      // Enviar mensagem de agradecimento
      if (chatData) {
        await saveMessage(
          chatData.id,
          `Obrigado por fornecer seu contacto, ${customerName || "visitante"}! 📞\n\nAgora podemos entrar em contacto caso necessário. Como posso ajudá-lo hoje?`,
          "bot",
        )
      }

      setShowPhoneDialog(false)
      console.log("✅ [PHONE] Telefone salvo com sucesso:", phoneNumber)
    } catch (error) {
      console.error("❌ [PHONE] Erro ao salvar telefone:", error)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("pt-AO", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-400"
      case "connecting":
        return "bg-yellow-400"
      case "disconnected":
        return "bg-red-400"
      default:
        return "bg-gray-400"
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Online • Tempo Real"
      case "connecting":
        return "Conectando..."
      case "disconnected":
        return "Reconectando..."
      default:
        return "Verificando..."
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-20 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen)
            if (!isOpen) {
              setHasUnreadMessages(false)
              setIsMinimized(false)
            }
            haptic("button")
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(34, 211, 238, 0.7)",
              "0 0 0 10px rgba(34, 211, 238, 0)",
              "0 0 0 20px rgba(34, 211, 238, 0)",
            ],
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            },
          }}
          className="w-16 h-16 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-300 relative"
        >
          <MessageCircle className="w-8 h-8" />

          {/* Notification Badge */}
          {hasUnreadMessages && (
            <motion.div
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-white text-xs font-bold">!</span>
            </motion.div>
          )}

          {/* Connection Status */}
          <div
            className={`absolute -bottom-1 -left-1 w-4 h-4 ${getConnectionStatusColor()} rounded-full border-2 border-white`}
          />
        </motion.button>
      </motion.div>

      {/* Phone Collection Dialog */}
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Complete seu perfil</DialogTitle>
            <DialogDescription className="text-gray-300">
              Para melhor atendimento, precisamos de algumas informações básicas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Seu nome
              </label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Digite seu nome"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-300">
                Seu telefone
              </label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+244 XXX XXX XXX"
                className="bg-slate-700 border-slate-600 text-white"
              />
              <p className="text-xs text-gray-400">
                Usamos seu telefone apenas para contacto relacionado ao seu atendimento.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPhoneDialog(false)}
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              Depois
            </Button>
            <Button onClick={handleSavePhone} className="bg-cyan-500 hover:bg-cyan-600">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              width: isMinimized ? "320px" : "450px",
              height: isMinimized ? "60px" : "600px",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-4 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{
              width: isMinimized ? "320px" : "450px",
              height: isMinimized ? "60px" : "600px",
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Bot className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-base">Chat HEKUMBI</h3>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <span className="text-white/90 text-xs font-medium">{getConnectionStatusText()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setIsMinimized(!isMinimized)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/80 hover:text-white p-1"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/80 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Customer Info */}
                {customerData && (
                  <div className="bg-slate-700/50 p-3 border-b border-slate-600">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 font-medium">{customerData.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {customerData.phone && customerData.phone !== "+244 XXX XXX XXX" && (
                          <div className="flex items-center gap-1 text-gray-400">
                            <Phone className="w-3 h-3" />
                            <span className="text-xs">{customerData.phone}</span>
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {chatData?.status || "ativo"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                          className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2"
                        />
                        <div className="text-gray-400">Iniciando chat...</div>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Carregando mensagens...</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.sender === "customer" ? "justify-end" : "justify-start"}`}
                      >
                        <div className="flex items-start gap-2 max-w-[85%]">
                          {message.sender !== "customer" && (
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                                message.sender === "bot" ? "bg-purple-500" : "bg-green-500"
                              }`}
                            >
                              {message.sender === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                          )}

                          <div
                            className={`p-4 rounded-2xl ${
                              message.sender === "customer"
                                ? "bg-cyan-500 text-white"
                                : message.sender === "bot"
                                  ? "bg-purple-500 text-white"
                                  : "bg-green-500 text-white"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-80 font-medium">
                                {message.sender === "customer"
                                  ? "Você"
                                  : message.sender === "bot"
                                    ? "Bot"
                                    : "Atendente"}
                              </span>
                              <span className="text-xs opacity-80">{formatTime(message.created_at)}</span>
                            </div>
                          </div>

                          {message.sender === "customer" && (
                            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-slate-700 p-4 rounded-2xl">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{
                                  duration: 1,
                                  repeat: Number.POSITIVE_INFINITY,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length <= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 border-t border-slate-700"
                  >
                    <p className="text-gray-400 text-xs mb-3 font-medium">💬 Respostas rápidas:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickReplies.slice(0, 6).map((reply) => (
                        <motion.button
                          key={reply}
                          onClick={() => handleQuickReply(reply)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 text-xs rounded-lg transition-colors text-left"
                        >
                          {reply}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-slate-700">
                  <div className="flex gap-3">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-gray-400 text-sm h-12"
                      disabled={isLoading || !chatData}
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => handleSendMessage(inputValue)}
                        size="sm"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white h-12 px-4"
                        disabled={isLoading || !chatData || !inputValue.trim()}
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">Pressione Enter para enviar</p>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`} />
                      <span className="text-xs text-gray-400">
                        {isConnected ? "Tempo Real Ativo" : "Reconectando..."}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
