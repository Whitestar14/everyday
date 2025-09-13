"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { TaskList } from "@/components/tasks/TaskList"
import { EmptyState } from "@/components/layout/EmptyState"
import { AddTaskButton } from "@/components/tasks/AddTaskButton"
import { SettingsPanel } from "@/components/settings/SettingsPanel"
import { useModal } from "@/contexts/ModalContext"
import { useSettings } from "@/hooks/useSettings"
import { fadeIn, gentleFadeIn } from "@/utils/animations"
import type { Task } from "@/types/app"

interface TasksPageProps {
  tasks: Task[]
  completingTasks: Set<string>
  onCompleteTask: (taskId: string) => void
  onAddTask: (text: string, type: "task" | "routine") => void
  onUpdateTask: (id: string, updates: Partial<Pick<Task, "text" | "type">>) => void
  onDeleteTask: (id: string) => void
  onBack: () => void
}

export function TasksPage({
  tasks,
  completingTasks,
  onCompleteTask,
  onDeleteTask,
  onBack,
}: TasksPageProps) {
  const [showSettingsSheet, setShowSettingsSheet] = useState(false)
  const { openEditTask } = useModal()
  const { buttonPosition, themeMode, handleButtonPositionChange, handleThemeChange } = useSettings()

  const handleEditTask = (task: Task) => {
    openEditTask(task)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">back</span>
          </button>

          <h1 className="text-2xl font-light text-foreground">all tasks</h1>

          <SettingsPanel
            open={showSettingsSheet}
            onOpenChange={setShowSettingsSheet}
            buttonPosition={buttonPosition}
            themeMode={themeMode}
            onButtonPositionChange={onButtonPositionChange}
            onThemeChange={onThemeChange}
          />
        </motion.div>

        {/* Content Area with Smooth Transitions */}
        <AnimatePresence mode="wait">
          {tasks.length > 0 ? (
            <motion.div key="tasks-content" initial="hidden" animate="visible" exit="exit" variants={gentleFadeIn}>
              <TaskList
                tasks={tasks}
                completingTasks={completingTasks}
                onCompleteTask={onCompleteTask}
                onEditTask={handleEditTask}
                onDeleteTask={onDeleteTask}
                title="your gentle reminders"
                showViewAll={false}
              />
            </motion.div>
          ) : (
            <motion.div key="empty-content" initial="hidden" animate="visible" exit="exit" variants={gentleFadeIn}>
              <EmptyState
                title="nothing to track right now"
                subtitle="that's perfectly okay"
                description="tap the + button below when you're ready"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Task Button */}
      <AddTaskButton />
    </div>
  )
}
