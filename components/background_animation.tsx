"\"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ParallaxBackground } from "./parallax-background"
import { ScrollProgress } from "./scroll-progress"

export function BackgroundAnimation() {
  const { scrollYProgress } = useScroll()

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "200%"])
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "150%"])

  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 720])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -360])
  const rotate3 = useTransform(scrollYProgress, [0, 1], [0, 540])

  return (
    <>
      <ScrollProgress />
      <ParallaxBackground />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Multi-layer Parallax Orbs */}
        <motion.div
          style={{ y: y1, rotate: rotate1 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/8 to-blue-500/8 rounded-full blur-3xl"
        />

        <motion.div
          style={{ y: y2, rotate: rotate2 }}
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/8 to-cyan-500/8 rounded-full blur-3xl"
        />

        <motion.div
          style={{ y: y3, rotate: rotate3 }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-500/8 to-green-500/8 rounded-full blur-3xl"
        />

        {/* 3D Floating Particles with Depth */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              z: [0, Math.cos(i) * 30, 0],
              rotateX: [0, 360, 0],
              rotateY: [0, 180, 0],
              rotateZ: [0, 90, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 8,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transformStyle: "preserve-3d",
              transform: "perspective(1000px)",
            }}
          />
        ))}

        {/* 3D Geometric Shapes with Complex Animations */}
        <motion.div
          animate={{
            rotateX: [0, 360, 0],
            rotateY: [0, 180, 360],
            rotateZ: [0, 90, 180],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 right-1/4 w-20 h-20 border-2 border-cyan-400/15 rounded-lg"
          style={{
            transformStyle: "preserve-3d",
            transform: "perspective(1000px)",
          }}
        />

        <motion.div
          animate={{
            rotateX: [0, -180, -360],
            rotateY: [0, 360, 0],
            rotateZ: [0, -90, -180],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/4 left-1/4 w-16 h-16 border-2 border-purple-400/15"
          style={{
            transformStyle: "preserve-3d",
            transform: "perspective(1000px)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
        />

        <motion.div
          animate={{
            rotateX: [0, 120, 240, 360],
            rotateY: [0, 90, 180, 270, 360],
            rotateZ: [0, 45, 90, 135, 180],
            scale: [1, 0.7, 1.4, 1],
          }}
          transition={{
            duration: 35,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-2/3 right-1/3 w-12 h-12 border-2 border-green-400/15 rounded-full"
          style={{
            transformStyle: "preserve-3d",
            transform: "perspective(1000px)",
          }}
        />

        {/* Depth Layers */}
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], ["0%", "300%"]),
            scale: useTransform(scrollYProgress, [0, 1], [1, 0.5]),
          }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/2 to-transparent"
        />
      </div>
    </>
  )
}
