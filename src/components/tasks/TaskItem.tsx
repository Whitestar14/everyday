import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { completionPulse, taskSlide } from '@/utils/animations'

interface Task {
  id: string
  text: string
  createdAt: Date
}

interface TaskItemProps {
  task: Task
  isCompleting: boolean
  onComplete: (taskId: string) => void
  index?: number
  showDate?: boolean
}

export function TaskItem({ 
  task, 
  isCompleting, 
  onComplete, 
  index = 0,
  showDate = true 
}: TaskItemProps) {
  return (
    <motion.div
      variants={taskSlide}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay: index * 0.1 }}
    >
      <motion.div
        variants={completionPulse}
        initial="initial"
        animate={isCompleting ? "completing" : "initial"}
        className={`flex items-center gap-4 p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
          isCompleting 
            ? 'bg-accent/20 border-accent/30 shadow-lg' 
            : 'bg-white/30 border-white/20 active:bg-white/40'
        }`}
        onClick={() => !isCompleting && onComplete(task.id)}
      >
        {/* Signature circle checkbox */}
        <motion.div
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            isCompleting
              ? 'bg-accent border-accent text-accent-foreground'
              : 'border-muted-foreground/30'
          }`}
        >
          <AnimatePresence>
            {isCompleting && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-3 h-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <p className={`text-base transition-all duration-300 ${
            isCompleting
              ? 'text-accent-foreground line-through opacity-70' 
              : 'text-foreground'
          }`}>
            {task.text}
          </p>
          {showDate && (
            <p className="text-xs text-muted-foreground/60 mt-1">
              {task.createdAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

