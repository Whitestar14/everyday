import { createContext, useContext } from 'react';
import type { Task } from '@/types/app';

export interface ModalState {
    editTask: { isOpen: boolean; task: Task | null }
    addTask: { isOpen: boolean }
    settings: { isOpen: boolean }
}

export interface ModalContextType {
    openEditTask: (task: Task) => void
    closeEditTask: () => void
    editTaskState: { isOpen: boolean; task: Task | null }

    openAddTask: () => void
    closeAddTask: () => void
    addTaskState: { isOpen: boolean }

    openSettings: () => void
    closeSettings: () => void
    settingsState: { isOpen: boolean }
}

export const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
};
