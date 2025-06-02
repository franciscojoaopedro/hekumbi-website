"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Settings, Vibrate, Volume2, VolumeX, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

export function HapticSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [hapticEnabled, setHapticEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [intensity, setIntensity] = useState([50])
  const { haptic } = useHapticFeedback()

  const testHaptic = (type: "light" | "medium" | "heavy") => {
    if (hapticEnabled) {
      haptic(type)
    }
  }

  return (
    <>
      {/* Settings Button */}
      <motion.div
        className="fixed top-20 left-4 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm border border-slate-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: -15 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 15 }}
              className="bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl w-full max-w-md"
              style={{ transformPerspective: 1000 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-4 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h3 className="text-white font-bold">Configurações</h3>
                  <p className="text-gray-300 text-sm">Feedback tátil e sonoro</p>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Haptic Feedback */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Vibrate className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="text-white font-medium">Feedback Tátil</p>
                        <p className="text-gray-400 text-sm">Vibração ao interagir</p>
                      </div>
                    </div>
                    <Switch
                      checked={hapticEnabled}
                      onCheckedChange={setHapticEnabled}
                      className="data-[state=checked]:bg-cyan-500"
                    />
                  </div>

                  {hapticEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pl-8"
                    >
                      <div>
                        <p className="text-gray-300 text-sm mb-2">Intensidade</p>
                        <Slider value={intensity} onValueChange={setIntensity} max={100} step={1} className="w-full" />
                        <p className="text-gray-500 text-xs mt-1">{intensity[0]}%</p>
                      </div>

                      <div>
                        <p className="text-gray-300 text-sm mb-2">Testar Vibração</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testHaptic("light")}
                            className="border-slate-600 text-gray-300"
                          >
                            Leve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testHaptic("medium")}
                            className="border-slate-600 text-gray-300"
                          >
                            Médio
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testHaptic("heavy")}
                            className="border-slate-600 text-gray-300"
                          >
                            Forte
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sound Feedback */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {soundEnabled ? (
                        <Volume2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <p className="text-white font-medium">Feedback Sonoro</p>
                        <p className="text-gray-400 text-sm">Sons de interação</p>
                      </div>
                    </div>
                    <Switch
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </div>

                {/* Device Info */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Informações do Dispositivo</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400">Vibração: {navigator.vibrate() ? "✅ Suportada" : "❌ Não suportada"}</p>
                    <p className="text-gray-400">Touch: {window.TouchEvent ? "✅ Suportado" : "❌ Não suportado"}</p>
                    <p className="text-gray-400">
                      Orientação: {window.DeviceOrientationEvent ? "✅ Suportada" : "❌ Não suportada"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
