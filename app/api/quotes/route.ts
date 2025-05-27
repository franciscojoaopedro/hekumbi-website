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
      .from("quotes")
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
      query = query.or(`quote_number.ilike.%${search}%,customers.name.ilike.%${search}%,service_type.ilike.%${search}%`)
    }

    const { data: quotes, error } = await query

    if (error) {
      console.error("Erro ao buscar orçamentos:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    // Transformar dados para o formato esperado
    const transformedQuotes =
      quotes?.map((quote) => ({
        id: quote.id,
        quoteNumber: quote.quote_number,
        customerName: quote.customers?.name || "N/A",
        customerEmail: quote.customers?.email || "N/A",
        customerPhone: quote.customers?.phone || "N/A",
        serviceType: quote.service_type,
        description: quote.description || "Sem descrição",
        status: quote.status,
        priority: quote.priority,
        value: quote.estimated_value || 0,
        validUntil: quote.valid_until,
        createdAt: quote.created_at,
      })) || []

    return NextResponse.json({
      quotes: transformedQuotes,
      total: transformedQuotes.length,
    })
  } catch (error) {
    console.error("Erro na API de orçamentos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { id, status, priority, estimated_value } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (estimated_value) updateData.estimated_value = estimated_value
    updateData.updated_at = new Date().toISOString()

    const { error } = await supabase.from("quotes").update(updateData).eq("id", id)

    if (error) {
      console.error("Erro ao atualizar orçamento:", error)
      return NextResponse.json({ error: "Erro ao atualizar orçamento" }, { status: 500 })
    }

    // Log da atividade
    await supabase.from("activities").insert({
      entity_type: "quote",
      entity_id: id,
      action: "updated",
      description: `Orçamento ${status ? `status alterado para ${status}` : `atualizado`}`,
      metadata: { status, priority, estimated_value },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro na atualização do orçamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
