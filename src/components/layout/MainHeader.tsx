import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import { fadeIn } from '@/utils/animations'

interface MainHeaderProps {
  greeting: string
}

export function MainHeader({
  greeting
}: MainHeaderProps) {

  const [, navigate] = useLocation()
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
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
  )
}
