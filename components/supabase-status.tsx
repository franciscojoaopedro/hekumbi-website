"use client"

import { useEffect, useState } from "react"
import { testSupabaseConnection } from "@/lib/supabase"

export function SupabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkConnection() {
      setIsLoading(true)
      try {
        const connected = await testSupabaseConnection()
        setIsConnected(connected)
      } catch (error) {
        console.error("Erro ao verificar conexão:", error)
        setIsConnected(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [])

  if (isLoading) {
    return (
      <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-lg text-sm">
        🔄 Verificando conexão...
      </div>
    )
  }

  if (isConnected === false) {
    return (
      <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm">
        ❌ Erro na conexão Supabase
      </div>
    )
  }

  if (isConnected === true) {
    return (
      <div className="fixed bottom-4 left-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-lg text-sm">
        ✅ Supabase conectado
      </div>
    )
  }

  return null
}
