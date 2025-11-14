"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Settings } from "lucide-react"
import { TaskItem } from "./TaskItem"
import { slideUp } from "@/utils/animations"
import type { Task } from "@/types/app"

interface TaskListProps {
  tasks: Task[]
  completingTasks?: Set<string>
  undoableTasks?: Map<string, number>
  onCompleteTask?: (taskId: string) => void
  onUndoTask?: (taskId: string) => void
  onEditTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
  onViewAll?: () => void
  onManage?: () => void
  maxTasks?: number
  title?: string
  showViewAll?: boolean
  selectionMode?: boolean
  selectedTasks?: Set<string>
  onSelectTask?: (taskId: string, checked: boolean) => void
  allowCompletion?: boolean
}

export function TaskList({
tasks,
completingTasks = new Set(),
undoableTasks = new Map(),
onCompleteTask,
onUndoTask,
onEditTask,
onDeleteTask,
onViewAll,
onManage,
maxTasks,
title = "recent tasks",
showViewAll = true,
selectionMode = false,
selectedTasks = new Set(),
onSelectTask,
  allowCompletion = true,
}: TaskListProps) {
  const displayTasks = maxTasks ? tasks.slice(0, maxTasks) : tasks
  const hasMore = maxTasks && tasks.length > maxTasks

  return (
    <motion.div initial="hidden" animate="visible" exit="hidden" variants={slideUp} className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
      <h2 className="text-lg font-light text-foreground">{title}</h2>
      <div className="flex items-center gap-2">
      {onManage && (
      <button
        onClick={onManage}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 px-2 py-1 rounded-lg transition-colors"
      >
        <Settings className="w-3 h-3" />
          manage
          </button>
          )}
          {hasMore && showViewAll && onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 px-2 py-1 rounded-lg transition-colors"
            >
              view all ({tasks.length})
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <motion.div layout className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              isCompleting={completingTasks.has(task.id)}
              isUndoable={undoableTasks.has(task.id)}
              allowCompletion={allowCompletion}
              onComplete={onCompleteTask}
              onUndo={onUndoTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              index={index}
              selectionMode={selectionMode}
              isSelected={selectedTasks.has(task.id)}
              onSelect={(checked) => onSelectTask?.(task.id, checked as boolean)}
            />
          ))}
        </AnimatePresence>
      </motion.div>


    </motion.div>
  )
}
