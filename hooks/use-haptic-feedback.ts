"use client"

import { useCallback } from "react"

export function useHapticFeedback() {
  const haptic = useCallback(
    (
      type: "light" | "medium" | "heavy" | "selection" | "notification" | "button" | "navigation" | "success" | "error",
    ) => {
      if (typeof window === "undefined" || !navigator.vibrate) return

      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50],
        selection: [5],
        notification: [10, 50, 10],
        button: [15],
        navigation: [10, 10],
        success: [10, 50, 10, 50],
        error: [50, 50, 50],
      }

      try {
        navigator.vibrate(patterns[type] || patterns.light)
      } catch (error) {
        console.warn("Haptic feedback not supported:", error)
      }
    },
    [],
  )

  return { haptic }
}
