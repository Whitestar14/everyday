import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Trash2 } from "lucide-react"
import { TaskList } from "@/components/features/tasks/TaskList"
import { EmptyState } from "@/components/layout/EmptyState"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useModal } from "@/contexts/ModalContext"
import { useSettingsStore } from "@/stores/settings"
import { fadeIn, gentleFadeIn } from "@/utils/animations"
import type { Task } from "@/types/app"

interface ManageTasksPageProps {
  tasks: Task[]
  onDeleteTask: (id: string) => void
  onBack: () => void
}

export function ManageTasksPage({
  tasks,
  onDeleteTask,
  onBack,
}: ManageTasksPageProps) {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const { openEditTask } = useModal()
  const { newTasksOnTop, setNewTasksOnTop } = useSettingsStore()

  const handleEditTask = (task: Task) => {
    openEditTask(task)
  }

  const handleSelectTask = (taskId: string, checked: boolean) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(taskId)
      } else {
        newSet.delete(taskId)
      }
      return newSet
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(new Set(tasks.map(task => task.id)))
    } else {
      setSelectedTasks(new Set())
    }
  }

  const handleBulkDelete = () => {
    selectedTasks.forEach(taskId => onDeleteTask(taskId))
    setSelectedTasks(new Set())
    setIsSelectionMode(false)
  }

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedTasks(new Set())
  }

  const toggleTaskOrdering = () => {
    setNewTasksOnTop(!newTasksOnTop)
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="max-w-md mx-auto px-4 py-8 h-full flex flex-col">
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

          <h1 className="text-2xl font-light text-foreground">manage tasks</h1>

          <button
            onClick={toggleSelectionMode}
            className={`text-sm px-3 py-1 rounded-lg transition-colors ${
              isSelectionMode
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {isSelectionMode ? 'cancel' : 'select'}
          </button>
        </motion.div>

        {/* Settings */}
        <motion.div
          className="mb-6 p-4 bg-muted/30 rounded-xl"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">New tasks appear at top</span>
            <button
              onClick={toggleTaskOrdering}
              className={`relative inline-flex h-6 w-8 p-0 items-center rounded-full transition-colors ${
                newTasksOnTop ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  newTasksOnTop ? 'translate-x-3' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {isSelectionMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    className='size-5'
                    checked={selectedTasks.size === tasks.length && tasks.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-foreground">
                    {selectedTasks.size} selected
                  </span>
                </div>

                <Button
                  onClick={handleBulkDelete}
                  disabled={selectedTasks.size === 0}
                  variant="destructive"
                  size="sm"
                  className="h-8"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {tasks.length > 0 ? (
              <motion.div key="tasks-content" initial="hidden" animate="visible" exit="exit" variants={gentleFadeIn}>
                <TaskList
                  tasks={tasks}
                  onEditTask={handleEditTask}
                  onDeleteTask={onDeleteTask}
                  title="all your tasks & routines"
                  showViewAll={false}
                  selectionMode={isSelectionMode}
                  selectedTasks={selectedTasks}
                  onSelectTask={handleSelectTask}
                  allowCompletion={false}
                />
              </motion.div>
            ) : (
              <motion.div key="empty-content" initial="hidden" animate="visible" exit="exit" variants={gentleFadeIn}>
                <EmptyState
                  title="no tasks yet"
                  subtitle="create your first task to get started"
                  description="tap the + button below to add something gentle"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
