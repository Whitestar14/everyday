"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MainHeader } from "@/components/layout/MainHeader"
import { TaskList } from "@/components/features/tasks/TaskList"
import { EmptyState } from "@/components/layout/EmptyState"
import { AddTaskButton } from "@/components/features/tasks/AddTaskButton"
import { useModal } from "@/contexts/ModalContext"
import { useUser } from "@/hooks/useUser"
import type { Task } from "@/types/app"

interface MainPageProps {
  tasks: Task[]
  completingTasks: Set<string>
  undoableTasks: Map<string, number>
  onCompleteTask: (taskId: string) => void
  onUndoTask: (taskId: string) => void
  onAddTask: (text: string, type: "task" | "routine") => void
  onDeleteTask: (id: string) => void
  onViewAllTasks: () => void
  onManageTasks: () => void
  onProfileClick?: () => void
  greeting: string
}

const MAX_TASKS_ON_MAIN = 3

export function MainPage({
  tasks,
  completingTasks,
  undoableTasks,
  onCompleteTask,
  onUndoTask,
  onDeleteTask,
  onViewAllTasks,
  onManageTasks,
  onProfileClick,
  greeting,
}: MainPageProps) {
  const [showSettingsSheet, setShowSettingsSheet] = useState(false)
  const { openEditTask } = useModal()
  const { avatar } = useUser()

  const handleEditTask = (task: Task) => {
    openEditTask(task)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header Section with Settings */}
        <MainHeader
          greeting={greeting}
          avatar={avatar}
          showSettingsSheet={showSettingsSheet}
          onShowSettingsSheet={setShowSettingsSheet}
          onProfileClick={onProfileClick}
        />

        {/* Recent Tasks Preview */}
        <AnimatePresence>
          {tasks.length > 0 && (
            <TaskList
              tasks={tasks}
              completingTasks={completingTasks}
              undoableTasks={undoableTasks}
              onCompleteTask={onCompleteTask}
              onUndoTask={onUndoTask}
              onEditTask={handleEditTask}
              onDeleteTask={onDeleteTask}
              onViewAll={onViewAllTasks}
              onManage={onManageTasks}
              maxTasks={MAX_TASKS_ON_MAIN}
            />
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>{tasks.length === 0 && <EmptyState />}</AnimatePresence>

        {/* Simple footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 pb-20"
        >
          <div className="text-xs text-muted-foreground/40">made with ❤️ for ADHD brains</div>
        </motion.div>
      </div>

      {/* Add Task Button */}
      <AddTaskButton />
    </div>
  )
}
