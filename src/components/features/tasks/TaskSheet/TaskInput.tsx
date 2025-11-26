import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import HighlightedInput from './HighlightedInput';
import { cn } from '@/lib/utils';

interface TaskInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const isEmpty = !value.trim();

  return (
    // Flex row: input + button side by side
    <div className="flex px-2 items-center gap-2 rounded-xl ring-2 ring-transparent focus-within:ring-primary">
      <HighlightedInput
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        debounceMs={120}
        className="flex-1"
      />
      <Button
        onClick={onSubmit}
        className={cn('h-9 rounded-md px-4', isEmpty && 'opacity-60')}
        aria-label="Add task"
        variant="default"
      >
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default TaskInput;
