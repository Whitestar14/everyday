import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { TaskItem } from './TaskItem'
import { slideUp } from '@/utils/animations'

interface Task {
  id: string
  text: string
  createdAt: Date
}

interface TaskListProps {
  tasks: Task[]
  completingTasks: Set<string>
  onCompleteTask: (taskId: string) => void
  onViewAll?: () => void
  maxTasks?: number
  title?: string
  showViewAll?: boolean
}

export function TaskList({
  tasks,
  completingTasks,
  onCompleteTask,
  onViewAll,
  maxTasks,
  title = "recent tasks",
  showViewAll = true
}: TaskListProps) {
  const displayTasks = maxTasks ? tasks.slice(0, maxTasks) : tasks
  const hasMore = maxTasks && tasks.length > maxTasks

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={slideUp}
      className="space-y-4 mb-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-light text-foreground">{title}</h2>
        {hasMore && showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            view all ({tasks.length})
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <motion.div 
        layout
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {displayTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              isCompleting={completingTasks.has(task.id)}
              onComplete={onCompleteTask}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {hasMore && showViewAll && onViewAll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-2"
        >
          <button
            onClick={onViewAll}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            and {tasks.length - maxTasks} more...
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
