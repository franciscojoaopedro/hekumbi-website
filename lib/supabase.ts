import { createClient } from "@supabase/supabase-js"

// Verificar se as variáveis de ambiente estão disponíveis
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validação das variáveis de ambiente
if (!supabaseUrl) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL não encontrada")
  throw new Error("NEXT_PUBLIC_SUPABASE_URL é obrigatória")
}

if (!supabaseAnonKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrada")
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY é obrigatória")
}

console.log("✅ Supabase URL:", supabaseUrl)
console.log("✅ Supabase Anon Key:", supabaseAnonKey ? "Configurada" : "Não encontrada")
console.log("✅ Supabase Service Key:", supabaseServiceKey ? "Configurada" : "Não encontrada")

// Cliente público (para frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

// Cliente administrativo (para backend/server)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  : supabase // Fallback para o cliente público se não tiver service key

// Server-side client
export const createServerClient = () => {
  if (supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  }
  return supabase // Fallback
}

// Tipos TypeScript baseados no schema
export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Chat {
  id: string
  customer_id: string
  status: "active" | "pending" | "closed"
  priority: "low" | "medium" | "high"
  service_type?: string
  last_message?: string
  last_message_time: string
  unread_count: number
  created_at: string
  updated_at: string
  customer?: Customer
  messages?: Message[]
}

export interface Message {
  id: string
  chat_id: string
  sender: "customer" | "admin" | "bot"
  content: string
  message_type: "text" | "image" | "file"
  created_at: string
}

export interface Quote {
  id: string
  quote_number: string
  customer_id: string
  chat_id?: string
  service_type: string
  property_type?: string
  area?: number
  frequency?: string
  urgency: "low" | "normal" | "high" | "urgent"
  location?: string
  description?: string
  estimated_value?: number
  status: "pending" | "sent" | "approved" | "rejected" | "expired"
  priority: "low" | "medium" | "high"
  valid_until?: string
  created_at: string
  updated_at: string
  customer?: Customer
}

export interface Activity {
  id: string
  entity_type: "chat" | "quote" | "customer"
  entity_id: string
  action: string
  description?: string
  metadata?: any
  created_at: string
}

// Função para testar conexão
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("customers").select("count").limit(1)

    if (error) {
      console.error("❌ Erro na conexão Supabase:", error)
      return false
    }

    console.log("✅ Conexão Supabase funcionando!")
    return true
  } catch (err) {
    console.error("❌ Erro ao testar conexão:", err)
    return false
  }
}
