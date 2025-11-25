import React from "react"
import { motion } from "framer-motion"
import { Bell, Repeat, AlertTriangle, Calendar } from "lucide-react"
import type { Task } from "@/types/app"

interface TaskMetadataChipsProps {
  task: Task
  onEdit?: () => void
}

function formatDueChip(dueDate: Date, now: Date) {
  const isOverdue = dueDate.getTime() < now.getTime()
  const isToday = dueDate.toDateString() === now.toDateString()
  const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (isOverdue) {
    return {
      label: "Overdue",
      classes: "bg-destructive/10 text-destructive",
      icon: <Calendar className="size-3" aria-hidden="true" />
    }
  }
  if (isToday) {
    return {
      label: "Today",
      classes: "bg-warning/10 text-warning",
      icon: <Calendar className="size-3" aria-hidden="true" />
    }
  }
  if (daysDiff === 1) {
    return {
      label: "Tomorrow",
      classes: "bg-muted text-muted-foreground",
      icon: <Calendar className="size-3" aria-hidden="true" />
    }
  }
  return {
    label: `In ${daysDiff} days`,
    classes: "bg-muted text-muted-foreground",
    icon: <Calendar className="size-3" aria-hidden="true" />
  }
}

const chipMotion = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: "easeOut" }
}

const baseChipClasses =
  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium select-none"

const TaskMetadataChips: React.FC<TaskMetadataChipsProps> = ({ task, onEdit }) => {
  const now = new Date()

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {/* Due date chip */}
      {task.dueDate && (
        <motion.button
          type="button"
          {...chipMotion}
          className={`${baseChipClasses} ${formatDueChip(new Date(task.dueDate), now).classes}`}
          onClick={onEdit}
          aria-label="Edit due date"
        >
          {formatDueChip(new Date(task.dueDate), now).icon}
          {formatDueChip(new Date(task.dueDate), now).label}
        </motion.button>
      )}

      {/* Recurrence chip */}
      {task.recurrence && (
        <motion.button
          type="button"
          {...chipMotion}
          transition={{ ...chipMotion.transition, delay: 0.04 }}
          className={`${baseChipClasses} bg-primary/10 text-primary`}
          onClick={onEdit}
          aria-label="Edit recurrence"
        >
          <Repeat className="size-3" aria-hidden="true" />
          {task.recurrence.description}
        </motion.button>
      )}

      {/* Parsing error chips */}
      {task.parsedMetadata?.errors?.map((error, index) => (
        <motion.button
          type="button"
          key={`error-${index}`}
          {...chipMotion}
          transition={{ ...chipMotion.transition, delay: 0.06 + index * 0.04 }}
          className={`${baseChipClasses} bg-warning/10 text-warning`}
          onClick={onEdit}
          aria-label="Edit parsing issue"
          title={error}
        >
          <AlertTriangle className="size-3" aria-hidden="true" />
          {error}
        </motion.button>
      ))}

      {/* Notification chip */}
      {task.notificationIds && task.notificationIds.length > 0 && (
        <motion.button
          type="button"
          {...chipMotion}
          transition={{ ...chipMotion.transition, delay: 0.08 }}
          className={`${baseChipClasses} bg-accent/10 text-accent`}
          onClick={onEdit}
          aria-label="Edit reminder"
          title="Reminder set"
        >
          <Bell className="size-3" aria-hidden="true" />
          Reminder
        </motion.button>
      )}
    </div>
  )
}

export default TaskMetadataChips
