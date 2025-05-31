"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Calculator, X, CheckCircle, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { Interactive3DCard } from "./interactive-3d-card"
import { supabase } from "@/lib/supabase"

interface QuoteFormData {
  name: string
  email: string
  phone: string
  company: string
  serviceType: string
  propertyType: string
  area: string
  frequency: string
  location: string
  description: string
  urgency: string
}

export function QuoteSystem() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<QuoteFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    propertyType: "",
    area: "",
    frequency: "",
    location: "",
    description: "",
    urgency: "",
  })
  const { haptic } = useHapticFeedback()

  const serviceTypes = [
    { id: "condominio", name: "Condomínio", icon: Building, color: "from-blue-500 to-cyan-500" },
    { id: "hospital", name: "Hospital", icon: Building, color: "from-red-500 to-pink-500" },
    { id: "escola", name: "Escola/Colégio", icon: Building, color: "from-green-500 to-emerald-500" },
    { id: "empresa", name: "Empresa/Escritório", icon: Building, color: "from-purple-500 to-violet-500" },
    { id: "shopping", name: "Shopping/Comercial", icon: Building, color: "from-orange-500 to-red-500" },
    { id: "igreja", name: "Igreja/Templo", icon: Building, color: "from-indigo-500 to-blue-500" },
  ]

  const frequencies = [
    { id: "diaria", name: "Diária", multiplier: 1 },
    { id: "semanal", name: "Semanal", multiplier: 0.7 },
    { id: "quinzenal", name: "Quinzenal", multiplier: 0.6 },
    { id: "mensal", name: "Mensal", multiplier: 0.5 },
    { id: "eventual", name: "Eventual", multiplier: 1.2 },
  ]

  const urgencyLevels = [
    { id: "normal", name: "Normal (7-10 dias)", color: "text-green-400" },
    { id: "urgente", name: "Urgente (3-5 dias)", color: "text-yellow-400" },
    { id: "emergencia", name: "Emergência (24h)", color: "text-red-400" },
  ]

  const handleInputChange = (field: keyof QuoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      haptic("navigation")
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      haptic("navigation")
    }
  }

  const handleSubmit = async () => {
    try {
      haptic("success")

      // 1. Criar ou buscar cliente
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        })
        .select()
        .single()

      if (customerError) {
        console.error("Erro ao criar cliente:", customerError)
        throw customerError
      }

      console.log("✅ Cliente criado:", customer)

      // 2. Criar orçamento
      const quoteNumber = `HEK-${Date.now().toString().slice(-6)}`
      const estimatedValue = calculateEstimate()

      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .insert({
          quote_number: quoteNumber,
          customer_id: customer.id,
          service_type: serviceTypes.find((s) => s.id === formData.serviceType)?.name || formData.serviceType,
          property_type: formData.propertyType,
          area: Number.parseInt(formData.area) || 0,
          frequency: formData.frequency,
          urgency: formData.urgency,
          location: formData.location,
          description: formData.description,
          estimated_value: estimatedValue,
          status: "pending",
          priority: formData.urgency === "emergencia" ? "high" : formData.urgency === "urgente" ? "medium" : "low",
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
        })
        .select()
        .single()

      if (quoteError) {
        console.error("Erro ao criar orçamento:", quoteError)
        throw quoteError
      }

      console.log("✅ Orçamento criado:", quote)

      // 3. Criar atividade
      await supabase.from("activities").insert({
        entity_type: "quote",
        entity_id: quote.id,
        action: "created",
        description: `Novo orçamento solicitado por ${formData.name}`,
        metadata: {
          service_type: formData.serviceType,
          estimated_value: estimatedValue,
          urgency: formData.urgency,
        },
      })

      console.log("✅ Dados salvos no banco com sucesso!")
      setIsSubmitted(true)

      setTimeout(() => {
        setIsOpen(false)
        setIsSubmitted(false)
        setCurrentStep(1)
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          serviceType: "",
          propertyType: "",
          area: "",
          frequency: "",
          location: "",
          description: "",
          urgency: "",
        })
      }, 3000)
    } catch (error) {
      console.error("❌ Erro ao salvar orçamento:", error)
      alert("Erro ao enviar solicitação. Tente novamente.")
    }
  }

  const calculateEstimate = () => {
    const basePrice = 50000 // AOA base price
    const areaMultiplier = Number.parseInt(formData.area) || 100
    const frequencyMultiplier = frequencies.find((f) => f.id === formData.frequency)?.multiplier || 1
    const urgencyMultiplier = formData.urgency === "emergencia" ? 1.5 : formData.urgency === "urgente" ? 1.2 : 1

    return Math.round(basePrice * (areaMultiplier / 100) * frequencyMultiplier * urgencyMultiplier)
  }

  return (
    <>
      {/* Quote Button */}
      <motion.div
        className="fixed bottom-6 right-36 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <motion.button
          onClick={() => {
            setIsOpen(true)
            haptic("button")
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300"
        >
          <Calculator className="w-7 h-7" />
        </motion.button>
      </motion.div>

      {/* Quote Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: -15 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 15 }}
              className="bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              style={{ transformPerspective: 1000 }}
              onClick={(e) => e.stopPropagation()}
            >
              {!isSubmitted ? (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-white text-xl font-bold">Solicitar Orçamento</h2>
                      <p className="text-white/80 text-sm">Passo {currentStep} de 4</p>
                    </div>
                    <motion.button
                      onClick={() => setIsOpen(false)}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white/80 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-slate-700 h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                      initial={{ width: "25%" }}
                      animate={{ width: `${(currentStep / 4) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Form Content */}
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <AnimatePresence mode="wait">
                      {/* Step 1: Personal Info */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="space-y-4"
                        >
                          <h3 className="text-white text-lg font-semibold mb-4">Informações Pessoais</h3>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-gray-300 text-sm mb-2 block">Nome Completo *</label>
                              <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Seu nome completo"
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-gray-300 text-sm mb-2 block">Email *</label>
                              <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="seu@email.com"
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-gray-300 text-sm mb-2 block">Telefone *</label>
                              <Input
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="+244 XXX XXX XXX"
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-gray-300 text-sm mb-2 block">Empresa (opcional)</label>
                              <Input
                                value={formData.company}
                                onChange={(e) => handleInputChange("company", e.target.value)}
                                placeholder="Nome da empresa"
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Service Type */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="space-y-4"
                        >
                          <h3 className="text-white text-lg font-semibold mb-4">Tipo de Serviço</h3>

                          <div className="grid md:grid-cols-2 gap-4">
                            {serviceTypes.map((service) => (
                              <Interactive3DCard key={service.id} intensity={0.5}>
                                <motion.div
                                  onClick={() => {
                                    handleInputChange("serviceType", service.id)
                                    haptic("selection")
                                  }}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    formData.serviceType === service.id
                                      ? "border-purple-500 bg-purple-500/20"
                                      : "border-slate-600 bg-slate-700/50 hover:border-slate-500"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-10 h-10 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center`}
                                    >
                                      <service.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-white font-medium">{service.name}</span>
                                  </div>
                                </motion.div>
                              </Interactive3DCard>
                            ))}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <div>
                              <label className="text-gray-300 text-sm mb-2 block">Área (m²) *</label>
                              <Input
                                type="number"
                                value={formData.area}
                                onChange={(e) => handleInputChange("area", e.target.value)}
                                placeholder="Ex: 500"
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-gray-300 text-sm mb-2 block">Localização *</label>
                              <Input
                                value={formData.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                placeholder="Bairro, Luanda"
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Frequency & Urgency */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="space-y-6"
                        >
                          <h3 className="text-white text-lg font-semibold">Frequência e Urgência</h3>

                          <div>
                            <label className="text-gray-300 text-sm mb-3 block">Frequência do Serviço *</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {frequencies.map((freq) => (
                                <motion.button
                                  key={freq.id}
                                  onClick={() => {
                                    handleInputChange("frequency", freq.id)
                                    haptic("selection")
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    formData.frequency === freq.id
                                      ? "border-purple-500 bg-purple-500/20 text-white"
                                      : "border-slate-600 bg-slate-700/50 text-gray-300 hover:border-slate-500"
                                  }`}
                                >
                                  <div className="text-sm font-medium">{freq.name}</div>
                                  <div className="text-xs opacity-70">
                                    {freq.multiplier < 1
                                      ? `${Math.round((1 - freq.multiplier) * 100)}% desconto`
                                      : freq.multiplier > 1
                                        ? `+${Math.round((freq.multiplier - 1) * 100)}%`
                                        : "Preço base"}
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-gray-300 text-sm mb-3 block">Urgência *</label>
                            <div className="space-y-2">
                              {urgencyLevels.map((urgency) => (
                                <motion.button
                                  key={urgency.id}
                                  onClick={() => {
                                    handleInputChange("urgency", urgency.id)
                                    haptic("selection")
                                  }}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                                    formData.urgency === urgency.id
                                      ? "border-purple-500 bg-purple-500/20"
                                      : "border-slate-600 bg-slate-700/50 hover:border-slate-500"
                                  }`}
                                >
                                  <span className={urgency.color}>{urgency.name}</span>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 4: Description & Review */}
                      {currentStep === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="space-y-6"
                        >
                          <h3 className="text-white text-lg font-semibold">Detalhes e Revisão</h3>

                          <div>
                            <label className="text-gray-300 text-sm mb-2 block">Descrição Adicional</label>
                            <Textarea
                              value={formData.description}
                              onChange={(e) => handleInputChange("description", e.target.value)}
                              placeholder="Descreva detalhes específicos do serviço..."
                              rows={4}
                              className="bg-slate-700 border-slate-600 text-white resize-none"
                            />
                          </div>

                          {/* Estimate */}
                          <Interactive3DCard intensity={0.8}>
                            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4">
                              <h4 className="text-white font-semibold mb-2">Estimativa Preliminar</h4>
                              <div className="text-2xl font-bold text-purple-400">
                                {calculateEstimate().toLocaleString()} AOA
                              </div>
                              <p className="text-gray-400 text-sm mt-1">
                                *Valor estimado. Orçamento final após avaliação técnica.
                              </p>
                            </div>
                          </Interactive3DCard>

                          {/* Summary */}
                          <div className="bg-slate-700/50 rounded-xl p-4">
                            <h4 className="text-white font-semibold mb-3">Resumo do Pedido</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Serviço:</span>
                                <span className="text-white">
                                  {serviceTypes.find((s) => s.id === formData.serviceType)?.name}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Área:</span>
                                <span className="text-white">{formData.area} m²</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Frequência:</span>
                                <span className="text-white">
                                  {frequencies.find((f) => f.id === formData.frequency)?.name}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Urgência:</span>
                                <span className="text-white">
                                  {urgencyLevels.find((u) => u.id === formData.urgency)?.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-slate-700 flex justify-between">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      disabled={currentStep === 1}
                      className="border-slate-600 text-gray-300 hover:bg-slate-700"
                    >
                      Anterior
                    </Button>

                    {currentStep < 4 ? (
                      <Button
                        onClick={nextStep}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        Próximo
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        Enviar Solicitação
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 1 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-white text-xl font-bold mb-4">Solicitação Enviada!</h3>
                  <p className="text-gray-300 mb-6">
                    Recebemos sua solicitação de orçamento. Nossa equipe entrará em contato em até 24 horas.
                  </p>

                  <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-400 mb-2">Número do protocolo:</p>
                    <p className="text-cyan-400 font-mono text-lg">HEK-{Date.now().toString().slice(-6)}</p>
                  </div>

                  <p className="text-gray-400 text-sm">Você receberá uma confirmação por email em breve.</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
