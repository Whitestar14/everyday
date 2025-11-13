"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useModal } from "@/contexts/ModalContext"
import { useSettings } from "@/hooks/useSettings"

export function AddTaskButton() {
  const { openAddTask } = useModal()
  const { getButtonPositionStyles } = useSettings()

  return (
    <motion.button
      onClick={openAddTask}
      className={`fixed w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg active:scale-95 transition-transform flex items-center justify-center z-50 ${getButtonPositionStyles()}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  )
}
