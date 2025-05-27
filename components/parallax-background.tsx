"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function ParallaxBackground() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "75%"])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -180])

  return (
    <div ref={ref} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer 1 - Fastest */}
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
      />

      {/* Layer 2 - Medium */}
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl"
      />

      {/* Layer 3 - Slow */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-green-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
      />

      {/* 3D Floating Elements */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 20, 0],
            rotateX: [0, 360, 0],
            rotateY: [0, 180, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
          className="absolute w-2 h-2 bg-cyan-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transformStyle: "preserve-3d",
          }}
        />
      ))}

      {/* 3D Geometric Shapes */}
      <motion.div
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 180],
          rotateZ: [0, 90],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute top-1/3 right-1/3 w-16 h-16 border border-cyan-400/20"
        style={{
          transformStyle: "preserve-3d",
          transform: "perspective(1000px)",
        }}
      />

      <motion.div
        animate={{
          rotateX: [0, -360],
          rotateY: [0, 360],
          rotateZ: [0, -180],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute bottom-1/3 left-1/3 w-12 h-12 border border-purple-400/20 rounded-full"
        style={{
          transformStyle: "preserve-3d",
          transform: "perspective(1000px)",
        }}
      />
    </div>
  )
}
