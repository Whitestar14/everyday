import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Settings } from 'lucide-react';
import { fadeIn } from '@/utils/animations';

interface MainHeaderProps {
  greeting: string
}

export function MainHeader({
    greeting
}: MainHeaderProps) {

    const [, navigate] = useLocation();
    return (
        <motion.div
            className="text-center mb-12 relative"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            {/* Profile and Settings buttons */}
            <div className="absolute top-0 right-0">
                <button
                    onClick={() => navigate('/settings')}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Settings className='w-5 h-5' />
                </button>
            </div>

            <h1 className="text-4xl font-serif font-light text-foreground tracking-tight mb-4">
        everyday
            </h1>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-2"
            >
                <p className="text-lg text-muted-foreground text-center">{greeting}</p>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-sm text-muted-foreground/70"
            >
                {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                })}
            </motion.p>
        </motion.div>
    );
}
