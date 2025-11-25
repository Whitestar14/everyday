import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { extractHighlightFragments } from '@/services/ParsingService';
import type { HighlightFragment } from '@/services/ParsingService';

interface HighlightedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  debounceMs?: number;
  className?: string; // allows reserving space under button (e.g., pr-12)
}

/**
 * Single-line input with a non-interactive overlay underneath that renders
 * padded highlight capsules via pseudo-elements (no width drift).
 */
const HighlightedInput: React.FC<HighlightedInputProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  debounceMs = 140,
  className,
}) => {
  const [fragments, setFragments] = useState<HighlightFragment[]>([]);
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Debounced fragment extraction
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

  // Build overlay content; spans get pseudo-element backgrounds
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

  // Sync horizontal scroll between input and overlay
  useEffect(() => {
    const input = inputRef.current;
    const overlay = overlayRef.current;
    if (!input || !overlay) return;
    const onScroll = () => {
      overlay.scrollLeft = input.scrollLeft;
    };
    input.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      input.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      {/* Overlay below input; text is transparent; highlights appear via pseudo-elements */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{
          font: 'inherit',
          lineHeight: 'inherit',
          letterSpacing: 'inherit',
          color: 'transparent',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Mirror padding on overlay content to match input glyph positions */}
        <div className="px-4 py-3">
          {mirrored}
        </div>
      </div>

      {/* Native input above overlay */}
      <input
        ref={inputRef}
        aria-label="Task text"
        placeholder="e.g., take a walk at 9pm"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit();
          if (e.key === 'Escape') onCancel?.();
        }}
        className={cn(
          'w-full bg-transparent relative z-10',
          'px-4 py-3 text-base rounded-xl',
          // Single-line horizontal scroll
          'whitespace-nowrap overflow-x-auto',
          // Remove Tailwind input ring; wrapper uses focus-within for primary ring
          'focus:outline-none'
        )}
        autoFocus
      />
    </div>
  );
};

export default HighlightedInput;
