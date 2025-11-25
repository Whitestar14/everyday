"use client"

import { useState } from "react"
import { useLocation } from "wouter"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUser } from "@/hooks/useUser"
import { useTheme } from "next-themes"
import type { ThemeMode } from "@/types/app"

export function SettingsPage() {
  const [, navigate] = useLocation()
  const { preferences, avatar, setName, setAvatar } = useUser()

  const [editName, setEditName] = useState<string>(preferences.name ?? '')
  const [editAvatar, setEditAvatar] = useState<string>(avatar ?? '')
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleSaveProfile = () => {
    setName(editName)
    setAvatar(editAvatar)
    setIsEditProfileOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/today')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-normal">settings</h1>
        </div>
      </header>

      <div className="px-6 py-6 space-y-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center overflow-hidden">
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
            <Input
              value={preferences.name ?? ''}
              onChange={(e) => setName(e.target.value)}
              className="text-center text-lg font-medium border-none bg-transparent focus:bg-muted/20 px-0"
              placeholder="Your name"
            />
          </div>

          <div className="flex justify-center">
            <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your avatar and name.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Avatar URL</label>
                    <Input
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >

          {/* Theme Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">theme</h3>
            <p className="text-xs text-muted-foreground/70 -mt-1">choose what's easiest on your eyes</p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "light", label: "light", icon: Sun },
                { value: "dark", label: "dark", icon: Moon },
                { value: "system", label: "system", icon: Monitor },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setTheme(option.value as ThemeMode)}
                  className={`p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${
                    theme === option.value
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-muted/20 border-muted-foreground/10 hover:bg-muted/30"
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
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center pt-8 border-t border-muted-foreground/10"
        >
          <p className="text-xs text-muted-foreground/60">v0.4.2 - Stud.io</p>
        </motion.div>
      </div>
    </div>
  )
}