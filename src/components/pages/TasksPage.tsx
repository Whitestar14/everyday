import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { TaskList } from '@/components/tasks/TaskList'
import { EmptyState } from '@/components/layout/EmptyState'
import { AddTaskSheet } from '@/components/tasks/AddTaskSheet'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { fadeIn } from '@/utils/animations'
import type { ButtonPosition, ThemeMode } from '@/types/app'

interface Task {
  id: string
  text: string
  createdAt: Date
}

interface TasksPageProps {
  tasks: Task[]
  completingTasks: Set<string>
  onCompleteTask: (taskId: string) => void
  onAddTask: (text: string) => void
  onBack: () => void
  buttonPosition: ButtonPosition
  themeMode: ThemeMode
  onButtonPositionChange: (position: ButtonPosition) => void
  onThemeChange: (theme: ThemeMode) => void
  getButtonPositionStyles: () => string
}

export function TasksPage({
  tasks,
  completingTasks,
  onCompleteTask,
  onAddTask,
  onBack,
  buttonPosition,
  themeMode,
  onButtonPositionChange,
  onThemeChange,
  getButtonPositionStyles
}: TasksPageProps) {
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [showSettingsSheet, setShowSettingsSheet] = useState(false)

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

        {/* All Tasks */}
        {tasks.length > 0 ? (
          <TaskList
            tasks={tasks}
            completingTasks={completingTasks}
            onCompleteTask={onCompleteTask}
            title="your gentle reminders"
            showViewAll={false}
          />
        ) : (
          <EmptyState
            title="no tasks yet"
            subtitle="that's perfectly okay"
            description="tap the + button to add your first gentle reminder"
          />
        )}
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
