"use client"

import { useState } from "react"
import { AdminDashboardDynamic } from "@/components/admin-dashboard-dynamic"
import { AuthGuard } from "@/components/auth-guard"

export default function AdminPageClient() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <AuthGuard>
      <AdminDashboardDynamic activeTab={activeTab} setActiveTab={setActiveTab} />
    </AuthGuard>
  )
}
