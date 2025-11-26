import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import IconPill from './IconPill';
import { Calendar as CalendarIcon, Repeat, Bell } from 'lucide-react';

const REMINDER_OPTIONS = [
    { label: 'At time', value: 0 },
    { label: '10 min before', value: 10 },
    { label: '30 min before', value: 30 },
    { label: '1 hour before', value: 60 },
] as const;

type MenuKey = null | 'due' | 'recurrence' | 'reminder'

interface PillRowProps {
  dueDate?: Date
  setDueDate: (d?: Date) => void
  recurrenceText: string
  setRecurrenceText: (s: string) => void
  reminderOffsetMinutes?: number
  setReminderOffsetMinutes: (m?: number) => void
  openMenu: MenuKey
  setOpenMenu: (k: MenuKey) => void
}

export const PillRow: React.FC<PillRowProps> = ({
    dueDate,
    setDueDate,
    recurrenceText,
    setRecurrenceText,
    reminderOffsetMinutes,
    setReminderOffsetMinutes,
    openMenu,
    setOpenMenu,
}) => {
    const dueValue = dueDate
        ? dueDate.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
        : undefined;
    const recurrenceValue = recurrenceText || undefined;
    const reminderValue = !dueDate
        ? undefined
        : reminderOffsetMinutes === undefined
            ? 'None'
            : `${reminderOffsetMinutes}m before`;

    // Config-driven pills for cleaner rendering
    const pills = [
        {
            key: 'due' as const,
            icon: <CalendarIcon className="h-4 w-4" />,
            label: 'Due',
            value: dueValue,
            state: dueDate ? 'set' : 'none',
            triggerClick: () => setOpenMenu(openMenu === 'due' ? null : 'due'),
            content: (
                <PopoverContent className="w-auto p-3" align="start" sideOffset={8}>
                    <Label className="text-xs">Pick a date</Label>
                    <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(d) => setDueDate(d)}
                        autoFocus
                        fixedWeeks
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" size="sm" onClick={() => setOpenMenu(null)}>
              Done
                        </Button>
                    </div>
                </PopoverContent>
            ),
            wrapper: (trigger: React.ReactNode, content: React.ReactNode) => (
                <Popover
                    open={openMenu === 'due'}
                    onOpenChange={(isOpen) => setOpenMenu(isOpen ? 'due' : null)}
                >
                    <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                    {content}
                </Popover>
            ),
        },
        {
            key: 'recurrence' as const,
            icon: <Repeat className="h-4 w-4" />,
            label: 'Repeats',
            value: recurrenceValue,
            state: recurrenceText ? 'set' : 'none',
            triggerClick: () =>
                setOpenMenu(openMenu === 'recurrence' ? null : 'recurrence'),
            content: (
                <DropdownMenuContent className="w-[300px]">
                    <div className="px-2 py-2">
                        <Label htmlFor="recurrence-input" className="text-xs">
              Recurrence
                        </Label>
                        <input
                            id="recurrence-input"
                            placeholder="every monday, daily, every other week"
                            value={recurrenceText}
                            onChange={(e) => setRecurrenceText(e.target.value)}
                            className="mt-2 h-8 text-sm w-full border rounded px-2"
                        />
                    </div>
                    <DropdownMenuSeparator />
                    {[
                        { label: 'Daily', value: 'daily' },
                        { label: 'Weekly', value: 'weekly' },
                        { label: 'Weekdays', value: 'every weekday' },
                        { label: 'Biweekly Fri', value: 'every other week on friday' },
                    ].map((opt) => (
                        <DropdownMenuItem
                            key={opt.label}
                            onClick={() => {
                                setRecurrenceText(opt.value);
                                setOpenMenu(null);
                            }}
                        >
                            {opt.label}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            setRecurrenceText('');
                            setOpenMenu(null);
                        }}
                    >
            Clear
                    </DropdownMenuItem>
                </DropdownMenuContent>
            ),
            wrapper: (trigger: React.ReactNode, content: React.ReactNode) => (
                <DropdownMenu
                    open={openMenu === 'recurrence'}
                    onOpenChange={(isOpen) => setOpenMenu(isOpen ? 'recurrence' : null)}
                >
                    <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
                    {content}
                </DropdownMenu>
            ),
        },
        {
            key: 'reminder' as const,
            icon: <Bell className="h-4 w-4" />,
            label: 'Reminder',
            value: reminderValue,
            state: !dueDate
                ? ('none' as const)
                : reminderOffsetMinutes === undefined
                    ? ('inferred' as const)
                    : ('set' as const),
            triggerClick: () =>
                setOpenMenu(openMenu === 'reminder' ? null : 'reminder'),
            content: (
                <DropdownMenuContent className="w-[240px]">
                    {!dueDate ? (
                        <div className="px-2 py-2 text-xs text-muted-foreground">
              Set a due date to enable reminders.
                        </div>
                    ) : (
                        <>
                            {REMINDER_OPTIONS.map((opt) => (
                                <DropdownMenuItem
                                    key={opt.value}
                                    onClick={() => {
                                        setReminderOffsetMinutes(opt.value);
                                        setOpenMenu(null);
                                    }}
                                >
                                    {opt.label}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem
                                onClick={() => {
                                    setReminderOffsetMinutes(undefined);
                                    setOpenMenu(null);
                                }}
                            >
                None
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            ),
            wrapper: (trigger: React.ReactNode, content: React.ReactNode) => (
                <DropdownMenu
                    open={openMenu === 'reminder'}
                    onOpenChange={(isOpen) => setOpenMenu(isOpen ? 'reminder' : null)}
                >
                    <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
                    {content}
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 -mx-2 px-2">
            {pills.map(({ key, icon, label, value, state, triggerClick, content, wrapper }) => (
                <React.Fragment key={key}>
                    {wrapper(
                        <IconPill
                            icon={icon}
                            label={label}
                            value={value}
                            state={state as 'none' | 'inferred' | 'set'}
                            onClick={triggerClick}
                        />,
                        content
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default PillRow;
