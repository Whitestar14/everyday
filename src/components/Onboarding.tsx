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

  // Orchestrate the welcome sequence
  useEffect(() => {
    if (step === 'welcome') {
      const subtitleTimer = setTimeout(() => setShowSubtitle(true), 1500)
      const taglineTimer = setTimeout(() => setShowTagline(true), 2500)
      const buttonTimer = setTimeout(() => setShowButton(true), 3500)
      
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
    setTimeout(onComplete, 2000) // Slightly longer to enjoy the moment
  }

  const skipToComplete = () => {
    if (nameInput.trim()) setName(nameInput)
    if (selectedEnergy) setEnergyLevel(selectedEnergy)
    handleComplete()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.17, 0.67, 0.83, 0.67] }}
            className="text-center space-y-8 max-w-md"
          >
            {/* Main welcome text with staggered animation */}
            <div className="space-y-2">
              <motion.h1 
                className="text-5xl font-light text-foreground tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.17, 0.67, 0.83, 0.67] }}
              >
                welcome
              </motion.h1>
              
              <AnimatePresence>
                {showSubtitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.17, 0.67, 0.83, 0.67] }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="text-3xl font-light text-foreground">to</span>
                    <span className="text-3xl font-medium text-foreground">everyday</span>
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                    >
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tagline */}
            <AnimatePresence>
              {showTagline && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.17, 0.67, 0.83, 0.67] }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      built for people with ADHD
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground/80 italic">
                    gentle, forgiving, and made with care
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Call to action */}
            <AnimatePresence>
              {showButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.17, 0.67, 0.83, 0.67] }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="text-xs text-muted-foreground/60 mt-3"
                  >
                    this will only take a moment
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] }}
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
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
                  transition={{ delay: 0.4, duration: 0.4 }}
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
            transition={{ duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] }}
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
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
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                    >
                      <span className="text-2xl mb-1">{energy.emoji}</span>
                      <span className="text-xs font-medium">{energy.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
                
                <AnimatePresence>
                  {selectedEnergy && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center p-3 bg-muted/20 rounded-lg"
                    >
                      <p className="text-sm text-muted-foreground">
                        {energyLevels.find(e => e.level === selectedEnergy)?.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div 
                  className="flex gap-2 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.17, 0.67, 0.83, 0.67] }}
            className="text-center space-y-6 max-w-md"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.02, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ 
                duration: 3,
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
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-2"
            >
              <p className="text-muted-foreground text-lg">
                let's make today gentle
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-xs text-muted-foreground/70 italic"
              >
                you're going to do great things
              </motion.p>
            </motion.div>

            {/* Subtle loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.3 }}
              className="flex justify-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 bg-accent rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
