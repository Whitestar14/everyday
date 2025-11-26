'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Task } from '@/types/app';

interface ModalState {
  editTask: {
    isOpen: boolean
    task: Task | null
  }
  addTask: {
    isOpen: boolean
  }
  settings: {
    isOpen: boolean
  }
}

interface ModalContextType {
  // Edit Task Modal
  openEditTask: (task: Task) => void
  closeEditTask: () => void
  editTaskState: { isOpen: boolean; task: Task | null }

  // Add Task Modal
  openAddTask: () => void
  closeAddTask: () => void
  addTaskState: { isOpen: boolean }

  // Settings Modal
  openSettings: () => void
  closeSettings: () => void
  settingsState: { isOpen: boolean }
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modalState, setModalState] = useState<ModalState>({
        editTask: { isOpen: false, task: null },
        addTask: { isOpen: false },
        settings: { isOpen: false },
    });

    // Edit Task Modal
    const openEditTask = useCallback((task: Task) => {
        setModalState((prev) => ({
            ...prev,
            editTask: { isOpen: true, task },
        }));
    }, []);

    const closeEditTask = useCallback(() => {
        setModalState((prev) => ({
            ...prev,
            editTask: { isOpen: false, task: null },
        }));
    }, []);

    // Add Task Modal
    const openAddTask = useCallback(() => {
        setModalState((prev) => ({
            ...prev,
            addTask: { isOpen: true },
        }));
    }, []);

    const closeAddTask = useCallback(() => {
        setModalState((prev) => ({
            ...prev,
            addTask: { isOpen: false },
        }));
    }, []);

    // Settings Modal
    const openSettings = useCallback(() => {
        setModalState((prev) => ({
            ...prev,
            settings: { isOpen: true },
        }));
    }, []);

    const closeSettings = useCallback(() => {
        setModalState((prev) => ({
            ...prev,
            settings: { isOpen: false },
        }));
    }, []);

    const value: ModalContextType = {
        openEditTask,
        closeEditTask,
        editTaskState: modalState.editTask,
        openAddTask,
        closeAddTask,
        addTaskState: modalState.addTask,
        openSettings,
        closeSettings,
        settingsState: modalState.settings,
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
};
