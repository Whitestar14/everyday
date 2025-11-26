"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task } from '@/types/app';
import { TaskItem } from "@/components/features/tasks/TaskItem";
import { EmptyState } from "@/components/layout/EmptyState";
import { useTaskStore } from "@/stores/tasks";
import { useTasks } from '@/hooks/useTasks'
import { listFadeContainer, taskFade } from "@/utils/animations";
import { useModal } from "@/contexts/ModalContext";

export function InboxPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { getInboxTasks, removeTask, isSelectionMode, selectedTasks, selectTask: storeSelectTask } = useTaskStore();
  const { completeTask, undoTaskCompletion, completingTasks, undoableTasks } = useTasks();
  const { openEditTask } = useModal();

  const inboxTasks = getInboxTasks();

  useEffect(() => {
    // Autofocus the input on mount
    inputRef.current?.focus();
  }, []);

  const handleTaskComplete = (taskId: string) => {
    // For inbox tasks, use the complete flow to allow undo
    completeTask(taskId);
  };

  const handleTaskEdit = (task: Task) => {
    openEditTask(task);
  };

  const handleTaskDelete = (taskId: string) => {
    removeTask(taskId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable task list */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <AnimatePresence>
          {inboxTasks.length === 0 ? (
            <EmptyState
              title="your mind is clear"
              subtitle="that's perfectly okay"
              description="add a task below when you're ready"
            />
          ) : (
            <motion.div className="space-y-2" variants={listFadeContainer} initial="hidden" animate="visible" exit="exit">
              {inboxTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  variants={taskFade}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <TaskItem
                    task={task}
                    isCompleting={completingTasks.has(task.id)}
                    isUndoable={undoableTasks.has(task.id)}
                    allowCompletion={true}
                    onComplete={handleTaskComplete}
                    onUndo={undoTaskCompletion}
                    onEdit={handleTaskEdit}
                    onDelete={handleTaskDelete}
                    index={index}
                    showDate={false}
                    selectionMode={isSelectionMode}
                    isSelected={selectedTasks.has(task.id)}
                    onSelect={(checked) => storeSelectTask(task.id, checked as boolean)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
