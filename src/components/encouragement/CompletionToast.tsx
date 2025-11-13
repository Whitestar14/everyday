import { toast } from "sonner"

// ADHD-friendly celebration messages - warm, not overwhelming
const celebrationMessages = [
  "that's wonderful! ✨",
  "you did it!",
  "gentle progress",
  "that's really great",
  "nicely done",
  "you're doing so well",
  "that's quite an accomplishment",
  "wonderful work",
  "that's beautiful",
  "you should feel proud",
  "that's lovely progress",
  "gentle steps forward",
]

// Get random encouraging message
const getRandomMessage = () => {
  return celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]
}

// Show gentle completion toast
export const showCompletionToast = (taskText?: string) => {
  const message = getRandomMessage()

  toast(message, {
    description: taskText ? `"${taskText}" completed` : undefined,
    duration: 3000,
    className: "border-accent/20 bg-accent/10 text-foreground",
  })
}

// Show daily progress acknowledgment - now only at meaningful milestones
export const showDailyProgress = (completedCount: number) => {
  const milestones = [15, 30, 40]

  if (!milestones.includes(completedCount)) return

  const messages = [
    `you've completed ${completedCount} things today`,
    `${completedCount} gentle accomplishments today`,
    `that's ${completedCount} things done today`,
    `${completedCount} tasks completed with care`,
  ]

  const message = messages[Math.floor(Math.random() * messages.length)]

  toast(message, {
    description: "that's really something to celebrate",
    duration: 4000,
    className: "border-primary/20 bg-primary/10 text-foreground",
  })
}
