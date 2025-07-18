import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserStore } from '@/stores/user'
import { Heart, Sparkles } from 'lucide-react'

const energyLevels = [
  { level: 1, emoji: '🌙', label: 'resting', description: 'gentle tasks only' },
  { level: 2, emoji: '🌱', label: 'low', description: 'small, easy things' },
  { level: 3, emoji: '🌿', label: 'okay', description: 'regular tasks' },
  { level: 4, emoji: '🌞', label: 'good', description: 'ready for more' },
  { level: 5, emoji: '⚡', label: 'energized', description: 'tackle anything' }
]

type OnboardingStep = 'welcome' | 'name' | 'energy' | 'complete'

interface OnboardingProps {
  onComplete: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [nameInput, setNameInput] = useState('')
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showTagline, setShowTagline] = useState(false)
  const [showButton, setShowButton] = useState(false)
  
  const { setName, setEnergyLevel, completeOnboarding } = useUserStore()

  // Orchestrate the welcome sequence with gentler timing
  useEffect(() => {
    if (step === 'welcome') {
      const subtitleTimer = setTimeout(() => setShowSubtitle(true), 2000)
      const taglineTimer = setTimeout(() => setShowTagline(true), 4000)
      const buttonTimer = setTimeout(() => setShowButton(true), 5500)
      
      return () => {
        clearTimeout(subtitleTimer)
        clearTimeout(taglineTimer)
        clearTimeout(buttonTimer)
      }
    }
  }, [step])

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      setName(nameInput)
    }
    setStep('energy')
  }

  const handleEnergySelect = (level: number) => {
    setSelectedEnergy(level)
    setEnergyLevel(level)
  }

  const handleComplete = () => {
    completeOnboarding()
    setStep('complete')
    setTimeout(onComplete, 2000)
  }

  const skipToComplete = () => {
    if (nameInput.trim()) setName(nameInput)
    if (selectedEnergy) setEnergyLevel(selectedEnergy)
    handleComplete()
  }

  // Gentle easing curve for all animations
  const gentleEase = [0.25, 0.46, 0.45, 0.94] as const

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: gentleEase }}
            className="text-center max-w-md"
            style={{ minHeight: '300px' }} // Reserve space to prevent shifts
          >
            {/* Fixed layout container to prevent content jumping */}
            <div className="relative flex flex-col items-center justify-center space-y-8 h-full">
              
              {/* Main welcome text - fixed position in flow */}
              <div className="space-y-4 min-h-[50px] flex flex-col justify-center">
                <motion.h1 
                  className="text-5xl font-light text-foreground tracking-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 1.2,
                    ease: gentleEase,
                    delay: 0.3
                  }}
                >
                  welcome
                </motion.h1>
                
                {/* Reserve space for subtitle to prevent layout shift */}
                <div className="min-h-[30px] flex items-center justify-center">
                  <AnimatePresence>
                    {showSubtitle && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 1.0,
                          ease: gentleEase 
                        }}
                        className="flex items-center justify-center gap-2"
                      >
                        <span className="text-3xl font-light text-foreground">to</span>
                        <span className="text-3xl font-medium font-serif text-foreground">everyday</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Tagline - reserved space */}
              <div className="min-h-[30px] flex flex-col justify-center">
                <AnimatePresence>
                  {showTagline && (
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        ease: gentleEase 
                      }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-sm text-muted-foreground font-medium">
                          built for people with ADHD
                        </p>
                      </div>
                      <motion.p 
                        className="text-xs text-muted-foreground/80 italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: 0.3,
                          ease: gentleEase 
                        }}
                      >
                        gentle, forgiving, and made with care
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Call to action - reserved space */}
              <div className="min-h-[50px] flex flex-col justify-center">
                <AnimatePresence>
                  {showButton && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        ease: gentleEase 
                      }}
                      className="space-y-4"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button 
                          onClick={() => setStep('name')}
                          className="font-normal px-8 py-2 text-base"
                          size="lg"
                        >
                          let's begin gently
                        </Button>
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ 
                          delay: 0.4,
                          duration: 0.6,
                          ease: gentleEase 
                        }}
                        className="text-xs text-muted-foreground/60"
                      >
                        this will only take a moment
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: gentleEase }}
            className="w-full max-w-md"
          >
            <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-light">what should we call you?</CardTitle>
                <CardDescription className="text-sm">
                  you can always change this later
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: gentleEase }}
                >
                  <Input
                    placeholder="your name..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && nameInput.trim() && handleNameSubmit()}
                    className="border-0 bg-muted/50 focus-visible:ring-1 text-center text-lg py-3"
                    autoFocus
                  />
                </motion.div>
                
                <motion.div 
                  className="flex gap-2 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: gentleEase }}
                >
                  <motion.div 
                    className="flex-1"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button 
                      onClick={handleNameSubmit}
                      className="w-full font-normal"
                      disabled={!nameInput.trim()}
                    >
                      continue
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button 
                      variant="ghost" 
                      onClick={() => setStep('energy')}
                      className="font-normal"
                    >
                      skip
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'energy' && (
          <motion.div
            key="energy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: gentleEase }}
            className="w-full max-w-md"
          >
            <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-light">how are you feeling today?</CardTitle>
                <CardDescription className="text-sm">
                  this helps us suggest the right tasks for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div 
                  className="grid grid-cols-5 gap-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: gentleEase }}
                >
                  {energyLevels.map((energy, index) => (
                    <motion.button
                      key={energy.level}
                      onClick={() => handleEnergySelect(energy.level)}
                      className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                        selectedEnergy === energy.level
                          ? 'bg-accent text-accent-foreground shadow-sm scale-105'
                          : 'bg-muted/30 hover:bg-muted/50 hover:scale-102'
                      }`}
                      whileHover={{ scale: selectedEnergy === energy.level ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.4 + index * 0.08,
                        duration: 0.4,
                        ease: gentleEase 
                      }}
                    >
                      <span className="text-2xl mb-1">{energy.emoji}</span>
                      <span className="text-xs font-medium">{energy.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
                
                {/* Reserved space for energy description to prevent layout shift */}
                <div className="flex items-center justify-center">
                  <AnimatePresence>
                    {selectedEnergy && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5, ease: gentleEase }}
                        className="text-center p-3 bg-muted/20 rounded-lg w-full"
                      >
                        <p className="text-sm text-muted-foreground">
                          {energyLevels.find(e => e.level === selectedEnergy)?.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.div 
                  className="flex gap-2 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5, ease: gentleEase }}
                >
                  <motion.div 
                    className="flex-1"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button 
                      onClick={handleComplete}
                      className="w-full font-normal"
                      disabled={!selectedEnergy}
                    >
                      perfect, let's go
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button 
                      variant="ghost" 
                      onClick={skipToComplete}
                      className="font-normal"
                    >
                      skip
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: gentleEase }}
            className="text-center max-w-md"
            style={{ minHeight: '200px' }} // Reserve space
          >
            <div className="flex flex-col items-center justify-center h-full">
              <motion.div
                animate={{ 
                  scale: [1, 1.01, 1],
                  rotate: [0, 0.5, -0.5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="space-y-3"
              >
                <h1 className="text-4xl font-light text-foreground tracking-tight">
                  welcome to everyday{nameInput.trim() ? `, ${nameInput}` : ''}
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <Sparkles className="w-4 h-4 text-accent" />
                  <Heart className="w-5 h-5 text-primary" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6, ease: gentleEase }}
                className="space-y-2"
              >
                <p className="text-muted-foreground text-lg">
                  let's make today gentle
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6, ease: gentleEase }}
                  className="text-xs text-muted-foreground/70 italic"
                >
                  you're going to do great things
                </motion.p>
              </motion.div>

              {/* Subtle loading indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.4, ease: gentleEase }}
                className="flex justify-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 bg-accent rounded-full"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
