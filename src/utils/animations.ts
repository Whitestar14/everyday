import { type Variants } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] as const }
  }
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] as const }
  }
}

export const taskSlide: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] as const }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    scale: 0.95,
    transition: { duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] as const }
  }
}

export const completionPulse: Variants = {
  initial: { scale: 1 },
  completing: { 
    scale: [1, 1.02, 1],
    transition: { 
      duration: 0.6, 
      ease: [0.17, 0.67, 0.83, 0.67] as const 
    }
  }
}

export const circleFloat: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}
