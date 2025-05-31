"use client"

import { SupabaseAdminProvider } from "@/contexts/supabase-admin-context"
import type { ReactNode } from "react"

interface AdminWrapperProps {
  children: ReactNode
}

export function AdminWrapper({ children }: AdminWrapperProps) {
  return <SupabaseAdminProvider>{children}</SupabaseAdminProvider>
}
