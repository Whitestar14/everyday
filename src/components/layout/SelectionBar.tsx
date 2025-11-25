"use client"

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2 } from 'lucide-react'
import { useTaskStore } from '@/stores/tasks'
import { motion, AnimatePresence } from 'framer-motion'

export default function SelectionBar() {
  const { isSelectionMode, selectedTasks, clearSelection, bulkDeleteSelectedTasks, selectAllTasks } = useTaskStore()

  return (
    <AnimatePresence>
      {isSelectionMode && (
        <motion.div
          key="selection-bar"
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ type: 'tween', duration: 0.14 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-[92%] mx-auto bg-muted/20 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <Checkbox className='flex justify-center items-center' checked={selectedTasks.size > 0} onCheckedChange={(v) => { if (v) selectAllTasks(); else clearSelection() }} />
            <div className="text-sm text-foreground">{selectedTasks.size} selected</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearSelection} className="h-8">Cancel</Button>
            <Button variant="destructive" size="sm" onClick={bulkDeleteSelectedTasks} className="h-8">
              <Trash2 className="w-3 h-3" /> Delete
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
