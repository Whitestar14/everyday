"use client"

import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit3, Trash2, Check, Clock, Repeat } from "lucide-react"
import { useState } from "react"
import type { Task } from "@/types/app"
import { gentleTaskSlide, gentleCompletion } from "@/utils/animations"

interface TaskItemProps {
  task: Task
  isCompleting: boolean
  onComplete: (taskId: string) => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  index?: number
  showDate?: boolean
}


export function TaskItem({
  task,
  isCompleting,
  onComplete,
  onEdit,
  onDelete,
  index = 0,
  showDate = true,
}: TaskItemProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleEdit = () => {
    setDropdownOpen(false) // Close dropdown before opening edit sheet
    onEdit?.(task)
  }

  const handleDelete = () => {
    setDropdownOpen(false) // Close dropdown before deleting
    onDelete?.(task.id)
  }

  return (
    <motion.div
      layout
      variants={gentleTaskSlide}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        delay: index * 0.1,
        layout: { duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] },
      }}
      className="group"
    >
      <motion.div
        variants={gentleCompletion}
        initial="initial"
        animate={isCompleting ? "completing" : "initial"}
        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
          isCompleting
            ? "bg-accent/10 border-accent/40"
            : "bg-card border-border hover:border-border/60"
        }`}
      >
        {/* Signature circle checkbox */}
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
            isCompleting
              ? "bg-accent border-accent text-accent-foreground"
              : "border-muted-foreground/40 hover:border-muted-foreground/60"
          }`}
          onClick={() => !isCompleting && onComplete(task.id)}
        >
          <AnimatePresence>
            {isCompleting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="h-3 w-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={`text-base transition-all duration-300 ${
                isCompleting ? "text-muted-foreground line-through opacity-70" : "text-foreground"
              }`}
            >
              {task.text}
            </p>
            {/* Consistent type indicators */}
            <div className="flex items-center gap-1">
              {task.type === "routine" ? (
                <Repeat className="h-3 w-3 text-primary/60" />
              ) : (
                <Clock className="h-3 w-3 text-muted-foreground/60" />
              )}
            </div>
          </div>
          {showDate && <p className="text-xs text-muted-foreground/70 mt-1">{task.createdAt.toLocaleDateString()}</p>}
        </div>

        {/* Always visible dropdown button for mobile-first design */}
        {(onEdit || onDelete) && (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
                aria-label="Task options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-40"
              onCloseAutoFocus={(e) => {
                // Prevent focus issues that cause aria-hidden errors
                e.preventDefault()
              }}
            >
              {onEdit && (
                <DropdownMenuItem
                  onClick={handleEdit}
                  className="cursor-pointer hover:bg-accent/10 focus:bg-accent/10"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit task
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete task
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </motion.div>
    </motion.div>
  )
}