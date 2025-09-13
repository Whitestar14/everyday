import { type Variants } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] as const }
  }
}

// Gentle fade for content transitions - no movement, just soft opacity
export const gentleFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.46, 0.45, 0.94] as const 
    }
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

// Softer task animations - reduced movement, gentler timing
export const taskSlide: Variants = {
  hidden: { 
    opacity: 0, 
    y: 8,
    scale: 0.98,
    height: 0,
    marginBottom: 0
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    height: "auto",
    marginBottom: 12,
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      height: { duration: 0.4 },
      marginBottom: { duration: 0.4 }
    }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    scale: 0.98,
    height: 0,
    marginBottom: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      height: { duration: 0.4, delay: 0.1 },
      marginBottom: { duration: 0.4, delay: 0.1 }
    }
  }
}

export const completionPulse: Variants = {
  initial: { scale: 1 },
  completing: { 
    scale: [1, 1.01, 1],
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const 
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

// Gentle task slide animation without scale effects
export const gentleTaskSlide: Variants = {
  hidden: { 
    opacity: 0, 
    y: 8,
    height: 0,
    marginBottom: 0
  },
  visible: { 
    opacity: 1, 
    y: 0,
    height: "auto",
    marginBottom: 12,
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      height: { duration: 0.4 },
      marginBottom: { duration: 0.4 }
    }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    height: 0,
    marginBottom: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      height: { duration: 0.4, delay: 0.1 },
      marginBottom: { duration: 0.4, delay: 0.1 }
    }
  }
}

// Gentle completion animation without scale
export const gentleCompletion: Variants = {
  initial: { opacity: 1 },
  completing: { 
    opacity: [1, 0.8, 1],
    transition: { 
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const 
    }
  }
}