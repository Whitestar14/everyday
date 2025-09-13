// Centralized error handling utilities

export interface AppError {
  message: string
  code?: string
  context?: string
}

export class StorageError extends Error {
  constructor(message: string, context?: string) {
    super(message)
    this.name = 'StorageError'
    this.context = context
  }
  
  context?: string
}

export class ValidationError extends Error {
  constructor(message: string, context?: string) {
    super(message)
    this.name = 'ValidationError'
    this.context = context
  }
  
  context?: string
}

// Error handling utilities
export const handleStorageError = (error: unknown, context: string): AppError => {
  console.warn(`Storage error in ${context}:`, error)
  
  if (error instanceof StorageError) {
    return {
      message: error.message,
      code: 'STORAGE_ERROR',
      context: error.context || context
    }
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      context
    }
  }
  
  return {
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
    context
  }
}

export const handleValidationError = (error: unknown, context: string): AppError => {
  console.warn(`Validation error in ${context}:`, error)
  
  if (error instanceof ValidationError) {
    return {
      message: error.message,
      code: 'VALIDATION_ERROR',
      context: error.context || context
    }
  }
  
  return {
    message: 'Invalid data provided',
    code: 'VALIDATION_ERROR',
    context
  }
}

// Safe localStorage operations
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      throw new StorageError(`Failed to get item from localStorage: ${key}`, 'localStorage.getItem')
    }
  },
  
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      throw new StorageError(`Failed to set item in localStorage: ${key}`, 'localStorage.setItem')
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      throw new StorageError(`Failed to remove item from localStorage: ${key}`, 'localStorage.removeItem')
    }
  }
}

// Validation utilities
export const validateTaskText = (text: string): void => {
  if (!text || typeof text !== 'string') {
    throw new ValidationError('Task text is required', 'validateTaskText')
  }
  
  if (text.trim().length === 0) {
    throw new ValidationError('Task text cannot be empty', 'validateTaskText')
  }
  
  if (text.length > 500) {
    throw new ValidationError('Task text is too long (max 500 characters)', 'validateTaskText')
  }
}

export const validateEnergyLevel = (level: number): void => {
  if (typeof level !== 'number' || level < 1 || level > 5) {
    throw new ValidationError('Energy level must be between 1 and 5', 'validateEnergyLevel')
  }
}

export const validateButtonPosition = (position: string): void => {
  const validPositions = ['bottom-right', 'bottom-left', 'bottom-center']
  if (!validPositions.includes(position)) {
    throw new ValidationError(`Invalid button position: ${position}`, 'validateButtonPosition')
  }
}

export const validateThemeMode = (theme: string): void => {
  const validThemes = ['light', 'dark', 'system']
  if (!validThemes.includes(theme)) {
    throw new ValidationError(`Invalid theme mode: ${theme}`, 'validateThemeMode')
  }
}
