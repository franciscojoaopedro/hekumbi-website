"use client"

import { motion, type PanInfo, useMotionValue, useTransform } from "framer-motion"
import { useState, type ReactNode } from "react"

interface SwipeNavigationProps {
  children: ReactNode[]
  className?: string
}

export function SwipeNavigation({ children, className = "" }: SwipeNavigationProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8])
  const rotateY = useTransform(x, [-200, 0, 200], [-25, 0, 25])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    const velocity = info.velocity.x

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      } else if (info.offset.x < 0 && currentIndex < children.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    }

    x.set(0)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{
          x,
          opacity,
          scale,
          rotateY,
          transformPerspective: 1000,
          transformStyle: "preserve-3d",
        }}
        animate={{
          x: -currentIndex * 100 + "%",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {children.map((child, index) => (
          <motion.div
            key={index}
            className="w-full flex-shrink-0"
            style={{
              transformStyle: "preserve-3d",
            }}
            animate={{
              rotateY: index === currentIndex ? 0 : index < currentIndex ? -15 : 15,
              z: index === currentIndex ? 0 : -50,
            }}
            transition={{ duration: 0.5 }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {children.map((_, index) => (
          <motion.button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-cyan-400" : "bg-gray-600"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Swipe Indicators */}
      <motion.div
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400/50"
        animate={{ x: [-5, 5, -5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        ←
      </motion.div>
      <motion.div
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400/50"
        animate={{ x: [5, -5, 5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        →
      </motion.div>
    </div>
  )
}
