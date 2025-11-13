import { showCompletionToast, showDailyProgress } from '@/components/encouragement/CompletionToast'

export class EncouragementService {
  static async handleTaskCompletion(taskText: string, dailyCount: number): Promise<void> {
    // Show completion toast immediately
    showCompletionToast(taskText)

    // Wait before showing progress
    await this.delay(2500)

    // Show daily progress
    showDailyProgress(dailyCount)
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static getEncouragementMessage(completionCount: number): string {
    if (completionCount === 1) {
      return "great start! 🌱"
    } else if (completionCount < 5) {
      return "you're on a roll! 🌿"
    } else if (completionCount < 10) {
      return "wow, look at you go! 🌞"
    } else {
      return "you're unstoppable! ⚡"
    }
  }

  static shouldShowCelebration(completionCount: number): boolean {
    // Show celebration for milestones
    return completionCount > 0 && (completionCount % 3 === 0 || completionCount >= 5)
  }
}
