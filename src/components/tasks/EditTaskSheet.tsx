"use client"

import type React from "react"
import { Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Task } from "@/types/app"

interface EditTaskSheetProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTask: (id: string, updates: Partial<Pick<Task, "text" | "type">>) => void
  onDeleteTask?: (id: string) => void
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

export function EditTaskSheet({ task, open, onOpenChange, onUpdateTask, onDeleteTask }: EditTaskSheetProps) {
  const [inputValue, setInputValue] = useState("")
  const [taskType, setTaskType] = useState<"task" | "routine">("task")

  // Initialize form when task changes
  useEffect(() => {
    if (task) {
      setInputValue(task.text)
      setTaskType(task.type)
    }
  }, [task])

  const handleUpdateTask = () => {
    if (inputValue.trim() && task) {
      onUpdateTask(task.id, {
        text: inputValue.trim(),
        type: taskType,
      })
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateTask()
    } else if (e.key === "Escape") {
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleDeleteTask = () => {
    if (task && onDeleteTask) {
      onDeleteTask(task.id)
      onOpenChange(false)
    }
  }

  // Don't render if no task
  if (!task) return null

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
          <SheetTitle className="text-left text-lg font-normal">edit task gently</SheetTitle>
          <SheetDescription className="text-left text-muted-foreground text-sm">
            make changes to your task
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <TaskTypeToggle value={taskType} onChange={setTaskType} />

          <Input
            placeholder={taskType === "routine" ? "morning walk, evening tea..." : "take a walk, drink water..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 text-base bg-white/50 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/40 rounded-xl transition-all duration-300"
            autoFocus
          />

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={handleCancel} className="flex-1 h-11 text-base rounded-xl">
              cancel
            </Button>
            <Button onClick={handleUpdateTask} disabled={!inputValue.trim()} className="flex-1 h-11 text-base rounded-xl">
              save changes
            </Button>
          </div>

          {onDeleteTask && (
            <div className="pt-2">
              <Button 
                variant="ghost" 
                onClick={handleDeleteTask} 
                className="w-full h-11 text-base rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                delete task
              </Button>
            </div>
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground/60">press enter to save, escape to close</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}