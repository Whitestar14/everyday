import { motion } from 'framer-motion';

interface DayDisplayProps {
  day: string
}

export function DayDisplay({ day }: DayDisplayProps) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.6, ease: [0.17, 0.67, 0.83, 0.67] }}
                className="text-center"
            >
                <h1 className="text-6xl font-light text-foreground tracking-tight">
                    {day}
                </h1>
            </motion.div>
        </div>
    );
}
