import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import type { Task } from "@/types/app";
import { buildTaskFromText } from "@/services/TaskFactory";
import { createRRule } from "@/services/RecurrenceService";
import TaskInput from './TaskSheet/TaskInput'
import PillRow from './TaskSheet/PillRow'
import NotesCollapsible from './TaskSheet/NotesCollapsible'
import TaskSheetFooter from './TaskSheet/Footer'

function useKeyboardSafeBottomPadding() {
  const [paddingBottom, setPaddingBottom] = useState(16);
  useEffect(() => {
    const viewport = (window as Window).visualViewport;
    const update = () => {
      const overlap = viewport ? Math.max(0, window.innerHeight - viewport.height) : 0;
      setPaddingBottom(Math.max(16, overlap + 20));
    };
    update();
    viewport?.addEventListener("resize", update);
    window.addEventListener("resize", update);
    return () => {
      viewport?.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return paddingBottom;
}


type TaskSheetMode = "add" | "edit";

interface TaskSheetProps {
  mode: TaskSheetMode;
  task?: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (text: string, type: "task" | "routine", metadata?: Partial<Task>) => void;
  onSave?: (id: string, metadata: Partial<Task>) => void;
  hideClose?: boolean;
  onDelete?: (id: string) => void;
}

export function TaskSheet({
  mode,
  task,
  open,
  onOpenChange,
  onSubmit,
  onSave,
  hideClose = false,
  onDelete,
}: TaskSheetProps) {
  const safeBottomPadding = useKeyboardSafeBottomPadding();

  const [inputValue, setInputValue] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [recurrenceText, setRecurrenceText] = useState("");
  const [notes, setNotes] = useState("");
  const [reminderOffsetMinutes, setReminderOffsetMinutes] = useState<number | undefined>(10);

  type MenuKey = null | "due" | "recurrence" | "reminder";
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);

  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    if (mode === "edit" && task) {
      setInputValue(task.text);
      setDueDate(task.dueDate);
      setRecurrenceText(task.recurrence?.description || "");
      setNotes(task.notes || "");
      setReminderOffsetMinutes(
        task.reminderOffsetMinutes === undefined ? 10 : task.reminderOffsetMinutes
      );
    }
  }, [task, mode]);

const typingTimeout = useRef<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = window.setTimeout(() => {
      const { metadata } = buildTaskFromText(value);
      setDueDate(metadata.dueDate as Date | undefined);
      setRecurrenceText(metadata.recurrence?.description || "");
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);


  const resetForm = useCallback(() => {
    setInputValue("");
    setDueDate(undefined);
    setRecurrenceText("");
    setNotes("");
    setReminderOffsetMinutes(10);
    setNotesOpen(false);
    setOpenMenu(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;

    const { text: finalText, metadata, type } = buildTaskFromText(inputValue, {
      notes: notes || undefined,
      reminderOffsetMinutes,
    });

    if (dueDate) metadata.dueDate = dueDate;
    if (recurrenceText) {
      const { rule } = createRRule(recurrenceText, { dtstart: metadata.dueDate });
      if (rule) metadata.recurrence = rule;
    }

    const finalType: "task" | "routine" = metadata.recurrence ? "routine" : type;

    if (mode === "add") {
      onSubmit?.(finalText, finalType, metadata);
      resetForm();
    } else if (mode === "edit" && task) {
      onSave?.(task.id, { text: finalText, type: finalType, ...metadata });
      // optional: keep state after edit
    }

    onOpenChange(false);
  }, [inputValue, notes, reminderOffsetMinutes, dueDate, recurrenceText, mode, task, onSubmit, onSave, onOpenChange, resetForm]);

  // Motion helpers
  const fadeIn = { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.18 } };


  return (
<Sheet
  open={open}
  onOpenChange={(o) => { setOpenMenu(null); onOpenChange(o); }}
  modal={false}
>      <SheetContent
        side="bottom"
        hideClose={hideClose}
        className={cn(
          "h-auto ml-2 mr-1 min-h-[60px] border-t-0 rounded-t-3xl bg-background drop-shadow-2xl drop-shadow-accent/80",
          "max-h-[80vh] px-4 py-4"
        )}
        style={{ paddingBottom: safeBottomPadding }}
      >
        {mode === "add" && (
          <SheetHeader className="hidden pb-2">
            <SheetTitle className="text-left text-base font-semibold">Add task</SheetTitle>
          </SheetHeader>
        )}

        {mode === "edit" && (
          <SheetHeader className="pb-2">
            <SheetTitle className="text-left text-base font-semibold">Edit task</SheetTitle>
          </SheetHeader>
        )}

        <motion.div {...fadeIn} className="space-y-4">
          {/* Task input with close-to-keyboard action */}
          <TaskInput
            value={inputValue}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            disabled={!inputValue.trim()}
          />

          <PillRow
            dueDate={dueDate}
            setDueDate={setDueDate}
            recurrenceText={recurrenceText}
            setRecurrenceText={setRecurrenceText}
            reminderOffsetMinutes={reminderOffsetMinutes}
            setReminderOffsetMinutes={setReminderOffsetMinutes}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />

          <NotesCollapsible notes={notes} setNotes={setNotes} notesOpen={notesOpen} setNotesOpen={setNotesOpen} />

          <TaskSheetFooter mode={mode} onDelete={onDelete} taskId={task?.id ?? null} onOpenChange={onOpenChange} />
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

export default TaskSheet;
