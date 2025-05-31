"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface WaterDrop {
  id: number
  x: number
  delay: number
  duration: number
  size: number
}

export function WaterEffect() {
  const [drops, setDrops] = useState<WaterDrop[]>([])

  useEffect(() => {
    // Criar gotas de água aleatórias
    const createDrops = () => {
      const newDrops: WaterDrop[] = []
      for (let i = 0; i < 15; i++) {
        newDrops.push({
          id: i,
          x: Math.random() * 100, // posição X em %
          delay: Math.random() * 3, // delay inicial
          duration: 2 + Math.random() * 2, // duração da animação
          size: 2 + Math.random() * 4, // tamanho da gota
        })
      }
      setDrops(newDrops)
    }

    createDrops()
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Efeito de água escorrendo */}
      <div className="absolute inset-0">
        {drops.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute bg-gradient-to-b from-cyan-400/30 to-blue-500/20 rounded-full blur-sm"
            style={{
              left: `${drop.x}%`,
              width: `${drop.size}px`,
              height: `${drop.size * 3}px`,
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: ["0vh", "100vh"],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: drop.duration,
              delay: drop.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Ondas de água no fundo */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cyan-500/10 to-transparent"
          animate={{
            scaleX: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-500/15 to-transparent"
          animate={{
            scaleX: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Respingos de água */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`splash-${i}`}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${60 + Math.random() * 20}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Efeito de brilho na água */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-blue-500/5"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
