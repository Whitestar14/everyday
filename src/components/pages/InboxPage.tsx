"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { TaskItem } from "@/components/features/tasks/TaskItem";
import { EmptyState } from "@/components/layout/EmptyState";
import { useTaskStore } from "@/stores/tasks";
import { parseTaskInput } from "@/services/ParsingService";
import { createRRule } from "@/services/RecurrenceService";
import { gentleTaskSlide } from "@/utils/animations";

export function InboxPage() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getInboxTasks, addTask, removeTask } = useTaskStore();

  const inboxTasks = getInboxTasks();

  useEffect(() => {
    // Autofocus the input on mount
    inputRef.current?.focus();
  }, []);

  const formatDateChip = (date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "tomorrow";
    if (diffDays === -1) return "yesterday";
    if (diffDays > 1) return `in ${diffDays} days`;
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    return date.toLocaleDateString();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const parsed = parseTaskInput(inputValue.trim());

      // Add task with parsed metadata
      addTask(parsed.cleanText, "task", {
        dueDate: parsed.dueDate,
        startDate: parsed.startDate,
        recurrence: parsed.recurrence
          ? createRRule(parsed.recurrence).rule || undefined
          : undefined,
        parsedMetadata: {
          dueDateChip: parsed.dueDate
            ? formatDateChip(parsed.dueDate)
            : undefined,
          recurrenceChip: parsed.recurrence || undefined,
          errors: parsed.errors,
        },
      });

      setInputValue("");
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleTaskComplete = (taskId: string) => {
    // For inbox, completing might move to done or something, but per plan, perhaps just remove or mark complete
    // Assuming complete removes from inbox for now
    removeTask(taskId);
  };

  const handleTaskEdit = (task: any) => {
    // Open edit sheet, but since TaskEditSheet is new, placeholder
    console.log("Edit task", task);
  };

  const handleTaskDelete = (taskId: string) => {
    removeTask(taskId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top-fixed input */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center gap-4">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="What's on your mind?"
            className={`flex-1 transition-all duration-300 ${
              isFocused ? "ring-1 ring-primary" : ""
            }`}
          />
        </div>
      </div>

      {/* Scrollable task list */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {inboxTasks.length === 0 ? (
            <EmptyState
              title="your mind is clear"
              subtitle="that's perfectly okay"
              description="add a task above when you're ready"
            />
          ) : (
            <motion.div className="space-y-2">
              {inboxTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  variants={gentleTaskSlide}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskItem
                    task={task}
                    isCompleting={false}
                    allowCompletion={true}
                    onComplete={handleTaskComplete}
                    onEdit={handleTaskEdit}
                    onDelete={handleTaskDelete}
                    index={index}
                    showDate={false}
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
