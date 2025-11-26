import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type PillState = 'none' | 'inferred' | 'set'

function pillClasses(state: PillState) {
    switch (state) {
    case 'none':
        return 'border-muted bg-muted/20 text-muted-foreground';
    case 'inferred':
        return 'border-sky-500/20 bg-sky-100/20 text-sky-800 dark:bg-sky-900/20 dark:text-sky-400';
    case 'set':
        return 'border-accent/20 bg-accent/20 text-accent';
    default:
        return '';
    }
}

export const IconPill = forwardRef<
  HTMLButtonElement,
  {
    icon: React.ReactNode
    label: string
    value?: string
    state?: PillState
    onClick?: () => void
    className?: string
        }
        >(({ icon, label, value, state = 'none', onClick, className }, ref) => {
            const base = pillClasses(state);
            const isActive = state !== 'none' && !!value;

            return (
                <button
                    ref={ref}
                    type="button"
                    className={cn(
                        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border shadow-xs border-input/50',
                        isActive ? 'px-3 text-sm gap-2' : 'w-9 px-0 text-xs',
                        base,
                        className,
                    )}
                    onClick={onClick}
                >
                    {icon}
                    {isActive && (
                        <>
                            <span className="font-medium">{label}:</span>
                            <span>{value}</span>
                        </>
                    )}
                </button>
            );
        });
IconPill.displayName = 'IconPill';

export default IconPill;
