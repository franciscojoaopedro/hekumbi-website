"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const contactInfo = [
    {
      icon: MapPin,
      title: "Endereço",
      content: "Rua direita do Shopping Talatona, casa n.º 92, Talatona, Luanda",
    },
    {
      icon: Phone,
      title: "Telefone",
      content: "+244 972 620 967",
    },
    {
      icon: Mail,
      title: "Email",
      content: "contacto@hekumbi.co.ao",
    },
    {
      icon: Clock,
      title: "Horário",
      content: "Segunda - Sexta: 8:00 - 18:00",
    },
  ]

  return (
    <section id="contacto" className="py-20 bg-slate-800/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Entre em <span className="text-cyan-400">Contacto</span>
          </h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Estamos prontos para atender suas necessidades. Fale conosco!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-cyan-400 mb-8">Informações de Contacto</h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <info.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{info.title}</h4>
                    <p className="text-gray-300">{info.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700"
          >
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">Envie uma Mensagem</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Input
                    placeholder="Seu Nome"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-400"
                  />
                </motion.div>
                <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Input
                    type="email"
                    placeholder="Seu Email"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-400"
                  />
                </motion.div>
              </div>
              <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Input
                  placeholder="Assunto"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-400"
                />
              </motion.div>
              <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Textarea
                  placeholder="Sua Mensagem"
                  rows={5}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-400 resize-none"
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 text-lg rounded-full transition-all duration-300"
                >
                  Enviar Mensagem
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
