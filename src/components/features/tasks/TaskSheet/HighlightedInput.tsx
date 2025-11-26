import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { extractHighlightFragments } from '@/services/ParsingService';
import type { HighlightFragment } from '@/services/ParsingService';

interface HighlightedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  debounceMs?: number;
  className?: string;
}

const HighlightedInput: React.FC<HighlightedInputProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  debounceMs = 120,
  className,
}) => {
  const [fragments, setFragments] = useState<HighlightFragment[]>([]);
  const timerRef = useRef<number | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      try {
        setFragments(extractHighlightFragments(value));
      } catch {
        setFragments([]);
      }
    }, debounceMs);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [value, debounceMs]);

  const mirrored = useMemo(() => {
    if (!fragments.length) return value;
    const out: React.ReactNode[] = [];
    let cursor = 0;
    for (let i = 0; i < fragments.length; i++) {
      const f = fragments[i];
      if (cursor < f.start) out.push(value.slice(cursor, f.start));
      out.push(
        <span key={`${f.type}-${i}-${f.start}`} className={cn('hl-box', `hl-${f.type}`)}>
          {value.slice(f.start, f.end)}
        </span>
      );
      cursor = f.end;
    }
    if (cursor < value.length) out.push(value.slice(cursor));
    return out;
  }, [value, fragments]);

  // Sync scrollLeft between textarea and overlay
  useEffect(() => {
    const ta = taRef.current;
    const overlay = overlayRef.current;
    if (!ta || !overlay) return;
    const sync = () => {
      overlay.scrollLeft = ta.scrollLeft;
    };
    ta.addEventListener('scroll', sync, { passive: true });
    return () => ta.removeEventListener('scroll', sync);
  }, []);

  const WORD_SPACING_EM = 0.2;

  return (
    <div className={cn('relative w-full', className)}>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{ font: 'inherit', lineHeight: 'inherit', letterSpacing: 'inherit' }}
      >
        <div
          className="px-4 py-3 text-transparent whitespace-nowrap"
          style={{ wordSpacing: `${WORD_SPACING_EM}em` }}
        >
          {mirrored}
        </div>
      </div>

      {/* Real input */}
      <textarea
        ref={taRef}
        aria-label="Task text"
        placeholder="e.g., take a walk at 9pm"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
          }
          if (e.key === 'Escape') onCancel?.();
        }}
        rows={1}
        className={cn(
          'w-full bg-transparent h-11 relative z-10',
          'px-4 py-3 text-base rounded-xl',
          'resize-none',
          '[white-space:nowrap]',
          '[overflow-x:auto] [overflow-y:hidden]',
          'focus:outline-none'
        )}
        style={{
          font: 'inherit',
          letterSpacing: 'inherit',
          lineHeight: 'inherit',
          wordSpacing: `${WORD_SPACING_EM}em`,
        }}
      />
    </div>
  );
};

export default HighlightedInput;
