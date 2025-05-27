"use client"

import { Canvas } from "@react-three/fiber"
import { VRButton, ARButton, XR, createXRStore } from "@react-three/xr"
import { Environment, Text, Box, Sphere, OrbitControls } from "@react-three/drei"
import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Glasses, X } from "lucide-react"


const store = createXRStore()

function VRScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Company Logo in 3D */}
      <Text position={[0, 2, -2]} fontSize={0.5} color="#22d3ee" anchorX="center" anchorY="middle">
        HEKUMBI
      </Text>

      {/* Services as 3D Objects */}
      <Box position={[-2, 0, -3]} args={[1, 1, 1]}>
        <meshStandardMaterial color="#06b6d4" />
      </Box>

      <Sphere position={[2, 0, -3]} args={[0.5]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Sphere>

      <Box position={[0, -1, -4]} args={[1.5, 0.5, 1]}>
        <meshStandardMaterial color="#10b981" />
      </Box>

      {/* Interactive Elements */}
      <Text position={[0, 0, -2]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        Soluções de Limpeza e Higienização
      </Text>

      <Text position={[0, -0.5, -2]} fontSize={0.2} color="#94a3b8" anchorX="center" anchorY="middle">
        Explore nossos serviços em realidade virtual
      </Text>

      {/* Environment */}
      <Environment preset="city" />
    </>
  )
}

export function VRExperience() {
  const [isVRMode, setIsVRMode] = useState(false)

  return (
    <div className="relative">
      {/* VR Toggle Button */}
      <motion.div
        className="fixed top-20 right-4 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsVRMode(!isVRMode)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
          size="sm"
        >
          {isVRMode ? <X className="w-5 h-5" /> : <Glasses className="w-5 h-5" />}
        </Button>
      </motion.div>

      {/* VR Experience */}
      {isVRMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black"
        >
          <div className="absolute top-4 left-4 z-50 text-white">
            <p className="text-sm">Modo VR Ativo - Use óculos VR compatíveis</p>
          </div>

          <Canvas>
            <XR store={store}>
              <VRScene />
              {/* Removed Controllers as it is not exported */}
              {/* Removed Hands as it is not exported */}
              <OrbitControls />
            </XR>
          </Canvas>

          {/* VR Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
           <Button onClick={() => store.enterVR()}>Testa</Button>

            <VRButton store={store} />
            <ARButton store={store} />
          </div>
        </motion.div>
      )}
    </div>
  )
}
