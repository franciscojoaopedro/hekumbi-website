import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Buscar estatísticas de chats
    const { data: chatStats } = await supabase.from("chats").select("status")

    const totalChats = chatStats?.length || 0
    const activeChats = chatStats?.filter((c) => c.status === "active").length || 0

    // Buscar estatísticas de orçamentos
    const { data: quoteStats } = await supabase.from("quotes").select("status, estimated_value")

    const totalQuotes = quoteStats?.length || 0
    const pendingQuotes = quoteStats?.filter((q) => q.status === "pending").length || 0
    const approvedQuotes = quoteStats?.filter((q) => q.status === "approved").length || 0
    const totalRevenue = quoteStats?.reduce((sum, q) => sum + (q.estimated_value || 0), 0) || 0
    const monthlyRevenue = totalRevenue * 0.3 // Simulação

    // Buscar atividades recentes
    const { data: activities } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    const recentActivity =
      activities?.map((activity) => ({
        id: activity.id,
        type: activity.entity_type,
        description: activity.description,
        timestamp: activity.created_at,
      })) || []

    const analytics = {
      overview: {
        totalChats,
        activeChats,
        totalQuotes,
        pendingQuotes,
        approvedQuotes,
        totalRevenue,
        monthlyRevenue,
        conversionRate: totalChats > 0 ? Math.round((totalQuotes / totalChats) * 100) : 0,
        customerSatisfaction: 4.5,
      },
      recentActivity,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Erro na API de analytics:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
