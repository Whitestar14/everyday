import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'loading gently...' }: LoadingStateProps) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <motion.div
                className="text-center space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-4xl font-light text-foreground tracking-tight">everyday</h1>
                <p className="text-muted-foreground text-sm">{message}</p>
            </motion.div>
        </div>
    );
}
