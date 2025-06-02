"use client"

import { motion, useMotionValue, useSpring, useTransform, type PanInfo } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useMousePosition } from "@/hooks/use-mouse-position"
import { useDeviceOrientation } from "@/hooks/use-device-orientation"
import { useState } from "react"

export function GestureControlledHero() {
  const { x: mouseX, y: mouseY } = useMousePosition()
  const { beta, gamma } = useDeviceOrientation()
  const [isDragging, setIsDragging] = useState(false)

  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)

  const springDragX = useSpring(dragX, { stiffness: 300, damping: 30 })
  const springDragY = useSpring(dragY, { stiffness: 300, damping: 30 })

  // Mouse-based 3D rotation
  const rotateX = useTransform(() => (mouseY - window.innerHeight / 2) / window.innerHeight, [-0.5, 0.5], [10, -10])
  const rotateY = useTransform(() => (mouseX - window.innerWidth / 2) / window.innerWidth, [-0.5, 0.5], [-10, 10])

  // Device orientation for mobile
  const mobileRotateX = useTransform(() => beta, [-90, 90], [15, -15])
  const mobileRotateY = useTransform(() => gamma, [-90, 90], [-15, 15])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    dragX.set(0)
    dragY.set(0)
  }

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    dragX.set(info.offset.x * 0.1)
    dragY.set(info.offset.y * 0.1)
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-20 overflow-hidden">
      {/* Interactive Background Elements */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          rotateX: window.innerWidth > 768 ? rotateX : mobileRotateX,
          rotateY: window.innerWidth > 768 ? rotateY : mobileRotateY,
          transformPerspective: 1000,
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3],
              rotateZ: [0, 360],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="container mx-auto px-4 text-center relative z-10"
        drag
        dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        style={{
          x: springDragX,
          y: springDragY,
          rotateX: window.innerWidth > 768 ? rotateX : mobileRotateX,
          rotateY: window.innerWidth > 768 ? rotateY : mobileRotateY,
          transformPerspective: 1000,
          transformStyle: "preserve-3d",
        }}
        whileDrag={{ scale: 1.02 }}
      >
        <motion.div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight cursor-grab active:cursor-grabbing"
            style={{
              transform: isDragging ? "translateZ(30px)" : "translateZ(0px)",
              transformStyle: "preserve-3d",
            }}
            whileHover={{
              scale: 1.02,
              rotateX: 5,
              transformPerspective: 1000,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              className="inline-block"
              whileHover={{
                rotateY: 10,
                scale: 1.05,
              }}
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
                rotateY: -10,
                scale: 1.1,
                rotateX: 5,
              }}
              transition={{
                textShadow: { duration: 3, repeat: Number.POSITIVE_INFINITY },
                hover: { duration: 0.3 },
              }}
            >
              Limpeza e Higienização
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              whileHover={{
                rotateY: 10,
                scale: 1.05,
              }}
            >
              Profissional
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            style={{
              transform: isDragging ? "translateZ(20px)" : "translateZ(0px)",
              transformStyle: "preserve-3d",
            }}
            whileHover={{
              rotateX: 3,
              scale: 1.02,
            }}
          >
            Comprometidos com excelência e qualidade para o seu negócio. Soluções personalizadas para todos os
            segmentos.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{
              transform: isDragging ? "translateZ(40px)" : "translateZ(0px)",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
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
            className="text-gray-400 mt-12 text-sm tracking-wider uppercase"
            style={{
              transform: isDragging ? "translateZ(10px)" : "translateZ(0px)",
              transformStyle: "preserve-3d",
            }}
            whileHover={{
              rotateX: 3,
              scale: 1.05,
            }}
          >
            Confiado por empresas em todo Angola
          </motion.p>
        </motion.div>

        {/* Drag Indicator */}
        {isDragging && (
          <motion.div
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-cyan-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            🎯 Arraste para explorar em 3D
          </motion.div>
        )}
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ChevronDown className="text-cyan-400 w-8 h-8" />
      </motion.div>
    </section>
  )
}
