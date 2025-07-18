import { motion } from 'framer-motion'
import { Monitor } from 'lucide-react'
import { circleFloat } from '@/utils/animations'

export function DesktopNotSupported() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div 
        className="text-center space-y-6 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6"
          variants={circleFloat}
          animate="animate"
        >
          <Monitor className="w-10 h-10 text-primary/60" />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-light text-foreground tracking-tight">everyday</h1>
          <p className="text-lg text-muted-foreground">designed for mobile minds</p>
          <p className="text-sm text-muted-foreground/70">
            this app is crafted specifically for mobile use, where ADHD brains can focus best
          </p>
          <p className="text-xs text-muted-foreground/60 italic">
            please visit on your phone or tablet
          </p>
        </div>
      </motion.div>
    </div>
  )
}
