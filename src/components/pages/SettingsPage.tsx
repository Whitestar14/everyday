"use client"

import { useState } from "react"
import { useLocation } from "wouter"
import { motion } from "framer-motion"
import { ArrowLeft, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUser } from "@/hooks/useUser"
import { useTheme } from "next-themes"
import DataService from "@/services/DataService"
import { toast } from "sonner"
import type { ThemeMode } from "@/types/app"

export function SettingsPage() {
  const [, navigate] = useLocation()
  const { preferences, avatar, setName } = useUser()

  const [nameInput, setNameInput] = useState<string>(preferences.name ?? "")

  const { theme, setTheme } = useTheme()

  const [isImportOpen, setIsImportOpen] = useState(false)
  const [importFileName, setImportFileName] = useState<string | null>(null)
  const [importFileContent, setImportFileContent] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background backdrop-blur-sm px-6 py-3 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/today")}
            className="rounded-full"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-tight">Settings</h1>
        </div>
      </header>

      <div className="px-6 py-6 space-y-8">
        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center overflow-hidden ring-2 ring-muted">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-medium text-primary">
                    {preferences.name ? preferences.name.charAt(0).toUpperCase() : ""}
                  </span>
                </div>
              )}
            </div>
            {/* ✅ Controlled input with local state */}
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={() => setName(nameInput)} // commit on blur
              className="text-center text-lg font-medium border-none bg-transparent focus:bg-muted/20 px-0"
              placeholder="Your name"
              aria-label="Your name"
            />
          </div>
        </motion.div>

        {/* Theme Selection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Theme</h3>
            <p className="text-xs text-muted-foreground/70 -mt-1">Choose what’s easiest on your eyes</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setTheme(option.value as ThemeMode)}
                  className={`p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${
                    theme === option.value
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-muted/20 border-muted-foreground/10 hover:bg-muted/30"
                  }`}
                  aria-pressed={theme === option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <option.icon className="w-4 h-4" />
                  <span className="text-xs">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center pt-8 border-t border-muted-foreground/10">
          <p className="text-sm text-muted-foreground">v0.4.2 — Stud.io</p>

          <div className="mt-4 flex flex-col gap-3 items-center">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const data = DataService.exportData()
                  DataService.downloadExport(data)
                  toast.success("Exported data")
                }}
              >
                Export data
              </Button>

              {/* ✅ One-step AlertDialog for import */}
              <AlertDialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Import data</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[480px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Import data</AlertDialogTitle>
                    <AlertDialogDescription>
                      Importing will overwrite your current tasks and preferences. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="mt-4 space-y-3">
                    <Input
                      type="file"
                      className="h-10"
                      accept="application/json"
                      onChange={async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (!file) return
                        setImportFileName(file.name)
                        try {
                          const content = await file.text()
                          setImportFileContent(content)
                        } catch {
                          setImportFileContent(null)
                          toast.error("Failed to read file")
                        }
                      }}
                    />
                    {importFileName && (
                      <div className="text-sm text-muted-foreground">Selected: {importFileName}</div>
                    )}
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={!importFileContent}
                      onClick={async () => {
                        if (!importFileContent) {
                          toast.error("No file selected")
                          return
                        }
                        const res = await DataService.importData(importFileContent)
                        if (res.success) {
                          toast.success("Imported data successfully")
                          setIsImportOpen(false)
                          setImportFileName(null)
                          setImportFileContent(null)
                        } else {
                          toast.error(res.message || "Failed to import data")
                        }
                      }}
                    >
                      Overwrite data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
