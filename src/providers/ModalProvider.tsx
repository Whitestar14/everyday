'use client';

import { useState, useCallback, type ReactNode } from 'react';
import type { Task } from '@/types/app';
import { ModalContext, type ModalState, type ModalContextType } from '@/contexts/ModalContext';

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modalState, setModalState] = useState<ModalState>({
        editTask: { isOpen: false, task: null },
        addTask: { isOpen: false },
        settings: { isOpen: false },
    });

    const openEditTask = useCallback((task: Task) => {
        setModalState((prev) => ({ ...prev, editTask: { isOpen: true, task } }));
    }, []);

    const closeEditTask = useCallback(() => {
        setModalState((prev) => ({ ...prev, editTask: { isOpen: false, task: null } }));
    }, []);

    const openAddTask = useCallback(() => {
        setModalState((prev) => ({ ...prev, addTask: { isOpen: true } }));
    }, []);

    const closeAddTask = useCallback(() => {
        setModalState((prev) => ({ ...prev, addTask: { isOpen: false } }));
    }, []);

    const openSettings = useCallback(() => {
        setModalState((prev) => ({ ...prev, settings: { isOpen: true } }));
    }, []);

    const closeSettings = useCallback(() => {
        setModalState((prev) => ({ ...prev, settings: { isOpen: false } }));
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

    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}
