import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SupabaseAdminProvider } from "@/contexts/supabase-admin-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HEKUMBI - Serviços de Limpeza e Higienização",
  description: "Empresa especializada em limpeza residencial, comercial e higienização em Angola",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <SupabaseAdminProvider>{children}</SupabaseAdminProvider>
      </body>
    </html>
  )
}
