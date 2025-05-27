"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Building2, Users, Award, Target } from "lucide-react"

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  const stats = [
    { icon: Building2, label: "Anos de Experiência", value: "2+" },
    { icon: Users, label: "Clientes Satisfeitos", value: "100+" },
    { icon: Award, label: "Projetos Concluídos", value: "500+" },
    { icon: Target, label: "Segmentos Atendidos", value: "8+" },
  ]

  return (
    <section id="sobre" className="py-20 relative overflow-hidden">
      {/* Parallax Background Elements */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "50%"]) }}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl" />
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
            Sobre a <span className="text-cyan-400">HEKUMBI</span>
          </motion.h2>
          <motion.div className="w-24 h-1 bg-cyan-400 mx-auto mb-8" whileHover={{ scaleX: 1.5, rotateZ: 5 }} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            style={{ y, rotateX, transformPerspective: 1000 }}
            initial={{ opacity: 0, x: -50, rotateY: -15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: -50, rotateY: -15 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{
              rotateY: 5,
              rotateX: 5,
              scale: 1.02,
              transformPerspective: 1000,
            }}
            className="bg-slate-800/30 backdrop-blur-sm p-8 rounded-2xl border border-slate-700"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-400">Nossa História</h3>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <motion.p whileHover={{ x: 10, rotateX: 2 }} transition={{ duration: 0.3 }}>
                A HEKUMBI – COMÉRCIO GERAL E SERVIÇOS, (SU) LDA, é uma empresa de matriz angolana, com sede na Província
                de Luanda, Município de Talatona, criada em Março de 2022.
              </motion.p>
              <motion.p whileHover={{ x: 10, rotateX: 2 }} transition={{ duration: 0.3 }}>
                Nossa empresa está preparada para oferecer a todos os clientes soluções adequadas e com excelente
                relação de custo-benefício, prezando pela excelência em todos os serviços de Limpeza e Higienização.
              </motion.p>
              <motion.p whileHover={{ x: 10, rotateX: 2 }} transition={{ duration: 0.3 }}>
                Somos especializados em soluções eficientes para Condomínios, Colégios, Empresas, Escritórios, Locais
                Comerciais, Shoppings, Hospitais e Igrejas.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]), scale }}
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 50, rotateY: 15 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
            style={{ transformPerspective: 1000 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
                animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : { opacity: 0, scale: 0.8, rotateX: 45 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{
                  scale: 1.1,
                  rotateY: 10,
                  rotateX: 10,
                  z: 50,
                  transformPerspective: 1000,
                }}
                className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 text-center relative overflow-hidden group"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* 3D Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ transform: "translateZ(-10px)" }}
                />

                <motion.div
                  animate={{
                    rotateY: 360,
                    rotateX: [0, 10, 0],
                  }}
                  transition={{
                    rotateY: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    rotateX: { duration: 4, repeat: Number.POSITIVE_INFINITY },
                  }}
                  className="inline-block mb-4 relative z-10"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <stat.icon className="w-8 h-8 text-cyan-400" />
                </motion.div>
                <motion.div
                  className="text-2xl font-bold text-white mb-2 relative z-10"
                  whileHover={{ scale: 1.1, rotateX: 5 }}
                >
                  {stat.value}
                </motion.div>
                <motion.div className="text-gray-400 text-sm relative z-10" whileHover={{ scale: 1.05, rotateX: 5 }}>
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
