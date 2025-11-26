"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import type { PanInfo } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Edit3, Trash2, Repeat, Check } from "lucide-react"
import { useTasks } from "@/hooks/useTasks"
import type { Task } from "@/types/app"
import { taskFade, gentleCompletion } from "@/utils/animations"
import TaskMetadataChips from "./TaskMetadataChips"

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
  view?: "inbox" | "today"
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
  selectionMode = false,
  isSelected = false,
  onSelect,
  view = "inbox",
}: TaskItemProps) {
  const { toggleSelectionMode } = useTasks()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Long-press selection (mobile-first)
  const pressTimerRef = useRef<number | null>(null)
  const pressTriggeredRef = useRef(false)

  const startPressTimer = () => {
    if (pressTimerRef.current) return
    pressTriggeredRef.current = false
    pressTimerRef.current = window.setTimeout(() => {
      pressTriggeredRef.current = true
      onSelect?.(true)
      if (!selectionMode) toggleSelectionMode(true)
    }, 450)
  }

  const clearPressTimer = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }
  }

  const handleDelete = () => {
    setDropdownOpen(false)
    onDelete?.(task.id)
  }

  const handleSwipeComplete = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (view === "today" && allowCompletion && info.offset.x < -50) {
      onComplete?.(task.id)
    }
  }

  return (
    <motion.div
      layout
  variants={taskFade}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        delay: index * 0.05,
        layout: { duration: 0.25, ease: [0.17, 0.67, 0.83, 0.67] },
      }}
      className="group"
      drag={view === "today" ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleSwipeComplete}
    >
      <motion.div
        variants={gentleCompletion}
        initial="initial"
        animate={isCompleting ? "completing" : "initial"}
        className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors duration-200 ${
          isCompleting
            ? "bg-primary/10 border-primary/40"
            : "bg-card border-border hover:border-border/60"
        }`}
      >
        {/* Selection mode checkbox OR completion/undo control
           Undo mechanism (button instead of completion circle) is intentional */}
        {selectionMode ? (
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="flex-shrink-0 size-5 rounded-md border-muted"
            aria-label={isSelected ? "Deselect task" : "Select task"}
          />
        ) : (
          <div className="flex-shrink-0 relative">
            {allowCompletion && isUndoable ? (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="size-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] font-semibold hover:bg-accent/80 transition-colors"
                onClick={() => onUndo?.(task.id)}
                aria-label="Undo completion"
              >
                Undo
              </motion.button>
            ) : allowCompletion ? (
              <button
                className={`size-7 rounded-full border-2 flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                  isCompleting
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/40 hover:border-muted-foreground/60"
                }`}
                onClick={() => !isCompleting && onComplete?.(task.id)}
                aria-label={isCompleting ? "Completed" : "Mark complete"}
              >
                {isCompleting && <Check className="size-4" />}
              </button>
            ) : null}
          </div>
        )}

        {/* Task content */}
        <div
          className="flex-1 min-w-0"
          onPointerDown={startPressTimer}
          onPointerUp={clearPressTimer}
          onPointerLeave={clearPressTimer}
          onClick={() => {
            if (pressTriggeredRef.current) {
              pressTriggeredRef.current = false
              return
            }
            if (selectionMode) {
              onSelect?.(!isSelected)
            } else {
              onEdit?.(task)
            }
          }}
          role="button"
          aria-label="Task details"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <p
                className={`text-sm font-medium transition-colors duration-200 line-clamp-2 ${
                  isCompleting
                    ? "text-muted-foreground line-through opacity-60"
                    : "text-foreground"
                }`}
              >
                {task.text}
              </p>
              {task.type === "routine" && (
                <Repeat className="size-3 text-primary/60" aria-hidden="true" />
              )}
            </div>
          </div>

          {/* Metadata chips (due, recurrence, reminder) */}
          <TaskMetadataChips task={task} onEdit={() => onEdit?.(task)} />
        </div>

        {/* Mobile-first dropdown menu (always accessible) */}
        {(onEdit || onDelete || onSelect) && (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 p-0 flex-shrink-0 rounded-full hover:bg-muted"
                aria-label="Task options"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 rounded-md"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              {onSelect && (
                <DropdownMenuItem
                  onClick={() => {
                    if (!selectionMode) toggleSelectionMode(true)
                    onSelect?.(!isSelected)
                    setDropdownOpen(false)
                  }}
                >
                  <Check className="size-4 mr-2" />
                  {isSelected ? "Deselect item" : "Select item"}
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => {
                    onEdit?.(task)
                    setDropdownOpen(false)
                  }}
                >
                  <Edit3 className="size-4 mr-2" />
                  Edit task
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-4 mr-2" />
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

export default TaskItem
