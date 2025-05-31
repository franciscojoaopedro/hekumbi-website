"use client"

import { useSupabaseAdmin } from "@/contexts/supabase-admin-context"
import { useState, useEffect } from "react"

export function useAdminSafe() {
  const [isContextAvailable, setIsContextAvailable] = useState(false)
  const [adminContext, setAdminContext] = useState<any>(null)

  useEffect(() => {
    let context: any = null
    try {
      context = useSupabaseAdmin()
      setAdminContext(context)
      setIsContextAvailable(true)
    } catch (error) {
      console.warn("Admin context not available:", error)
      setIsContextAvailable(false)
      setAdminContext(null)
    }
  }, [])

  return {
    isContextAvailable,
    adminContext,
  }
}
