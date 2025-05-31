export function checkEnvironmentVariables() {
  const requiredVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  const optionalVars = {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  console.log("🔍 Verificando variáveis de ambiente...")

  // Verificar variáveis obrigatórias
  for (const [name, value] of Object.entries(requiredVars)) {
    if (!value) {
      console.error(`❌ Variável obrigatória ${name} não encontrada`)
      return false
    } else {
      console.log(`✅ ${name}: ${value.substring(0, 20)}...`)
    }
  }

  // Verificar variáveis opcionais
  for (const [name, value] of Object.entries(optionalVars)) {
    if (!value) {
      console.warn(`⚠️ Variável opcional ${name} não encontrada`)
    } else {
      console.log(`✅ ${name}: Configurada`)
    }
  }

  return true
}

// Executar verificação
if (typeof window === "undefined") {
  // Apenas no servidor
  checkEnvironmentVariables()
}
