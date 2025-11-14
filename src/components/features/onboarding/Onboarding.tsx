import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/stores/user'

type OnboardingStep = 'welcome' | 'name-prompt' | 'name-input' | 'complete'

interface OnboardingProps {
  onComplete: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [nameInput, setNameInput] = useState('')
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showTagline, setShowTagline] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [showNameInput, setShowNameInput] = useState(false)

  const { preferences, setName, completeOnboarding } = useUserStore()

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

  const handleContinueToName = () => {
    setStep('name-prompt')
  }

  const handleNameYes = () => {
    setStep('name-input')
    setTimeout(() => setShowNameInput(true), 300)
  }

  const handleNameSkip = () => {
    setStep('complete')
  }

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      setName(nameInput.trim())
    }
    setStep('complete')
  }

  const handleCompleteContinue = () => {
    completeOnboarding()
    onComplete()
  }

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
            style={{ minHeight: '300px' }}
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
                        onClick={handleContinueToName}
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

        {step === 'name-prompt' && (
          <motion.div
            key="name-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: gentleEase }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: gentleEase, delay: 0.3 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-light text-foreground tracking-tight">
                almost there
              </h1>

              <p className="text-lg text-muted-foreground">
                would you like to add your name? this helps personalize your experience.
              </p>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleNameYes}
                  className="w-full h-12 text-base rounded-xl"
                >
                  yes, let's add my name
                </Button>

                <Button
                  onClick={handleNameSkip}
                  variant="ghost"
                  className="w-full h-12 text-base rounded-xl"
                >
                  skip for now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === 'name-input' && (
          <motion.div
            key="name-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: gentleEase }}
            className="w-full max-w-md"
          >
            <div className="text-center space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: gentleEase }}
                className="text-3xl font-light text-foreground"
              >
                what's your name?
              </motion.h1>

              <AnimatePresence>
                {showNameInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: gentleEase }}
                    className="space-y-4"
                  >
                    <Input
                      placeholder="your name..."
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && nameInput.trim() && handleNameSubmit()}
                      className="text-center text-lg py-4 rounded-xl"
                      autoFocus
                      maxLength={50}
                    />

                    <div className="flex gap-3">
                    <Button
                    onClick={handleNameSubmit}
                    disabled={!nameInput.trim()}
                    className="flex-1 h-10 rounded-xl"
                    >
                    continue
                    </Button>
                    <Button
                    onClick={handleNameSkip}
                    variant="ghost"
                    className="flex-1 h-10 rounded-xl"
                    >
                    skip
                    </Button>
                    </div>

                    <p className="text-xs text-muted-foreground/60">
                      you can always change this later in your profile
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              <div
                className="space-y-3"
              >
                <h1 className="text-4xl font-light text-foreground tracking-tight">
                welcome to everyday<span className='font-serif'>{preferences.name ? `, ${preferences.name}` : ''}</span>
                </h1>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6, ease: gentleEase }}
                className="space-y-2 py-3"
              >
                <p className="text-muted-foreground text-lg">
                take it one gentle step at a time
                </p>
                <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6, ease: gentleEase }}
                className="text-xs text-muted-foreground/70 italic"
                >
                we've got this, together
                </motion.p>
              </motion.div>

              {/* Continue button */}
              <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.4, ease: gentleEase }}
              className="flex justify-center pt-4"
              >
              <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              >
              <Button
              onClick={handleCompleteContinue}
              className="font-normal px-8 py-2 text-base"
              size="lg"
              >
                let's get started
                </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
