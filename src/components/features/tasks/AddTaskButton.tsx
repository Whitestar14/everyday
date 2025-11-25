"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useModal } from "@/contexts/ModalContext"

interface AddTaskButtonProps {
  fixed?: boolean
  className?: string
}

export function AddTaskButton({ fixed = true, className = "" }: AddTaskButtonProps) {
  const { openAddTask } = useModal()

  const handleClick = () => openAddTask()

  const positionClass = fixed ? `fixed bottom-20 left-1/2 -translate-x-1/2` : "relative"

  return (
    <>
      <motion.button
        onClick={handleClick}
        className={`${positionClass} ${fixed ? 'bottom-20' : ''} size-14 cursor-pointer bg-primary text-primary-foreground rounded-full active:scale-95 transition-transform flex items-center justify-center z-50 ${className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="size-6" />
      </motion.button>
    </>
  )
}
