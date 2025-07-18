# AGENT.md - Cody Assistant Context for "everyday"

## Project Overview
**App Name:** everyday (lowercase branding)
**Purpose:** A minimalist task + routine manager built specifically for ADHD users
**Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS + Zustand + Framer Motion

## Core Identity & Design Philosophy

### Brand Values
- **Lowercase styling:** Reinforces gentle, non-judgmental vibe
- **Warm & cozy:** Welcoming visual style that feels safe
- **Soft animations:** Using Framer Motion for emotional tone, not just flair
- **Cognitive friction reduction:** Every design choice prioritizes neurodivergent users

### Visual Design Principles
- **NO harsh lines, sharp corners, or aggressive UX metaphors**
- **NO "productivity bro" vibes or overwhelming gamification**
- **YES to soft animations that subtly guide attention**
- **YES to round fonts, warm color palette, minimal UI clutter**
- **YES to emotional safety through design**

## Target Users
- People with ADHD, anxiety, or executive dysfunction
- Users overwhelmed by traditional todo lists
- Neurodivergent individuals alienated by typical planner apps
- Those who forget basic routines and need gentle consistency support

## Technical Stack Details

### Dependencies Available
- **React 19.1.0** - Latest React with concurrent features
- **Framer Motion 12.23.6** - For soft, purposeful animations
- **Tailwind CSS 4.1.11** - Utility-first styling (configured via Vite plugin)
- **Zustand 5.0.6** - Lightweight state management
- **Lucide React 0.525.0** - Clean, consistent icons
- **Tailwind Variants 1.0.0** - Component variant management
- **clsx 2.1.1** - Conditional className utility
- **Pnpm 9.8.1** - Dependencies management

### Development Environment
- **Vite 7.0.4** - Fast build tool and dev server
- **TypeScript 5.8.3** - Type safety
- **ESLint** - Code quality with React-specific rules

## Feature Priorities

### Core Features (Focus on consistency, not perfection)
1. **Task Management** - Simple, non-overwhelming task tracking
2. **Routine Tracking** - Daily habits without streak pressure
3. **Gentle Reminders** - Soft notifications, not aggressive alerts
4. **Progress Visualization** - Encouraging, not judgmental metrics

### UX Principles
- **Minimal cognitive load** - Few decisions, clear hierarchy
- **Forgiving interactions** - Easy to undo, no punishment for "failure"
- **Consistent patterns** - Predictable navigation and actions
- **Accessible design** - High contrast options, clear focus states

## Animation Guidelines (Framer Motion)
- **Subtle entrance animations** - Gentle fade-ins, soft slides
- **Micro-interactions** - Hover states, button presses feel responsive
- **Transition smoothness** - No jarring movements or sudden changes
- **Purposeful motion** - Guide attention, provide feedback, create comfort

## Color & Typography Strategy
- **Warm palette** - Earth tones, soft pastels, avoid stark whites/blacks
- **Round typography** - Friendly, approachable font choices
- **Generous spacing** - Breathing room prevents overwhelm
- **Soft shadows** - Depth without harshness

## State Management Approach (Zustand)
- **Simple stores** - Avoid complex nested state
- **Persistent data** - Tasks and routines survive page refreshes
- **Optimistic updates** - Immediate feedback, sync in background
- **Error handling** - Graceful degradation, never lose user data

## Development Guidelines

### Component Structure
- Use functional components with hooks
- Leverage Tailwind Variants for consistent styling
- Implement Framer Motion for all interactive elements
- Ensure TypeScript strict mode compliance

### Accessibility Requirements
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Performance Considerations
- Lazy load non-critical components
- Optimize Framer Motion animations for 60fps
- Use Zustand selectors to prevent unnecessary re-renders
- Implement proper error boundaries

## File Structure Expectations
```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── stores/             # Zustand stores
├── hooks/              # Custom React hooks
├── utils/              # Helper functions
├── types/              # TypeScript definitions
└── styles/             # Global styles (if needed beyond Tailwind)
```

## Key Reminders for Development
1. **Always prioritize user emotional safety over efficiency**
2. **Test with neurodivergent users in mind - what feels overwhelming?**
3. **Use soft, encouraging language in all UI text**
4. **Implement gentle error states - never blame the user**
5. **Make success celebrations subtle but meaningful**
6. **Ensure all interactions feel forgiving and reversible**

## Questions to Ask Before Implementing Features
- Does this add cognitive load?
- Will this overwhelm an ADHD user?
- Is the interaction pattern predictable?
- Does this feel warm and welcoming?
- Can users easily undo this action?
