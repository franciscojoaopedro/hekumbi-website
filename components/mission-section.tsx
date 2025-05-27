"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Target, Heart, Eye, CheckCircle } from "lucide-react"

export function MissionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const values = [
    "Comprometimento inclusivo para a satisfação do cliente",
    "Gestão participativa e qualificação contínua dos Recursos Humanos",
    "Criatividade para soluções personalizadas",
    "Ética nos procedimentos e relações",
    "Respeito aos princípios e normas constitucionais",
    "Trabalhar com fé, amor, agilidade, honestidade, credibilidade",
    "Determinação, transparência e responsabilidade",
  ]

  return (
    <section id="missao" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Missão e <span className="text-cyan-400">Valores</span>
          </h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-8"></div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Missão */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Target className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Missão</h3>
            <p className="text-gray-300 leading-relaxed">
              Dia-a-dia melhorar nosso atendimento e manter uma comunicação mais assertiva, utilizando todos os recursos
              para suprir as necessidades de nossos clientes de forma rápida, ágil e correta.
            </p>
          </motion.div>

          {/* Valores */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Valores</h3>
            <div className="space-y-3">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 text-left"
                >
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visão */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Eye className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Visão</h3>
            <p className="text-gray-300 leading-relaxed">
              Tornarmos referência na excelência nos Serviços Prestados nas áreas de Limpeza, Higienização e Formação
              Profissional, atendendo as necessidades de nossos clientes com soluções atuais.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
