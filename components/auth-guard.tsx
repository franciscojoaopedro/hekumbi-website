"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, User, Shield } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

// Sistema de autenticação local para desenvolvimento
const LOCAL_AUTH_KEY = "hekumbi_admin_auth"
const DEMO_CREDENTIALS = {
  email: "admin@hekumbi.com",
  password: "hekumbi2024",
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [authMode, setAuthMode] = useState<"local" | "demo">("local")

  useEffect(() => {
    // Verificar se há usuário logado localmente
    const checkLocalAuth = () => {
      try {
        const savedAuth = localStorage.getItem(LOCAL_AUTH_KEY)
        if (savedAuth) {
          const authData = JSON.parse(savedAuth)
          if (authData && authData.email && authData.timestamp) {
            // Verificar se a sessão não expirou (24 horas)
            const now = Date.now()
            const sessionAge = now - authData.timestamp
            const maxAge = 24 * 60 * 60 * 1000 // 24 horas

            if (sessionAge < maxAge) {
              setUser(authData)
              setLoading(false)
              return
            } else {
              // Sessão expirada
              localStorage.removeItem(LOCAL_AUTH_KEY)
            }
          }
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação local:", error)
        localStorage.removeItem(LOCAL_AUTH_KEY)
      }

      setLoading(false)
    }

    checkLocalAuth()
  }, [])

  const handleDemoLogin = () => {
    const demoUser = {
      id: "demo-user",
      email: "demo@hekumbi.com",
      name: "Usuário Demo",
      role: "admin",
      timestamp: Date.now(),
      mode: "demo",
    }

    setUser(demoUser)
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(demoUser))
    setSuccess("✅ Acesso demo ativado com sucesso!")
  }

  const handleLocalAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (isSignUp) {
        // Modo cadastro - aceitar qualquer email/senha válidos
        if (email.includes("@") && password.length >= 6) {
          const newUser = {
            id: `user-${Date.now()}`,
            email,
            name: "Administrador",
            role: "admin",
            timestamp: Date.now(),
            mode: "local",
          }

          // Salvar usuário criado
          const users = JSON.parse(localStorage.getItem("hekumbi_users") || "[]")
          users.push({ email, password, ...newUser })
          localStorage.setItem("hekumbi_users", JSON.stringify(users))

          setSuccess("✅ Conta criada com sucesso! Agora você pode fazer login.")
          setIsSignUp(false)
          setEmail("")
          setPassword("")
        } else {
          throw new Error("Email deve conter @ e senha deve ter pelo menos 6 caracteres")
        }
      } else {
        // Modo login
        let loginSuccess = false

        // Verificar credenciais demo
        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
          loginSuccess = true
        } else {
          // Verificar usuários criados localmente
          const users = JSON.parse(localStorage.getItem("hekumbi_users") || "[]")
          const foundUser = users.find((u: any) => u.email === email && u.password === password)
          if (foundUser) {
            loginSuccess = true
          }
        }

        if (loginSuccess) {
          const authUser = {
            id: `user-${Date.now()}`,
            email,
            name: "Administrador HEKUMBI",
            role: "admin",
            timestamp: Date.now(),
            mode: "local",
          }

          setUser(authUser)
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(authUser))
          setSuccess("✅ Login realizado com sucesso!")
        } else {
          throw new Error("Email ou senha incorretos")
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      setError(`❌ ${error.message}`)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem(LOCAL_AUTH_KEY)
    setSuccess("✅ Logout realizado com sucesso!")

    // Limpar formulário
    setEmail("")
    setPassword("")
    setError("")
  }

  const fillTestCredentials = () => {
    setEmail(DEMO_CREDENTIALS.email)
    setPassword(DEMO_CREDENTIALS.password)
    setError("")
    setSuccess("📝 Credenciais de teste preenchidas! Clique em 'Entrar'")
  }

  const clearAllData = () => {
    localStorage.removeItem(LOCAL_AUTH_KEY)
    localStorage.removeItem("hekumbi_users")
    setUser(null)
    setEmail("")
    setPassword("")
    setError("")
    setSuccess("🗑️ Todos os dados limpos! Sistema resetado.")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="text-center">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">
                {isSignUp ? "Criar Conta Admin" : "Login Administrativo"}
              </CardTitle>
              <p className="text-gray-400">Sistema HEKUMBI - Acesso Local</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Botões de acesso rápido */}
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={handleDemoLogin}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <User className="w-4 h-4 mr-2" />🚀 Acesso Demo Instantâneo
                </Button>

                <Button
                  onClick={fillTestCredentials}
                  variant="outline"
                  className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />📝 Preencher Credenciais Teste
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800 px-2 text-gray-400">ou faça login manual</span>
                </div>
              </div>

              <form onSubmit={handleLocalAuth} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@hekumbi.com"
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-green-400 text-sm">{success}</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  {authLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                  {authLoading ? "Processando..." : isSignUp ? "Criar Conta" : "Entrar"}
                </Button>

                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setError("")
                      setSuccess("")
                    }}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    {isSignUp ? "← Fazer login" : "Criar conta →"}
                  </button>

                  <button type="button" onClick={clearAllData} className="text-red-400 hover:text-red-300">
                    🗑️ Reset
                  </button>
                </div>
              </form>

              {/* Instruções */}
              <div className="mt-6 p-3 bg-slate-700/50 rounded-lg space-y-2">
                <p className="text-xs text-gray-400">
                  <strong>💡 Credenciais de teste:</strong>
                </p>
                <p className="text-xs text-cyan-400 font-mono">
                  Email: admin@hekumbi.com
                  <br />
                  Senha: hekumbi2024
                </p>
                <p className="text-xs text-gray-400">
                  Ou use o <strong>Acesso Demo</strong> para teste instantâneo!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative">
      {children}

      {/* Indicadores de status */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        {user.mode === "demo" && (
          <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
            <User className="w-3 h-3" />
            Demo Ativo
          </div>
        )}
        {user.mode === "local" && (
          <div className="bg-cyan-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Local Auth
          </div>
        )}
      </div>

      {/* Botão de logout */}
      <motion.button
        onClick={handleSignOut}
        className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Lock className="w-4 h-4" />
        Sair
      </motion.button>
    </div>
  )
}
