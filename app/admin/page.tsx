import type { Metadata } from "next"
import AdminPageClient from "./AdminPageClient"

export const metadata: Metadata = {
  title: "Admin Dashboard - HEKUMBI",
  description: "Painel administrativo HEKUMBI",
}

export default function AdminPage() {
  return <AdminPageClient />
}
