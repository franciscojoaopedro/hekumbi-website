"use client"

import type React from "react"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import type { ReactNode } from "react"

interface Interactive3DCardProps {
  children: ReactNode
  className?: string
  intensity?: number
}

export function Interactive3DCard({ children, className = "", intensity = 1 }: Interactive3DCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15 * intensity, -15 * intensity])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15 * intensity, 15 * intensity])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const touch = e.touches[0]
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const touchX = touch.clientX - rect.left
    const touchY = touch.clientY - rect.top

    const xPct = touchX / width - 0.5
    const yPct = touchY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      style={{
        rotateY: rotateY,
        rotateX: rotateX,
        transformStyle: "preserve-3d",
      }}
      animate={{
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{
        scale: { duration: 0.2 },
      }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          transform: isHovered ? "translateZ(50px)" : "translateZ(0px)",
          transformStyle: "preserve-3d",
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>

      {/* 3D Shadow */}
      <motion.div
        className="absolute inset-0 bg-black/20 rounded-2xl blur-xl"
        style={{
          transform: isHovered ? "translateZ(-50px) scale(0.9)" : "translateZ(-10px) scale(0.95)",
          transformStyle: "preserve-3d",
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
}
