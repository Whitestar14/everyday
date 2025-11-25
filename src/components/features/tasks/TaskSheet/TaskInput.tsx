import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import HighlightedInput from './HighlightedInput';
import { cn } from '@/lib/utils';

interface TaskInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    <div className="flex items-center gap-2">
      {/* Focus ring around input area via focus-within */}
      <div className="flex-1 relative rounded-xl ring-2 ring-transparent focus-within:ring-primary">
        <HighlightedInput
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
          debounceMs={140}
          // Reserve space on the right under the button (matches button width)
          className="pr-12"
        />
        {/* Absolutely positioned button that visually sits over reserved space */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button
            onClick={onSubmit}
            className={cn('h-9 rounded-md px-4', isEmpty && 'opacity-60')}
            aria-label="Add task"
            variant="default"
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskInput;
