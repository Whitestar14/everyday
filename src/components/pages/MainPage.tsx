import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MainHeader } from '@/components/layout/MainHeader'
import { TaskList } from '@/components/tasks/TaskList'
import { EmptyState } from '@/components/layout/EmptyState'
import { AddTaskSheet } from '@/components/tasks/AddTaskSheet'
import type { ButtonPosition, ThemeMode } from '@/types/app'

interface Task {
  id: string
  text: string
  createdAt: Date
}

interface MainPageProps {
  tasks: Task[]
  completingTasks: Set<string>
  onCompleteTask: (taskId: string) => void
  onAddTask: (text: string) => void
  onViewAllTasks: () => void
  greeting: string
  buttonPosition: ButtonPosition
  themeMode: ThemeMode
  onButtonPositionChange: (position: ButtonPosition) => void
  onThemeChange: (theme: ThemeMode) => void
  getButtonPositionStyles: () => string
}

const MAX_TASKS_ON_MAIN = 3

export function MainPage({
  tasks,
  completingTasks,
  onCompleteTask,
  onAddTask,
  onViewAllTasks,
  greeting,
  buttonPosition,
  themeMode,
  onButtonPositionChange,
  onThemeChange,
  getButtonPositionStyles
}: MainPageProps) {
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [showSettingsSheet, setShowSettingsSheet] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header Section with Settings */}
        <MainHeader
          greeting={greeting}
          showSettingsSheet={showSettingsSheet}
          onShowSettingsSheet={setShowSettingsSheet}
          buttonPosition={buttonPosition}
          themeMode={themeMode}
          onButtonPositionChange={onButtonPositionChange}
          onThemeChange={onThemeChange}
        />

        {/* Recent Tasks Preview */}
        <AnimatePresence>
          {tasks.length > 0 && (
            <TaskList
              tasks={tasks}
              completingTasks={completingTasks}
              onCompleteTask={onCompleteTask}
              onViewAll={onViewAllTasks}
              maxTasks={MAX_TASKS_ON_MAIN}
            />
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {tasks.length === 0 && <EmptyState />}
        </AnimatePresence>

        {/* Simple footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 pb-20"
        >
          <div className="text-xs text-muted-foreground/40">
            made with ❤️ for ADHD brains
          </div>
        </motion.div>
      </div>

      {/* Add Task Sheet */}
      <AddTaskSheet
        open={showAddSheet}
        onOpenChange={setShowAddSheet}
        onAddTask={onAddTask}
        buttonPositionStyles={getButtonPositionStyles()}
      />
    </div>
  )
}

