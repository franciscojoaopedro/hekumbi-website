"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useMousePosition } from "@/hooks/use-mouse-position"
import { useEffect } from "react"

export function MouseFollower() {
  const { x: mouseX, y: mouseY } = useMousePosition()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  useEffect(() => {
    x.set(mouseX - 25)
    y.set(mouseY - 25)
  }, [mouseX, mouseY, x, y])

  return (
    <>
      {/* Main Follower */}
      <motion.div
        className="fixed w-12 h-12 pointer-events-none z-50 mix-blend-difference"
        style={{
          x: springX,
          y: springY,
        }}
      >
        <motion.div
          className="w-full h-full bg-cyan-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Trail Effect */}
      <motion.div
        className="fixed w-6 h-6 pointer-events-none z-40"
        style={{
          x: useSpring(mouseX - 12, { stiffness: 100, damping: 20 }),
          y: useSpring(mouseY - 12, { stiffness: 100, damping: 20 }),
        }}
      >
        <motion.div
          className="w-full h-full bg-cyan-300/50 rounded-full"
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Secondary Trail */}
      <motion.div
        className="fixed w-3 h-3 pointer-events-none z-30"
        style={{
          x: useSpring(mouseX - 6, { stiffness: 50, damping: 25 }),
          y: useSpring(mouseY - 6, { stiffness: 50, damping: 25 }),
        }}
      >
        <motion.div
          className="w-full h-full bg-cyan-200/30 rounded-full"
          animate={{
            scale: [0.6, 1, 0.6],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </>
  )
}
