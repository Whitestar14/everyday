import { motion } from "framer-motion";
import { fadeIn, circleFloat } from "@/utils/animations";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export function EmptyState({
  title = "nothing to track right now",
  subtitle = "that's perfectly okay",
  description = "tap the + button below when you're ready",
}: EmptyStateProps) {
  return (
    <motion.div
      className="text-center py-16"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeIn}
    >
      <motion.div
        className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6"
        variants={circleFloat}
        animate="animate"
      >
        <div className="w-8 h-8 rounded-full bg-primary/20" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3 className="text-xl font-light text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
        {description && (
          <p className="text-xs text-pretty text-muted-foreground/60">
            {description}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
