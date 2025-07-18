import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

interface AddTaskSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (text: string) => void
  buttonPositionStyles: string
}

export function AddTaskSheet({ 
  open, 
  onOpenChange, 
  onAddTask, 
  buttonPositionStyles 
}: AddTaskSheetProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAddTask = () => {
    if (inputValue.trim()) {
      onAddTask(inputValue.trim())
      setInputValue('')
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask()
    } else if (e.key === 'Escape') {
      onOpenChange(false)
      setInputValue('')
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setInputValue('')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <motion.button
          className={`fixed w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg active:scale-95 transition-transform flex items-center justify-center ${buttonPositionStyles}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[300px]">
        <SheetHeader>
          <SheetTitle className="text-left">add something gentle</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <Input
            placeholder="what would you like to remember?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 text-base bg-white/50 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/40 rounded-xl"
            autoFocus
          />
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex-1"
            >
              cancel
            </Button>
            <Button
              onClick={handleAddTask}
              disabled={!inputValue.trim()}
              className="flex-1"
            >
              add
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
