import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Settings, Sun, Moon, Palette } from 'lucide-react'
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
    <button className="text-muted-foreground hover:text-foreground transition-colors">
      <Settings className="w-5 h-5" />
    </button>
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">settings</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          {/* Button Position */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">add button position</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'bottom-left', label: 'left' },
                { value: 'bottom-center', label: 'center' },
                { value: 'bottom-right', label: 'right' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onButtonPositionChange(option.value as ButtonPosition)}
                  className={`p-3 rounded-xl border transition-all ${
                    buttonPosition === option.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/30 border-muted-foreground/20 hover:bg-muted/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">theme</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'light', label: 'light', icon: Sun },
                { value: 'dark', label: 'dark', icon: Moon },
                { value: 'system', label: 'system', icon: Palette }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onThemeChange(option.value as ThemeMode)}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    themeMode === option.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/30 border-muted-foreground/20 hover:bg-muted/50'
                  }`}
                >
                  <option.icon className="w-4 h-4" />
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
