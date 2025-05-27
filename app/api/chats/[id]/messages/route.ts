import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", params.id)
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ messages: messages || [] })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { content, sender = "admin", messageType = "text" } = body

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        chat_id: params.id,
        sender,
        content,
        message_type: messageType,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Atualizar última mensagem do chat
    await supabase
      .from("chats")
      .update({
        last_message: content,
        last_message_time: new Date().toISOString(),
        unread_count: sender === "customer" ? 1 : 0,
      })
      .eq("id", params.id)

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
