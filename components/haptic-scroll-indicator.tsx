"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useEffect, useState } from "react"

export function HapticScrollIndicator() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const { haptic } = useHapticFeedback()
  const [lastProgress, setLastProgress] = useState(0)

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      // Trigger haptic feedback at 25%, 50%, 75%, and 100%
      const milestones = [0.25, 0.5, 0.75, 1]

      for (const milestone of milestones) {
        if (lastProgress < milestone && latest >= milestone) {
          haptic("light")
          break
        }
      }

      setLastProgress(latest)
    })

    return () => unsubscribe()
  }, [scrollYProgress, lastProgress, haptic])

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Milestone Indicators */}
      <div className="fixed top-1 left-0 right-0 z-50 flex justify-between px-4">
        {[0.25, 0.5, 0.75, 1].map((milestone, index) => (
          <motion.div
            key={milestone}
            className="w-2 h-2 rounded-full bg-cyan-400/30"
            animate={{
              scale: scrollYProgress.get() >= milestone ? 1.5 : 1,
              backgroundColor: scrollYProgress.get() >= milestone ? "#22d3ee" : "rgba(34, 211, 238, 0.3)",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Scroll Percentage */}
      <motion.div
        className="fixed top-4 right-4 w-16 h-16 z-50"
        style={{
          transformPerspective: 1000,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="w-full h-full border-2 border-cyan-400/30 rounded-full relative flex items-center justify-center"
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
            className="text-white text-xs font-bold relative z-10"
            style={{
              opacity: useSpring(scrollYProgress, { stiffness: 100, damping: 30 }),
            }}
          >
            {Math.round(scrollYProgress.get() * 100)}%
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}
