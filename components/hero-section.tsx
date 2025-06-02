"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useRef } from "react"

export function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <section
      ref={ref}
      id="inicio"
      className="min-h-screen flex items-center justify-center relative pt-20 overflow-hidden"
    >
      {/* Background Video */}
      <motion.div className="absolute inset-0 z-0 overflow-hidden ">
        <video
          autoPlay // Automatically plays the video
          loop     // Loops the video continuously
          muted    // Mutes the video audio
          className="min-w-full min-h-full object-cover opacity-55" 
        >
      
          <source src="/videos/fundo_hekumbi.mp4" type="video/mp4" />
         
          Seu navegador não suporta vídeos em HTML5.
        </video>
        {/* Optional overlay to improve text readability over the video */}
        <motion.div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Existing decorative background elements */}
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "30%"]) }} className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-xl" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full blur-xl" />
      </motion.div>

      {/* Main content of the hero section */}
      <motion.div
        style={{ y, opacity, scale, rotateX, transformPerspective: 1000 }}
        className="container mx-auto px-4 text-center relative z-10"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.span
              whileHover={{
                rotateY: 5,
                rotateX: 5,
                scale: 1.05,
                transformPerspective: 1000,
              }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              Soluções de{" "}
            </motion.span>
            <motion.span
              className="text-cyan-400 inline-block"
              animate={{
                textShadow: [
                  "0 0 10px rgba(34, 211, 238, 0.5)",
                  "0 0 20px rgba(34, 211, 238, 0.8)",
                  "0 0 30px rgba(34, 211, 238, 0.6)",
                  "0 0 20px rgba(34, 211, 238, 0.8)",
                  "0 0 10px rgba(34, 211, 238, 0.5)",
                ],
              }}
              whileHover={{
                rotateY: -5,
                rotateX: 5,
                scale: 1.1,
                transformPerspective: 1000,
              }}
              transition={{
                textShadow: { duration: 3, repeat: Number.POSITIVE_INFINITY },
                hover: { duration: 0.3 },
              }}
            >
              Limpeza e Higienização
            </motion.span>{" "}
            <motion.span
              whileHover={{
                rotateY: 5,
                rotateX: -5,
                scale: 1.05,
                transformPerspective: 1000,
              }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              Profissional
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Comprometidos com excelência e qualidade para o seu negócio. Soluções personalizadas para todos os
            segmentos.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                transformPerspective: 1000,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
              >
                Nossos Serviços →
              </Button>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.05,
                rotateY: -5,
                rotateX: 5,
                transformPerspective: 1000,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 px-8 py-4 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-400/25"
              >
                Entre em Contacto
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-gray-400 mt-12 text-sm tracking-wider uppercase"
            whileHover={{
              rotateX: 3,
              scale: 1.05,
              transformPerspective: 1000,
            }}
          >
            Confiado por empresas em todo Angola
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ChevronDown className="text-cyan-400 w-8 h-8" />
      </motion.div>
    </section>
  )
}
