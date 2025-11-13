export class UserService {
  static validateName(name: string): void {
    if (!name || typeof name !== 'string') {
      throw new Error('Name must be a string')
    }

    const trimmed = name.trim()
    if (trimmed.length === 0) {
      throw new Error('Name cannot be empty')
    }

    if (trimmed.length > 50) {
      throw new Error('Name cannot exceed 50 characters')
    }
  }

  static generateGreeting(name?: string): string {
    const hour = new Date().getHours()

    let timeGreeting = 'hello'
    if (hour < 12) timeGreeting = 'good morning'
    else if (hour < 17) timeGreeting = 'good afternoon'
    else timeGreeting = 'good evening'

    return name ? `${timeGreeting}, ${name}` : timeGreeting
  }

  static shouldShowOnboarding(hasCompletedOnboarding: boolean): boolean {
    return !hasCompletedOnboarding
  }

  static getCurrentDay(): string {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' })
  }
}
