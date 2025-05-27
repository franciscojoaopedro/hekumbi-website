"use client"

import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { useState, useRef, useEffect } from "react"

interface PinchZoomGalleryProps {
  images: string[]
  className?: string
}

export function PinchZoomGallery({ images, className = "" }: PinchZoomGalleryProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const constraintsRef = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateValue = useMotionValue(0)
  const scaleValue = useMotionValue(1)

  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handlePinch = (event: any) => {
    if (event.touches && event.touches.length === 2) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2),
      )

      // Simple pinch-to-zoom logic
      const newScale = Math.max(0.5, Math.min(3, distance / 200))
      setScale(newScale)
      scaleValue.set(newScale)
    }
  }

  const handleRotate = (event: any, info: PanInfo) => {
    if (event.touches && event.touches.length === 2) {
      const newRotation = rotation + info.delta.x * 0.5
      setRotation(newRotation)
      rotateValue.set(newRotation)
    }
  }

  useEffect(() => {
    const element = constraintsRef.current
    if (element) {
      // @ts-ignore
      element.addEventListener("touchmove", handlePinch)
      return () => {
        // @ts-ignore
        element.removeEventListener("touchmove", handlePinch)
      }
    }
  }, [])

  return (
    <div ref={constraintsRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4"
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        onDrag={handleRotate}
        style={{
          x,
          y,
          scale: scaleValue,
          rotate: rotateValue,
          rotateX,
          rotateY,
          transformPerspective: 1000,
          transformStyle: "preserve-3d",
        }}
        whileDrag={{ cursor: "grabbing" }}
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="relative aspect-square bg-slate-800 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
            whileHover={{
              scale: 1.05,
              rotateY: 5,
              rotateX: 5,
              z: 20,
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              transformStyle: "preserve-3d",
            }}
            animate={{
              rotateY: [0, 2, 0, -2, 0],
              rotateX: [0, 1, 0, -1, 0],
            }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <motion.img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
              style={{
                transform: "translateZ(10px)",
              }}
            />

            {/* 3D Frame Effect */}
            <motion.div
              className="absolute inset-0 border-2 border-cyan-400/30 rounded-lg"
              style={{
                transform: "translateZ(15px)",
              }}
              animate={{
                borderColor: ["rgba(34, 211, 238, 0.3)", "rgba(34, 211, 238, 0.6)", "rgba(34, 211, 238, 0.3)"],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.2,
              }}
            />

            {/* Reflection Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-lg"
              style={{
                transform: "translateZ(20px)",
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Gesture Instructions */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-cyan-400/70 text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div>📱 Pinch to zoom • 🖱️ Drag to move • 🔄 Two fingers to rotate</div>
      </motion.div>

      {/* Scale Indicator */}
      <motion.div
        className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-full text-cyan-400 text-sm"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
      >
        {Math.round(scale * 100)}%
      </motion.div>
    </div>
  )
}
