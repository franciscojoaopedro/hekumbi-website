"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react"
import { Interactive3DCard } from "./interactive-3d-card"
import { Button } from "@/components/ui/button"

export function LocationSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["30px", "-30px"])

  const contactInfo = [
    {
      icon: MapPin,
      title: "Endereço",
      content: "Rua direita do Shopping Talatona, casa n.º 92",
      detail: "Bairro Talatona, Luanda - Angola",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Phone,
      title: "Telefone",
      content: "+244 972 620 967",
      detail: "Disponível 24/7 para emergências",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Mail,
      title: "Email",
      content: "contacto@hekumbi.ao",
      detail: "Resposta em até 24 horas",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Clock,
      title: "Horário",
      content: "Segunda - Sexta: 8:00 - 18:00",
      detail: "Sábado: 8:00 - 12:00",
      color: "from-purple-500 to-violet-500",
    },
  ]

  return (
    <section id="localizacao" className="py-20 relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "20%"]) }} className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50, rotateX: 15 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 15 }}
          transition={{ duration: 0.8 }}
          style={{ transformPerspective: 1000 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            whileHover={{
              rotateY: 5,
              scale: 1.05,
              transformPerspective: 1000,
            }}
          >
            Nossa <span className="text-cyan-400">Localização</span>
          </motion.h2>
          <motion.div className="w-24 h-1 bg-cyan-400 mx-auto mb-8" whileHover={{ scaleX: 1.5, rotateZ: 5 }} />
          <motion.p className="text-xl text-gray-300 max-w-3xl mx-auto" whileHover={{ rotateX: 2, scale: 1.02 }}>
            Encontre-nos facilmente em Luanda, Angola
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <motion.div style={{ y, transformPerspective: 1000 }} className="space-y-6">
            <motion.h3 className="text-2xl font-bold text-cyan-400 mb-8" whileHover={{ rotateX: 5, scale: 1.02 }}>
              Informações de Contacto
            </motion.h3>

            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, x: -50, rotateY: -15 }}
                animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: -50, rotateY: -15 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Interactive3DCard intensity={0.8} className="w-full">
                  <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 group">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                        whileHover={{
                          rotateY: 180,
                          scale: 1.1,
                        }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <info.icon className="w-6 h-6 text-white" />
                      </motion.div>

                      <div className="flex-1">
                        <motion.h4
                          className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors"
                          whileHover={{ rotateX: 3, scale: 1.02 }}
                        >
                          {info.title}
                        </motion.h4>
                        <motion.p className="text-gray-300 mb-1" whileHover={{ rotateX: 2, scale: 1.01 }}>
                          {info.content}
                        </motion.p>
                        <motion.p className="text-gray-400 text-sm" whileHover={{ rotateX: 2, scale: 1.01 }}>
                          {info.detail}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </Interactive3DCard>
              </motion.div>
            ))}

            {/* Directions Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-4"
            >
              <motion.div whileHover={{ scale: 1.05, rotateY: 5 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                  onClick={() => window.open("https://maps.google.com/?q=Shopping+Talatona,+Luanda,+Angola", "_blank")}
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Como Chegar
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 50, rotateY: 15 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ transformPerspective: 1000 }}
          >
            <Interactive3DCard intensity={1} className="w-full h-full">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden group">
                <div className="relative aspect-video">
                  {/* Map Placeholder - Em produção, usar Google Maps ou Mapbox */}
                  <motion.div
                    className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Animated Map Elements */}
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      style={{
                        backgroundImage: "radial-gradient(circle, #22d3ee 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />

                    {/* Location Pin */}
                    <motion.div
                      className="relative z-10"
                      animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <MapPin className="w-12 h-12 text-red-500" />

                      <motion.div
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500/30 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0.1, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />

                    </motion.div>

                    {/* Location Label */}
                    <motion.div
                      className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm px-3 py-2 rounded-lg"
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                    >
                      <p className="text-white text-sm font-semibold">HEKUMBI</p>
                      <p className="text-cyan-400 text-xs">Shopping Talatona</p>
                    </motion.div>
                  </motion.div>

                  {/* Interactive Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    <motion.button
                      className="bg-cyan-500/80 backdrop-blur-sm px-4 py-2 rounded-full text-white font-semibold"
                      whileHover={{ scale: 1.1, rotateZ: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        window.open("https://maps.app.goo.gl/bab6hLqvSWXEbQfH6", "_blank")
                      }
                    >
                      Ver no Google Maps
                    </motion.button>
                  </motion.div>
                </div>

                {/* Map Info */}
                <div className="p-6">
                  <motion.h4
                    className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors"
                    whileHover={{ rotateX: 3, scale: 1.02 }}
                  >
                    Localização Estratégica
                  </motion.h4>
                  <motion.p className="text-gray-300 text-sm leading-relaxed" whileHover={{ rotateX: 2, scale: 1.01 }}>
                    Estamos localizados em frente ao Shopping Talatona, uma das áreas mais movimentadas de Luanda,
                    facilitando o acesso para nossos clientes.
                  </motion.p>
                </div>
              </div>
            </Interactive3DCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
