"use client"

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import TaskMetadataChips from './TaskMetadataChips'
import { useTaskStore } from '@/stores/tasks'
import { useSpaceStore } from '@/stores/spaces'
import { parseTaskInput } from '@/services/ParsingService'
import { createRRule } from '@/services/RecurrenceService'
import { scheduleNotification, cancelTaskNotifications } from '@/services/NotificationService'
import type { Task } from '@/types/app'

interface TaskEditSheetProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskEditSheet({ task, open, onOpenChange }: TaskEditSheetProps) {
  const updateTaskMetadata = useTaskStore(state => state.updateTaskMetadata)
  const removeTask = useTaskStore(state => state.removeTask)
  const { spaces, projects } = useSpaceStore()

  const [text, setText] = useState('')
  const [dueDateText, setDueDateText] = useState('')
  const [startDateText, setStartDateText] = useState('')
  const [recurrenceText, setRecurrenceText] = useState('')
  const [spaceId, setSpaceId] = useState<string | undefined>()
  const [projectId, setProjectId] = useState<string | undefined>()
  const [notes, setNotes] = useState('')
  const [enableNotifications, setEnableNotifications] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [parsedMetadata, setParsedMetadata] = useState<{
    dueDate?: Date
    startDate?: Date
    recurrence?: string
    errors?: string[]
  }>({})

  useEffect(() => {
    if (task && open) {
      setText(task.text)
      setDueDateText('')
      setStartDateText('')
      setRecurrenceText(task.recurrence?.description || '')
      setSpaceId(task.spaceId)
      setProjectId(task.projectId)
      setNotes(task.notes || '')
      setEnableNotifications(!!task.notificationIds?.length)
      setIsPinned(task.isPinned || false)
      updateParsedMetadata()
    } else if (!open) {
      // Reset on close
      setText('')
      setDueDateText('')
      setStartDateText('')
      setRecurrenceText('')
      setSpaceId(undefined)
      setProjectId(undefined)
      setNotes('')
      setEnableNotifications(false)
      setIsPinned(false)
      setParsedMetadata({})
    }
  }, [task, open])

  const updateParsedMetadata = () => {
    const parsedDue = parseTaskInput(dueDateText || (task?.dueDate ? task.dueDate.toLocaleDateString() : ''))
    const parsedStart = parseTaskInput(startDateText || (task?.startDate ? task.startDate.toLocaleDateString() : ''))
    const recurrenceRule = recurrenceText ? createRRule(recurrenceText) : null
    setParsedMetadata({
      dueDate: parsedDue.dueDate,
      startDate: parsedStart.startDate,
      recurrence: recurrenceRule?.rule?.description,
      errors: [
        ...(parsedDue.errors || []),
        ...(parsedStart.errors || []),
        ...(recurrenceRule?.error ? [recurrenceRule.error] : [])
      ]
    })
  }

  useEffect(() => {
    updateParsedMetadata()
  }, [dueDateText, startDateText, recurrenceText])

  const handleSave = async () => {
    if (!task) return

    const parsedDue = parseTaskInput(dueDateText)
    const parsedStart = parseTaskInput(startDateText)
    const recurrenceRule = recurrenceText ? createRRule(recurrenceText) : null

    const metadata: Partial<Task> = {
      text,
      dueDate: parsedDue.dueDate,
      startDate: parsedStart.startDate,
      recurrence: recurrenceRule?.rule || undefined,
      spaceId,
      projectId,
      notes,
      isPinned,
      parsedMetadata: {
        dueDateChip: parsedDue.dueDate ? `due ${parsedDue.dueDate.toLocaleDateString()}` : undefined,
        recurrenceChip: recurrenceRule?.rule?.description,
        errors: parsedMetadata.errors
      }
    }

    updateTaskMetadata(task.id, metadata)

    // Handle notifications
    if (enableNotifications && (parsedDue.dueDate || recurrenceRule?.rule)) {
      const updatedTask = { ...task, ...metadata }
      const ids = await scheduleNotification(updatedTask)
      updateTaskMetadata(task.id, { notificationIds: ids })
    } else {
      await cancelTaskNotifications(task)
      updateTaskMetadata(task.id, { notificationIds: [] })
    }

    onOpenChange(false)
  }

  const handleDelete = () => {
    if (!task) return
    cancelTaskNotifications(task)
    removeTask(task.id)
    onOpenChange(false)
  }

  const availableProjects = spaceId ? projects.filter(p => p.spaceId === spaceId) : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="text">Task</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              className="min-h-[80px]"
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              value={dueDateText}
              onChange={(e) => setDueDateText(e.target.value)}
              placeholder="tomorrow, next monday"
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              value={startDateText}
              onChange={(e) => setStartDateText(e.target.value)}
              placeholder="starting tomorrow"
            />
          </div>
          <div>
            <Label htmlFor="recurrence">Recurrence</Label>
            <Input
              id="recurrence"
              value={recurrenceText}
              onChange={(e) => setRecurrenceText(e.target.value)}
              placeholder="every monday, daily"
            />
          </div>
          <div>
            <Label htmlFor="space">Space</Label>
            <Select
              value={spaceId || ''}
              onValueChange={(value) => {
                setSpaceId(value || undefined)
                setProjectId(undefined)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select space" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {spaces.map(space => (
                  <SelectItem key={space.id} value={space.id}>
                    {space.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {spaceId && (
            <div>
              <Label htmlFor="project">Project</Label>
              <Select
                value={projectId || ''}
                onValueChange={(value) => setProjectId(value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {availableProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details..."
              className="min-h-[60px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="notifications"
              checked={enableNotifications}
              onCheckedChange={setEnableNotifications}
            />
            <Label htmlFor="notifications">Enable reminders</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="pinned"
              checked={isPinned}
              onCheckedChange={setIsPinned}
            />
            <Label htmlFor="pinned">Pin to Today</Label>
          </div>
          <TaskMetadataChips task={{ ...task, parsedMetadata } as Task} />
        </div>
        <SheetFooter className="flex-col space-y-2">
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="w-full">
            Delete Task
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
