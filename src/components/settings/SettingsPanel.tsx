import { motion } from 'framer-motion'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Settings, Sun, Moon, Monitor, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import type { ButtonPosition, ThemeMode } from '@/types/app'

interface SettingsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  buttonPosition: ButtonPosition
  themeMode: ThemeMode
  onButtonPositionChange: (position: ButtonPosition) => void
  onThemeChange: (theme: ThemeMode) => void
  trigger?: React.ReactNode
}

export function SettingsPanel({
  open,
  onOpenChange,
  buttonPosition,
  themeMode,
  onButtonPositionChange,
  onThemeChange,
  trigger
}: SettingsPanelProps) {
  const defaultTrigger = (
    <motion.button 
      className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted/30"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Settings className="w-5 h-5" />
    </motion.button>
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      
      <SheetContent 
        side="bottom" 
        className="h-auto min-h-[380px] max-h-[75vh] border-t-0 rounded-t-2xl bg-background/95 backdrop-blur-sm shadow-lg px-6 py-6"
      >
        {/* Drag Handle */}
        <div className="flex justify-center -mt-2 mb-6">
          <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
        </div>

        <SheetHeader className="pb-6">
          <SheetTitle className="text-left text-lg font-normal">
            settings
          </SheetTitle>
          <p className="text-left text-muted-foreground text-sm">
            make everyday feel just right
          </p>
        </SheetHeader>

        <div className="space-y-6">
          {/* Add Button Position */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">add button position</h3>
            <p className="text-xs text-muted-foreground/70 -mt-1">
              where feels most comfortable?
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'bottom-left', label: 'left', icon: AlignLeft },
                { value: 'bottom-center', label: 'center', icon: AlignCenter },
                { value: 'bottom-right', label: 'right', icon: AlignRight }
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => onButtonPositionChange(option.value as ButtonPosition)}
                  className={`p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${
                    buttonPosition === option.value
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'bg-muted/20 border-muted-foreground/10 hover:bg-muted/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <option.icon className="w-4 h-4" />
                  <span className="text-xs">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">theme</h3>
            <p className="text-xs text-muted-foreground/70 -mt-1">
              choose what's easiest on your eyes
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'light', label: 'light', icon: Sun },
                { value: 'dark', label: 'dark', icon: Moon },
                { value: 'system', label: 'system', icon: Monitor }
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => onThemeChange(option.value as ThemeMode)}
                  className={`p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${
                    themeMode === option.value
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'bg-muted/20 border-muted-foreground/10 hover:bg-muted/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <option.icon className="w-4 h-4" />
                  <span className="text-xs">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-muted-foreground/10">
            <p className="text-xs text-muted-foreground/60">
              changes are saved automatically
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
