"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* 3D Progress Indicator */}
      <motion.div
        className="fixed top-4 right-4 w-16 h-16 z-50"
        style={{
          transformPerspective: 1000,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="w-full h-full border-2 border-cyan-400/30 rounded-full relative"
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 180, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <motion.div
            className="absolute inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            style={{
              scale: scrollYProgress,
              opacity: scrollYProgress,
            }}
          />
          <motion.div
            className="absolute inset-0 border border-cyan-400 rounded-full"
            style={{
              rotate: useSpring(scrollYProgress.get() * 360, { stiffness: 100, damping: 30 }),
            }}
          />
        </motion.div>
      </motion.div>
    </>
  )
}
