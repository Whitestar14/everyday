import React, { type JSX } from 'react';
import { motion } from 'framer-motion';
import { Bell, Repeat, AlertTriangle } from 'lucide-react';
import type { Task, Space, Project } from '@/types/app';

interface TaskMetadataChipsProps {
  task: Task;
  space?: Space;
  project?: Project;
  onEdit?: () => void;
}

const TaskMetadataChips: React.FC<TaskMetadataChipsProps> = ({ task, space, project, onEdit }) => {
  const now = new Date();
  const chips: JSX.Element[] = [];

  // Due date chip
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    const isOverdue = dueDate < now;
    const isToday = dueDate.toDateString() === now.toDateString();
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let text = '';
    let colorClass = '';
    if (isOverdue) {
      text = 'overdue';
      colorClass = 'bg-red-100 text-red-800';
    } else if (isToday) {
      text = 'today';
      colorClass = 'bg-amber-100 text-amber-800';
    } else if (daysDiff === 1) {
      text = 'tomorrow';
      colorClass = 'bg-gray-100 text-gray-800';
    } else {
      text = `in ${daysDiff} days`;
      colorClass = 'bg-gray-100 text-gray-800';
    }
    chips.push(
      <motion.div
        key="due-date"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass} cursor-pointer`}
        onClick={onEdit}
      >
        {text}
      </motion.div>
    );
  }

  // Recurrence chip
  if (task.recurrence) {
    chips.push(
      <motion.div
        key="recurrence"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer"
        onClick={onEdit}
      >
        <Repeat className="w-3 h-3 mr-1" />
        {task.recurrence.description}
      </motion.div>
    );
  }

  // Error chips
  if (task.parsedMetadata?.errors) {
    task.parsedMetadata.errors.forEach((error, index) => {
      chips.push(
        <motion.div
          key={`error-${index}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 + index * 0.1 }}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 cursor-pointer"
          onClick={onEdit}
        >
          <AlertTriangle className="w-3 h-3 mr-1" />
          {error}
        </motion.div>
      );
    });
  }

  // Space/Project badge
  const badgeSpace = project ? space : space;
  const badgeName = project ? project.name : space?.name;
  if (badgeSpace && badgeName) {
    chips.push(
      <motion.div
        key="space-project"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.3 }}
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${badgeSpace.color}-100 text-${badgeSpace.color}-800 cursor-pointer`}
        onClick={onEdit}
      >
        <div className={`w-2 h-2 rounded-full bg-${badgeSpace.color}-500 mr-1`} />
        {badgeName}
      </motion.div>
    );
  }

  // Notification indicator
  if (task.notificationIds && task.notificationIds.length > 0) {
    chips.push(
      <motion.div
        key="notification"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.4 }}
        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 cursor-pointer"
        onClick={onEdit}
      >
        <Bell className="w-3 h-3" />
      </motion.div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {chips}
    </div>
  );
};

export default TaskMetadataChips;