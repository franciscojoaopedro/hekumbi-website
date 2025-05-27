"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Sparkles, Building, GraduationCap, ShoppingBag, Hospital, Church, Users } from "lucide-react"
import { Interactive3DCard } from "./interactive-3d-card"
import { SwipeNavigation } from "./swipe-navigation"

export function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10])

  const services = [
    {
      icon: Building,
      title: "Condomínios",
      description: "Limpeza completa de áreas comuns, garagens e fachadas",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: GraduationCap,
      title: "Colégios",
      description: "Higienização de salas de aula, laboratórios e áreas recreativas",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      title: "Empresas",
      description: "Serviços de limpeza para escritórios e ambientes corporativos",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: ShoppingBag,
      title: "Shoppings",
      description: "Manutenção e limpeza de centros comerciais e lojas",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Hospital,
      title: "Hospitais",
      description: "Higienização hospitalar com protocolos rigorosos de segurança",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Church,
      title: "Igrejas",
      description: "Limpeza respeitosa de templos e espaços religiosos",
      color: "from-indigo-500 to-blue-500",
    },
  ]

  // Group services for mobile swipe navigation
  const serviceGroups = []
  for (let i = 0; i < services.length; i += 2) {
    serviceGroups.push(services.slice(i, i + 2))
  }

  return (
    <section id="servicos" className="py-20 bg-slate-800/30 relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "30%"]) }} className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl" />
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
            Nossos <span className="text-cyan-400">Serviços</span>
          </motion.h2>
          <motion.div className="w-24 h-1 bg-cyan-400 mx-auto mb-8" whileHover={{ scaleX: 1.5, rotateZ: 5 }} />
          <motion.p className="text-xl text-gray-300 max-w-3xl mx-auto" whileHover={{ rotateX: 2, scale: 1.02 }}>
            Oferecemos soluções personalizadas de limpeza e higienização para diversos segmentos
          </motion.p>
        </motion.div>

        {/* Desktop Grid */}
        <motion.div
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ y, rotateX, transformPerspective: 1000 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 45 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Interactive3DCard intensity={1.5} className="h-full">
                <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 h-full transition-all duration-300 group-hover:border-cyan-400/50 relative overflow-hidden">
                  {/* 3D Background Glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ transform: "translateZ(-20px)" }}
                  />

                  <motion.div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-6 relative z-10`}
                    whileHover={{
                      rotateY: 180,
                      rotateX: 20,
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.div
                      style={{ transform: "rotateY(180deg)" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <service.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.h3
                    className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors relative z-10"
                    whileHover={{ rotateX: 5, scale: 1.05 }}
                  >
                    {service.title}
                  </motion.h3>

                  <motion.p
                    className="text-gray-300 leading-relaxed relative z-10"
                    whileHover={{ rotateX: 3, scale: 1.02 }}
                  >
                    {service.description}
                  </motion.p>

                  {/* Floating Sparkles */}
                  <motion.div
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity relative z-10"
                    animate={{
                      rotate: 360,
                      y: [0, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                      y: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                      scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                    }}
                  >
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </motion.div>

                  {/* 3D Border Effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/30 rounded-2xl"
                    style={{ transform: "translateZ(10px)" }}
                  />
                </div>
              </Interactive3DCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Swipe Navigation */}
        <div className="md:hidden">
          <SwipeNavigation>
            {serviceGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="grid grid-cols-1 gap-6 px-4">
                {group.map((service, index) => (
                  <Interactive3DCard key={service.title} intensity={1} className="w-full">
                    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 transition-all duration-300">
                      <motion.div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mb-4`}
                        whileHover={{ rotateY: 180, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <service.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{service.description}</p>
                    </div>
                  </Interactive3DCard>
                ))}
              </div>
            ))}
          </SwipeNavigation>
        </div>
      </div>
    </section>
  )
}
