"use client"

import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Edit3, Trash2, Check, Repeat } from "lucide-react"
import { useState } from "react"
import type { Task, Space, Project } from "@/types/app"
import { gentleTaskSlide, gentleCompletion } from "@/utils/animations"
import TaskMetadataChips from "./TaskMetadataChips"
import { TaskEditSheet } from "./TaskEditSheet"

interface TaskItemProps {
  task: Task
  isCompleting: boolean
  isUndoable?: boolean
  allowCompletion?: boolean
  onComplete?: (taskId: string) => void
  onUndo?: (taskId: string) => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  index?: number
  showDate?: boolean
  selectionMode?: boolean
  isSelected?: boolean
  onSelect?: (checked: boolean) => void
  view?: 'inbox' | 'today' | 'library'
  space?: Space
  project?: Project
  onMoveToSpace?: (taskId: string, spaceId: string) => void
}


export function TaskItem({
  task,
  isCompleting,
  isUndoable = false,
  allowCompletion = true,
  onComplete,
  onUndo,
  onEdit,
  onDelete,
  index = 0,
  showDate = true,
  selectionMode = false,
  isSelected = false,
  onSelect,
  view = 'inbox',
  space,
  project,
  onMoveToSpace,
}: TaskItemProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)

  const handleEdit = () => {
    setDropdownOpen(false)
    setEditSheetOpen(true)
  }

  const handleDelete = () => {
    setDropdownOpen(false)
    onDelete?.(task.id)
  }

  const handleSwipeComplete = (info: any) => {
    if (view === 'today' && allowCompletion && info.offset.x < -50) {
      onComplete?.(task.id)
    }
  }

  const handleTapEdit = () => {
    if (view !== 'library') {
      setEditSheetOpen(true)
    }
  }

  return (
    <>
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
        drag={view === 'today' ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleSwipeComplete}
      >
        <motion.div
          variants={gentleCompletion}
          initial="initial"
          animate={isCompleting ? "completing" : "initial"}
          className={`flex items-center gap-4 p-4 py-2 rounded-2xl border transition-all duration-300 ${
            isCompleting
              ? "bg-accent/10 border-accent/40"
              : "bg-card border-border hover:border-border/60"
          }`}
        >
          {/* Selection mode checkbox or completion circle */}
          {selectionMode ? (
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="flex-shrink-0 size-5"
            />
          ) : (
            <div className="flex-shrink-0 relative">
              {allowCompletion && isUndoable ? (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-medium hover:bg-accent/80 transition-colors"
                  onClick={() => onUndo?.(task.id)}
                >
                  undo
                </motion.button>
              ) : allowCompletion ? (
                <div
                  className={`size-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    isCompleting
                      ? "bg-accent border-accent text-accent-foreground"
                      : "border-muted-foreground/40 hover:border-muted-foreground/60"
                  }`}
                  onClick={() => !isCompleting && onComplete?.(task.id)}
                >
                  <AnimatePresence>
                    {isCompleting && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : null}
            </div>
          )}

          {/* Task content */}
          <div className="flex-1 min-w-0" onClick={handleTapEdit}>
            <div className="flex items-center gap-2">
              <p
                className={`text-base transition-all duration-300 ${
                  isCompleting ? "text-muted-foreground line-through opacity-70" : "text-foreground"
                }`}
              >
                {task.text}
              </p>
              {/* Consistent type indicators */}
              {task.type === "routine" && (
                <div className="flex items-center gap-1">
                  <Repeat className="size-3 text-primary/60" />
                </div>
              )}
            </div>
            <TaskMetadataChips task={task} space={space} project={project} onEdit={() => setEditSheetOpen(true)} />
            {showDate && <p className="text-xs text-muted-foreground/70 mt-1">{task.createdAt.toLocaleDateString()}</p>}
          </div>

          {/* Always visible dropdown button for mobile-first design */}
          {(onEdit || onDelete || (view === 'inbox' && onMoveToSpace)) && (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-8 p-0 flex-shrink-0"
                  aria-label="Task options"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-40"
                onCloseAutoFocus={(e) => {
                  e.preventDefault()
                }}
              >
                {onEdit && (
                  <DropdownMenuItem
                    onClick={handleEdit}
                    variant='default'
                    className="text-foreground focus:bg-accent/30 !hover:text-background"
                  >
                    <Edit3 className="text-foreground hover:text-background size-4 mr-2" />
                    Edit task
                  </DropdownMenuItem>
                )}
                {view === 'inbox' && onMoveToSpace && (
                  <DropdownMenuItem
                    onClick={() => {
                      setDropdownOpen(false)
                      // Assume space selection logic here, for simplicity open edit
                      setEditSheetOpen(true)
                    }}
                    variant='default'
                    className="text-foreground focus:bg-accent/30 !hover:text-background"
                  >
                    Move to space
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={handleDelete}
                    variant='destructive'
                  >
                    <Trash2 className="text-destructive focus:text-destructive size-4 mr-2" />
                    Delete task
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </motion.div>
      </motion.div>
      <TaskEditSheet task={task} open={editSheetOpen} onOpenChange={setEditSheetOpen} />
    </>
  )
}