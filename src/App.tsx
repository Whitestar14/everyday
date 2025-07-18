import { useState, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useTaskStore } from '@/stores/tasks'

// Safe, gentle animation variants with proper typing
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] as const }
  }
}

const slideUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] as const }
  }
}

const taskSlide: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2, ease: [0.17, 0.67, 0.83, 0.67] as const }
  },
  exit: { 
    opacity: 0, 
    x: 10,
    transition: { duration: 0.2, ease: [0.17, 0.67, 0.83, 0.67] as const }
  }
}

function App() {
  const [inputValue, setInputValue] = useState('')
  
  // Zustand store
  const { tasks, isLoaded, addTask, removeTask, loadTasks } = useTaskStore()

  // Load tasks on mount
  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleAddTask = () => {
    if (inputValue.trim()) {
      addTask(inputValue)
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-light text-foreground tracking-tight">everyday</h1>
          <p className="text-muted-foreground text-sm">loading gently...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          className="text-center space-y-2"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl font-light text-foreground tracking-tight">everyday</h1>
          <p className="text-muted-foreground text-sm">gentle task tracking</p>
        </motion.div>

        {/* Add Task */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={slideUp}
        >
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-normal">add something</CardTitle>
              <CardDescription>what would you like to remember?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="take a walk, drink water..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-0 bg-muted/50 focus-visible:ring-1"
              />
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button 
                  onClick={handleAddTask} 
                  className="w-full font-normal"
                  disabled={!inputValue.trim()}
                >
                  add gently
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Task List */}
        <AnimatePresence>
          {tasks.length > 0 && (
            <motion.div 
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideUp}
            >
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-normal">your tasks</CardTitle>
                  <CardDescription>
                    {tasks.length} thing{tasks.length !== 1 ? 's' : ''} to remember
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          variants={taskSlide}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="group flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-sm text-foreground/90">{task.text}</span>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTask(task.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                            >
                              done
                            </Button>
                          </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {tasks.length === 0 && (
            <motion.div
              className="text-center py-8"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
            >
              <p className="text-muted-foreground text-sm">nothing to track right now</p>
              <p className="text-muted-foreground/70 text-xs mt-1">that's perfectly okay</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
