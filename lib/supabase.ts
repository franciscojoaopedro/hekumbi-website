import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client
export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
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
