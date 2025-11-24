"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { MainHeader } from "@/components/layout/MainHeader";
import { TaskList } from "@/components/features/tasks/TaskList";
import { EmptyState } from "@/components/layout/EmptyState";
import { useModal } from "@/contexts/ModalContext";
import { useUser } from "@/hooks/useUser";
import { useTaskStore } from "@/stores/tasks";
import { useMidnightRefresh } from "@/hooks/useMidnightRefresh";
import type { Task } from "@/types/app";
import { AddTaskButton } from "../features/tasks/AddTaskButton";

export function TodayPage() {
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const { openEditTask } = useModal();
  const { avatar, greeting } = useUser();
  const [, navigate] = useLocation();

  const {
    getTodayTasks,
    completeTask,
    undoTask,
    removeTask,
    completingTasks,
    undoableTasks,
  } = useTaskStore();

  const todayTasks = getTodayTasks();

  // Auto-refresh at midnight
  useMidnightRefresh();

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  const handleUndoTask = (taskId: string) => {
    undoTask(taskId);
  };

  const handleEditTask = (task: Task) => {
    openEditTask(task);
  };

  const handleDeleteTask = (id: string) => {
    removeTask(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header Section with Settings */}
        <MainHeader
          greeting={greeting}
          avatar={avatar}
          showSettingsSheet={showSettingsSheet}
          onShowSettingsSheet={setShowSettingsSheet}
          onProfileClick={() => navigate("/profile")}
        />

        {/* Today Tasks */}
        <AnimatePresence>
          {todayTasks.length > 0 && (
            <TaskList
              tasks={todayTasks}
              completingTasks={completingTasks}
              undoableTasks={undoableTasks}
              onCompleteTask={handleCompleteTask}
              onUndoTask={handleUndoTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onViewAll={() => navigate("/library")}
              onManage={() => navigate("/library")}
              maxTasks={5} // Show all today tasks
            />
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {todayTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EmptyState
                title="Nothing urgent today"
                description="Take a moment to breathe. Your tasks are organized and waiting when you're ready."
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simple footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 pb-20"
        >
          <div className="text-xs text-muted-foreground/40">
            made with ❤️ for ADHD brains
          </div>
        </motion.div>
      </div>

      {/* Quick Add Button - navigates to inbox */}
      <AddTaskButton />
    </div>
  );
}
