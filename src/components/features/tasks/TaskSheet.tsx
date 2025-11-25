import type React from "react"
import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import type { Task } from "@/types/app"

type TaskSheetMode = 'add' | 'edit'
type MenuKey = null | 'due' | 'recurrence' | 'reminder'

interface TaskSheetProps {
  mode: TaskSheetMode
  task?: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (text: string, type: "task" | "routine", metadata?: Partial<Task>) => void
  onSave?: (id: string, metadata: Partial<Task>) => void
  hideClose?: boolean
  onDelete?: (id: string) => void
}

const toDateInputValue = (d?: Date) => (d ? d.toISOString().slice(0, 10) : '')

export function TaskSheet({ mode, task, open, onOpenChange, onSubmit, onSave, hideClose = false, onDelete }: TaskSheetProps) {
  const [inputValue, setInputValue] = useState("")
  const [dueDateText, setDueDateText] = useState("")
  const [recurrenceText, setRecurrenceText] = useState("")
  const [notes, setNotes] = useState("")
  const [reminderOffsetMinutes, setReminderOffsetMinutes] = useState<number | undefined>(undefined)
  const [enableNotifications, setEnableNotifications] = useState(false)
  const [keyboardOffset, setKeyboardOffset] = useState(0)
  const [openMenu, setOpenMenu] = useState<MenuKey>(null)

  useEffect(() => {
    if (mode === 'edit' && task) {
      setInputValue(task.text)
      setDueDateText(toDateInputValue(task.dueDate))
      setRecurrenceText(task.recurrence?.description || '')
      setNotes(task.notes || '')
      setEnableNotifications(!!task.notificationIds?.length)
      setReminderOffsetMinutes(task.reminderOffsetMinutes)
    } else {
      setInputValue("")
      setDueDateText("")
      setRecurrenceText("")
      setNotes("")
      setEnableNotifications(false)
      setReminderOffsetMinutes(undefined)
    }
  }, [task, mode])

  useEffect(() => {
    const calcOffset = () => {
      if (typeof window === 'undefined') return
      const viewport = (window as Window & { visualViewport?: VisualViewport }).visualViewport
      if (viewport && typeof viewport.height === 'number') {
        const offset = Math.max(0, window.innerHeight - viewport.height)
        setKeyboardOffset(offset)
      } else {
        setKeyboardOffset(0)
      }
    }
    calcOffset()
    const viewport = (window as Window & { visualViewport?: VisualViewport }).visualViewport
    if (viewport) {
      viewport.addEventListener('resize', calcOffset)
    }
    window.addEventListener('resize', calcOffset)
    return () => {
      if (viewport) {
        viewport.removeEventListener('resize', calcOffset)
      }
      window.removeEventListener('resize', calcOffset)
    }
  }, [])

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    const parsedDue = dueDateText ? new Date(dueDateText) : undefined
    const metadata: Partial<Task> = {
      dueDate: parsedDue,
      recurrence: recurrenceText ? { description: recurrenceText, rrule: recurrenceText } : undefined,
      notes: notes || undefined,
      notificationIds: enableNotifications ? [] : [],
      reminderOffsetMinutes: reminderOffsetMinutes,
      reminderEnabled: enableNotifications,
    }
    const determinedType: 'task' | 'routine' = recurrenceText ? 'routine' : 'task'

    if (mode === 'add') {
      onSubmit?.(inputValue.trim(), determinedType, metadata)
      setInputValue("")
      setDueDateText("")
      setRecurrenceText("")
      setNotes("")
      setEnableNotifications(false)
      setReminderOffsetMinutes(undefined)
    } else if (mode === 'edit' && task) {
      onSave?.(task.id, { text: inputValue.trim(), type: determinedType, ...metadata })
    }

    onOpenChange(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    if (mode === 'add') {
      setInputValue("")
      setRecurrenceText("")
    }
  }

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id)
      onOpenChange(false)
    }
  }

  const title = mode === 'add' ? '' : 'edit task gently'
  const description = mode === 'add' ? '' : 'make changes to your task'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        hideClose={hideClose}
        className={`h-auto ml-2 mr-1 min-h-[60px] ${mode === 'edit' ? 'h-[80vh] max-h-[95vh] px-6 py-6' : 'max-h-[50vh] px-4 py-4'} border-t-0 rounded-t-4xl bg-background/95 backdrop-blur-sm shadow-lg`}
        style={{ paddingBottom: Math.max(16, keyboardOffset + 16) }}
      >
        {mode === 'edit' && (
          <SheetHeader className="pb-4">
            <SheetTitle className="text-left text-lg font-normal">{title}</SheetTitle>
            <p className="text-left text-muted-foreground text-sm">{description}</p>
          </SheetHeader>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder={recurrenceText ? 'morning walk, evening tea...' : 'take a walk, drink water...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pr-12 px-4 py-3 text-base bg-white/50 backdrop-blur-sm rounded-xl transition-all duration-300"
              autoFocus
            />
            <button onClick={handleSubmit} disabled={!inputValue.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 bg-primary text-primary-foreground disabled:opacity-50">enter</button>
          </div>


          <div className="mt-2">
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" className="min-h-[40px] text-sm" />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu open={openMenu === 'due'} onOpenChange={(isOpen) => setOpenMenu(isOpen ? 'due' : null)}>
              <DropdownMenuTrigger asChild>
                <button className="px-3 py-1 rounded-full bg-muted/20 text-sm">{dueDateText || 'no due'}</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-3 w-[220px]">
                <Label htmlFor="due-date-input">Due date</Label>
                <Input id="due-date-input" type="date" value={dueDateText} onChange={(e) => setDueDateText(e.target.value)} />
                <div className="pt-2 flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setDueDateText('')}>Clear</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu open={openMenu === 'recurrence'} onOpenChange={(isOpen) => setOpenMenu(isOpen ? 'recurrence' : null)}>
              <DropdownMenuTrigger asChild>
                <button className="px-3 py-1 rounded-full bg-muted/20 text-sm">{recurrenceText || 'no recurrence'}</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-3 w-[220px]">
                <Label htmlFor="recurrence-input">Recurrence</Label>
                <Input id="recurrence-input" placeholder="every monday, weekly" value={recurrenceText} onChange={(e) => setRecurrenceText(e.target.value)} />
                <div className="pt-2 flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setRecurrenceText('')}>Clear</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {recurrenceText && (
              <DropdownMenu open={openMenu === 'reminder'} onOpenChange={(isOpen) => setOpenMenu(isOpen ? 'reminder' : null)}>
                <DropdownMenuTrigger asChild>
                  <button className="px-3 py-1 rounded-full bg-muted/20 text-sm">{reminderOffsetMinutes ? `${reminderOffsetMinutes}m before` : 'reminder'}</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-3 w-[220px]">
                  <Label>Reminder</Label>
                  <div className="flex flex-col gap-2 mt-2">
                    <button onClick={() => setReminderOffsetMinutes(0)} className="text-sm text-foreground">At time of task</button>
                    <button onClick={() => setReminderOffsetMinutes(10)} className="text-sm text-foreground">10 minutes before</button>
                    <button onClick={() => setReminderOffsetMinutes(30)} className="text-sm text-foreground">30 minutes before</button>
                    <button onClick={() => setReminderOffsetMinutes(60)} className="text-sm text-foreground">1 hour before</button>
                    <button onClick={() => setReminderOffsetMinutes(undefined)} className="text-sm text-muted-foreground">None</button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {recurrenceText && (
                <>
                  <label className="text-sm text-muted-foreground">Enable reminders</label>
                  <Switch checked={enableNotifications} onCheckedChange={setEnableNotifications} />
                </>
              )}
            </div>

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
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  )
}

export default TaskSheet