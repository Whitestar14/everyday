import React from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface FooterProps {
  mode: 'add' | 'edit'
  onDelete?: (id: string) => void
  taskId?: string | null
  onOpenChange: (open: boolean) => void
}

export const TaskSheetFooter: React.FC<FooterProps> = ({ mode, onDelete, taskId, onOpenChange }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3 pt-2">
        {mode === 'edit' && onDelete && taskId && (
          <Button
            variant="destructive"
            onClick={() => { onDelete?.(taskId); onOpenChange(false); }}
            className="!bg-destructive/10 text-destructive h-9 rounded-md"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default TaskSheetFooter
