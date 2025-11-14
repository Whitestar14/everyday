import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Edit3, Check, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/hooks/useUser"
import { fadeIn } from "@/utils/animations"

const AVATAR_OPTIONS = [
  "👤", "👨", "👩", "🧑", "👨‍💻", "👩‍💻", "🧑‍💻", "👨‍🎨", "👩‍🎨", "🧑‍🎨",
  "🌟", "⭐", "✨", "💫", "🌙", "☀️", "🌈", "🌸", "🌺", "🌻",
  "🐱", "🐶", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"
]

interface ProfilePageProps {
  onBack: () => void
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const { preferences, setName, setAvatar } = useUser()
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(preferences.name || "")
  const [selectedAvatar, setSelectedAvatar] = useState(preferences.avatar)
  const [showAvatarGrid, setShowAvatarGrid] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleNameSave = () => {
    if (nameInput.trim()) {
      setName(nameInput.trim())
      setIsEditingName(false)
    }
  }

  const handleNameCancel = () => {
    setNameInput(preferences.name || "")
    setIsEditingName(false)
  }

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar)
    setAvatar(avatar)
    setShowAvatarGrid(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string

        // Compress image if needed
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          // Max dimensions: 200x200
          const maxSize = 200
          let { width, height } = img

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height

          ctx?.drawImage(img, 0, 0, width, height)

          const compressedImageUrl = canvas.toDataURL('image/jpeg', 0.8)
          setSelectedAvatar(compressedImageUrl)
          setAvatar(compressedImageUrl)
          setShowAvatarGrid(false)
        }
        img.src = imageUrl
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="max-w-md mx-auto px-4 py-8 h-full flex flex-col">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">back</span>
          </button>

          <h1 className="text-2xl font-light text-foreground">your profile</h1>

          <div className="w-16" /> {/* Spacer for centering */}
        </motion.div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {/* Avatar Section */}
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto bg-muted/30 rounded-full flex items-center justify-center text-3xl mb-3 overflow-hidden">
                  {selectedAvatar.startsWith('data:') || selectedAvatar.startsWith('http') ? (
                    <img src={selectedAvatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="leading-none">{selectedAvatar}</span>
                  )}
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setShowAvatarGrid(!showAvatarGrid)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showAvatarGrid ? 'cancel' : 'choose emoji'}
                  </button>
                  <button
                    onClick={handleUploadClick}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    upload photo
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Avatar Grid - Progressive Disclosure */}
              {showAvatarGrid && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="mb-6"
                >
                  <div className="grid grid-cols-6 gap-2 max-w-sm mx-auto">
                    {AVATAR_OPTIONS.map((avatar) => (
                      <motion.button
                        key={avatar}
                        onClick={() => handleAvatarSelect(avatar)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all duration-200 ${
                          selectedAvatar === avatar
                            ? "bg-accent text-accent-foreground scale-110"
                            : "bg-muted/30 hover:bg-muted/50"
                        }`}
                      >
                        {avatar}
                      </motion.button>
                    ))}
                    {/* Show current uploaded image as an option */}
                    {selectedAvatar.startsWith('data:') && (
                      <motion.button
                        onClick={() => handleAvatarSelect(selectedAvatar)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-200 bg-accent text-accent-foreground scale-110 overflow-hidden border-2 border-accent-foreground/20"
                      >
                        <img src={selectedAvatar} alt="Current" className="w-full h-full object-cover rounded-full" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Name Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">your name</span>
                {!isEditingName && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    edit
                  </button>
                )}
              </div>

              {isEditingName ? (
                <div className="space-y-3">
                  <Input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="enter your name..."
                    className="w-full px-4 py-3 text-base bg-white/50 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/40 rounded-xl transition-all duration-300"
                    maxLength={50}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleNameSave}
                      disabled={!nameInput.trim()}
                      size="sm"
                      className="flex-1 h-9 rounded-lg"
                    >
                      <Check className="w-3 h-3" />
                      save
                    </Button>
                    <Button
                      onClick={handleNameCancel}
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-9 rounded-lg"
                    >
                      <X className="w-3 h-3" />
                      cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 bg-muted/30 rounded-xl">
                  <p className="text-base text-foreground">
                    {preferences.name || "no name set"}
                  </p>
                </div>
              )}

              {!isEditingName && (
                <p className="text-xs text-muted-foreground/60 mt-2">
                  {preferences.name ? 'tap edit to change your name' : 'set a name to personalize your experience'}
                </p>
              )}
            </div>

            {/* Stats Section - Minimal */}
            <div className="pt-4 border-t border-border/50">
              <h3 className="text-lg font-light text-foreground mb-4">your journey</h3>
              <div className="text-center p-4 bg-muted/30 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  stats coming soon...
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
