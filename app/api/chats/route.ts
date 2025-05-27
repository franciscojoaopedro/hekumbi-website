import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const search = searchParams.get("search")

    let query = supabase
      .from("chats")
      .select(`
        *,
        customers (
          name,
          email,
          phone
        )
      `)
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (priority && priority !== "all") {
      query = query.eq("priority", priority)
    }

    if (search) {
      query = query.or(
        `customers.name.ilike.%${search}%,customers.email.ilike.%${search}%,service_type.ilike.%${search}%`,
      )
    }

    const { data: chats, error } = await query

    if (error) {
      console.error("Erro ao buscar chats:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    // Transformar dados para o formato esperado
    const transformedChats =
      chats?.map((chat) => ({
        id: chat.id,
        customerName: chat.customers?.name || "N/A",
        customerEmail: chat.customers?.email || "N/A",
        customerPhone: chat.customers?.phone || "N/A",
        status: chat.status,
        priority: chat.priority,
        serviceType: chat.service_type || "N/A",
        lastMessage: chat.last_message || "Sem mensagens",
        lastMessageTime: chat.last_message_time,
        unreadCount: chat.unread_count || 0,
        createdAt: chat.created_at,
      })) || []

    return NextResponse.json({
      chats: transformedChats,
      total: transformedChats.length,
    })
  } catch (error) {
    console.error("Erro na API de chats:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { id, status, priority } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    updateData.updated_at = new Date().toISOString()

    const { error } = await supabase.from("chats").update(updateData).eq("id", id)

    if (error) {
      console.error("Erro ao atualizar chat:", error)
      return NextResponse.json({ error: "Erro ao atualizar chat" }, { status: 500 })
    }

    // Log da atividade
    await supabase.from("activities").insert({
      entity_type: "chat",
      entity_id: id,
      action: "updated",
      description: `Chat ${status ? `status alterado para ${status}` : `prioridade alterada para ${priority}`}`,
      metadata: { status, priority },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro na atualização do chat:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
