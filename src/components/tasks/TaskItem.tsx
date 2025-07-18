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
      layout // Enable layout animations for smooth repositioning
      variants={taskSlide}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ 
        delay: index * 0.1,
        layout: { duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] }
      }}
    >
      <motion.div
        variants={completionPulse}
        initial="initial"
        animate={isCompleting ? "completing" : "initial"}
        className={`flex items-center gap-4 p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
          isCompleting 
            ? 'bg-task-completing/20 border-accent/40 shadow-lg' 
            : 'bg-task-background border-border hover:bg-task-hover hover:border-border/60 active:scale-[0.98]'
        }`}
        onClick={() => !isCompleting && onComplete(task.id)}
      >
        {/* Signature circle checkbox */}
        <motion.div
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            isCompleting
              ? 'bg-accent border-accent text-accent-foreground shadow-sm'
              : 'border-muted-foreground/40 hover:border-muted-foreground/60'
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
              ? 'text-muted-foreground line-through opacity-70' 
              : 'text-foreground'
          }`}>
            {task.text}
          </p>
          {showDate && (
            <p className="text-xs text-muted-foreground/70 mt-1">
              {task.createdAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
