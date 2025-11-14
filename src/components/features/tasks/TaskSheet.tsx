import type React from "react"
import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Task } from "@/types/app"

type TaskSheetMode = 'add' | 'edit'

interface TaskSheetProps {
  mode: TaskSheetMode
  task?: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (text: string, type: "task" | "routine") => void
  onDelete?: (id: string) => void
}

// Reusable task type toggle component
function TaskTypeToggle({
  value,
  onChange
}: {
  value: "task" | "routine"
  onChange: (type: "task" | "routine") => void
}) {
  return (
    <div className="flex gap-2 p-1 bg-muted/30 rounded-xl">
      <button
        type="button"
        onClick={() => onChange("task")}
        className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
          value === "task"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        one-time task
      </button>
      <button
        type="button"
        onClick={() => onChange("routine")}
        className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
          value === "routine"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        daily routine
      </button>
    </div>
  )
}

export function TaskSheet({ mode, task, open, onOpenChange, onSubmit, onDelete }: TaskSheetProps) {
  const [inputValue, setInputValue] = useState("")
  const [taskType, setTaskType] = useState<"task" | "routine">("task")

  // Initialize form when task changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && task) {
      setInputValue(task.text)
      setTaskType(task.type)
    } else if (mode === 'add') {
      setInputValue("")
      setTaskType("task")
    }
  }, [task, mode])

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue.trim(), taskType)
      if (mode === 'add') {
        setInputValue("")
        setTaskType("task")
      }
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    if (mode === 'add') {
      setInputValue("")
      setTaskType("task")
    }
  }

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id)
      onOpenChange(false)
    }
  }

  const title = mode === 'add' ? 'add something gentle' : 'edit task gently'
  const description = mode === 'add' ? 'what would you like to remember?' : 'make changes to your task'
  const submitText = mode === 'add' ? 'add gently' : 'save changes'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-auto min-h-[320px] max-h-[70vh] border-t-0 rounded-t-2xl bg-background/95 backdrop-blur-sm shadow-lg px-6 py-6"
      >
        <div className="flex justify-center -mt-2 mb-6">
          <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
        </div>

        <SheetHeader className="pb-4">
          <SheetTitle className="text-left text-lg font-normal">{title}</SheetTitle>
          <SheetDescription className="text-left text-muted-foreground text-sm">
            {description}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <TaskTypeToggle value={taskType} onChange={setTaskType} />

          <Input
            placeholder={taskType === "routine" ? "morning walk, evening tea..." : "take a walk, drink water..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 text-base bg-white/50 backdrop-blur-sm rounded-xl transition-all duration-300"
            autoFocus
          />

          <div className="flex gap-3 pt-2">
            
            
          {mode === 'edit' && onDelete && (
            <div className="flex-0">
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="!bg-destructive/10 text-destructive h-11 rounded-md"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

            <Button variant="ghost" onClick={handleCancel} className="flex-1 h-11 text-base rounded-xl">
              cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!inputValue.trim()} className="flex-1 h-11 text-base rounded-xl">
              {submitText}
            </Button>

          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground/60">
              press enter to {mode === 'add' ? 'add' : 'save'}, escape to close
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
