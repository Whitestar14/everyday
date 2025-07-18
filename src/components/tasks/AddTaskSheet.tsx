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
          className={`fixed w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg active:scale-95 transition-transform flex items-center justify-center z-50 ${buttonPositionStyles}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </SheetTrigger>
      
      <SheetContent 
        side="bottom" 
        className="h-auto min-h-[280px] max-h-[70vh] border-t-0 rounded-t-2xl bg-background/95 backdrop-blur-sm shadow-lg px-6 py-6"
      >
        {/* Drag Handle */}
        <div className="flex justify-center -mt-2 mb-6">
          <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
        </div>

        <SheetHeader className="pb-4">
          <SheetTitle className="text-left text-lg font-normal">
            add something gentle
          </SheetTitle>
          <p className="text-left text-muted-foreground text-sm">
            what would you like to remember?
          </p>
        </SheetHeader>

        <div className="space-y-4">
          {/* Input */}
          <Input
            placeholder="take a walk, drink water..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 text-base bg-white/50 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/40 rounded-xl transition-all duration-300"
            autoFocus
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex-1 h-11 text-base rounded-xl"
            >
              cancel
            </Button>
            <Button
              onClick={handleAddTask}
              disabled={!inputValue.trim()}
              className="flex-1 h-11 text-base rounded-xl"
            >
              add gently
            </Button>
          </div>

          {/* Gentle Hint */}
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground/60">
              press enter to add, escape to close
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
