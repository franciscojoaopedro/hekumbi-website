"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Send, Phone, Mail, Clock, User, MessageSquare, X, Bot, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Message {
  id: string
  chat_id: string
  content: string
  sender: "customer" | "admin" | "bot"
  message_type: string
  created_at: string
}

interface ChatInterfaceProps {
  chat: any
  onClose: () => void
  onSendMessage: (chatId: string, content: string) => Promise<void>
}

export function ChatInterface({ chat, onClose, onSendMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    fetchMessages()
    setupRealtimeSubscription()

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
      }
    }
  }, [chat.id])

  // Configurar subscription em tempo real
  const setupRealtimeSubscription = () => {
    console.log("🔄 [ADMIN] Configurando realtime para chat:", chat.id)

    // Limpar canal anterior se existir
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
    }

    const channel = supabase
      .channel(`admin-chat-${chat.id}-${Date.now()}`, {
        config: {
          broadcast: { self: true },
          presence: { key: `admin-${chat.id}` },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "*", // Capturar todos os eventos
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chat.id}`,
        },
        (payload) => {
          console.log("📨 [ADMIN] Evento de mensagem:", payload.eventType, payload.new)

          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as Message

            console.log("📨 [ADMIN] Nova mensagem:", newMessage.sender, newMessage.content.slice(0, 30))

            setMessages((prev) => {
              // Verificar se a mensagem já existe
              const exists = prev.some((msg) => msg.id === newMessage.id)
              if (exists) {
                console.log("⚠️ [ADMIN] Mensagem duplicada ignorada")
                return prev
              }

              console.log("✅ [ADMIN] Mensagem adicionada:", newMessage.content.slice(0, 30))
              return [...prev, newMessage]
            })
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chats",
          filter: `id=eq.${chat.id}`,
        },
        (payload) => {
          console.log("🔄 [ADMIN] Chat atualizado:", payload.new)
        },
      )
      .subscribe((status) => {
        console.log("📡 [ADMIN] Status da conexão realtime:", status)
        setIsConnected(status === "SUBSCRIBED")
      })

    setRealtimeChannel(channel)
  }

  const fetchMessages = async () => {
    setMessagesLoading(true)
    try {
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chat.id)
        .order("created_at", { ascending: true })

      if (error) throw error

      setMessages(messages || [])
      console.log("✅ [ADMIN] Mensagens carregadas:", messages?.length || 0)
    } catch (error) {
      console.error("❌ [ADMIN] Erro ao buscar mensagens:", error)
    } finally {
      setMessagesLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading) return

    setLoading(true)
    const messageContent = newMessage
    setNewMessage("")

    try {
      console.log("🚀 [ADMIN] Enviando mensagem:", messageContent.slice(0, 30))

      // Salvar mensagem diretamente no banco
      const { data: message, error } = await supabase
        .from("messages")
        .insert({
          chat_id: chat.id,
          sender: "admin",
          content: messageContent,
          message_type: "text",
        })
        .select()
        .single()

      if (error) throw error

      console.log("✅ [ADMIN] Mensagem salva no banco:", message)

      // Atualizar chat
      await supabase
        .from("chats")
        .update({
          last_message: messageContent,
          last_message_time: new Date().toISOString(),
          unread_count: 1, // Incrementar contador de não lidas para o cliente
          status: "active",
        })
        .eq("id", chat.id)

      console.log("✅ [ADMIN] Chat atualizado")

      // Simular resposta automática do bot se necessário
      if (messageContent.toLowerCase().includes("obrigado") || messageContent.toLowerCase().includes("resolvido")) {
        setTimeout(async () => {
          await supabase.from("messages").insert({
            chat_id: chat.id,
            sender: "bot",
            content: "Fico feliz em ajudar! 😊 Se precisar de mais alguma coisa, estarei aqui.",
            message_type: "text",
          })
        }, 2000)
      }
    } catch (error) {
      console.error("❌ [ADMIN] Erro ao enviar mensagem:", error)
      setNewMessage(messageContent) // Restaurar mensagem em caso de erro
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("pt-AO", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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
      default:
        return "bg-gray-500"
    }
  }

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case "customer":
        return <User className="w-4 h-4" />
      case "admin":
        return <CheckCircle className="w-4 h-4" />
      case "bot":
        return <Bot className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case "customer":
        return "bg-blue-500"
      case "admin":
        return "bg-green-500"
      case "bot":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{chat.customerName}</h3>
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(chat.status)} text-white text-xs`}>{chat.status}</Badge>
                <span className="text-white/80 text-sm">{chat.serviceType}</span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
                  <span className="text-white/70 text-xs">{isConnected ? "Tempo Real" : "Desconectado"}</span>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Customer Info */}
        <div className="bg-slate-700/50 p-4 border-b border-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{chat.customerEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{chat.customerPhone || "Não informado"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Última mensagem: {formatTime(chat.lastMessageTime)}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messagesLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-400">Carregando mensagens...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Nenhuma mensagem ainda</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const showDate =
                index === 0 || formatDate(message.created_at) !== formatDate(messages[index - 1].created_at)

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center my-4">
                      <span className="bg-slate-700 text-gray-300 px-3 py-1 rounded-full text-xs">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-start gap-2 max-w-[70%]">
                      {message.sender !== "admin" && (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getSenderColor(message.sender)}`}
                        >
                          {getSenderIcon(message.sender)}
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl ${
                          message.sender === "admin"
                            ? "bg-cyan-500 text-white"
                            : message.sender === "bot"
                              ? "bg-purple-500 text-white"
                              : "bg-slate-700 text-gray-100"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {message.sender === "admin" ? "Você" : message.sender === "bot" ? "Bot" : "Cliente"}
                          </span>
                          <span className="text-xs opacity-70">{formatTime(message.created_at)}</span>
                        </div>
                      </div>

                      {message.sender === "admin" && (
                        <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              )
            })
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="bg-slate-700 p-3 rounded-2xl">
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
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-slate-600 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua resposta..."
              className="flex-1 bg-slate-700 border-slate-600 text-white resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            <Button
              type="submit"
              disabled={loading || !newMessage.trim()}
              className="bg-cyan-500 hover:bg-cyan-600 self-end"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                  <Send className="w-4 h-4" />
                </motion.div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">Pressione Enter para enviar, Shift+Enter para nova linha</p>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
              <span className="text-xs text-gray-400">{isConnected ? "Conectado" : "Desconectado"}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
