# requirements.md - "everyday" Development Plan

## Project Vision
A minimalist task + routine manager that feels like a warm hug for ADHD brains. Every interaction should reduce anxiety, not create it.

## Core User Stories

### Primary User: Sarah, 28, ADHD + Anxiety
- Gets overwhelmed by traditional todo apps with streaks, points, aggressive notifications
- Forgets basic routines (water, meals, meds) when hyperfocused
- Needs gentle reminders, not guilt-inducing alerts
- Values progress over perfection
- Easily distracted by visual clutter

### Secondary User: Marcus, 35, Executive Dysfunction
- Struggles with task initiation and completion
- Benefits from breaking large tasks into tiny steps
- Needs emotional safety in productivity tools
- Prefers consistent, predictable interfaces

## Development Phases

### Phase 1: Foundation (Week 1-2)
**Goal**: Basic task management with warm, gentle UX

#### Features
- [ ] Simple task input with soft animations
- [ ] Task list with gentle hover states
- [ ] Mark complete with satisfying micro-interaction
- [ ] Soft delete with undo option
- [ ] Persistent storage (localStorage)

#### Technical Implementation
- [ ] Zustand store for task state
- [ ] Framer Motion for all interactions
- [ ] shadcn/ui components with warm color palette
- [ ] TypeScript interfaces for Task type
- [ ] Custom hooks for task operations

#### UX Priorities
- **Gentle language**: "add something", "mark as done", "take a rest"
- **Soft animations**: 300ms ease-out transitions
- **Forgiving interactions**: Easy undo, no permanent deletions
- **Immediate feedback**: Optimistic updates, smooth state changes

### Phase 2: Routines (Week 3-4)
**Goal**: Daily routine tracking without streak pressure

#### Features
- [ ] Morning/evening routine templates
- [ ] Gentle routine reminders (not alarms)
- [ ] Progress visualization (encouraging, not judgmental)
- [ ] Flexible scheduling (skip days without guilt)
- [ ] Routine customization

#### Technical Implementation
- [ ] Routine data structure with flexible timing
- [ ] Background notifications (gentle, dismissible)
- [ ] Progress tracking without streaks
- [ ] Routine templates and customization
- [ ] Time-based state management

#### UX Priorities
- **No streak anxiety**: Focus on consistency over perfection
- **Flexible timing**: "around morning" not "8:00 AM sharp"
- **Encouraging feedback**: "you're doing great" not "you missed yesterday"
- **Visual progress**: Soft progress indicators, warm colors

### Phase 3: Gentle Reminders (Week 5-6)
**Goal**: Helpful notifications that don't create anxiety

#### Features
- [ ] Soft notification system
- [ ] Customizable reminder timing
- [ ] Context-aware suggestions
- [ ] Gentle escalation (never aggressive)
- [ ] Easy snooze/dismiss options

#### Technical Implementation
- [ ] Web Notifications API with permission handling
- [ ] Smart timing algorithms
- [ ] Notification queue management
- [ ] User preference storage
- [ ] Graceful degradation for no-permission

#### UX Priorities
- **Soft language**: "gentle reminder" not "OVERDUE TASK"
- **Easy dismissal**: One-click snooze or dismiss
- **Respectful timing**: No notifications during focus time
- **User control**: Easy to disable or customize

### Phase 4: Emotional Intelligence (Week 7-8)
**Goal**: App responds to user's emotional state and energy

#### Features
- [ ] Energy level tracking (simple 1-5 scale)
- [ ] Task suggestions based on energy
- [ ] Gentle encouragement system
- [ ] Rest day recognition
- [ ] Mood-responsive UI themes

#### Technical Implementation
- [ ] Energy state management
- [ ] Intelligent task filtering
- [ ] Encouragement message system
- [ ] Adaptive UI theming
- [ ] Emotional data privacy

#### UX Priorities
- **No judgment**: Low energy days are valid
- **Adaptive suggestions**: Heavy tasks for high energy, light tasks for low
- **Encouraging messages**: Celebrate small wins
- **Visual adaptation**: Softer colors on low energy days

## Technical Architecture

### State Management (Zustand)
```typescript
interface AppState {
  tasks: Task[]
  routines: Routine[]
  userPreferences: UserPrefs
  energyLevel: number
  currentView: 'tasks' | 'routines' | 'settings'
}
```

### Component Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── tasks/           # Task-related components
│   ├── routines/        # Routine-related components
│   ├── animations/      # Framer Motion wrappers
│   └── layout/          # App layout components
├── stores/
│   ├── tasks.ts         # Task state management
│   ├── routines.ts      # Routine state management
│   └── preferences.ts   # User preferences
├── hooks/
│   ├── useTasks.ts      # Task operations
│   ├── useRoutines.ts   # Routine operations
│   └── useAnimations.ts # Animation helpers
└── types/
    ├── task.ts          # Task type definitions
    ├── routine.ts       # Routine type definitions
    └── user.ts          # User preference types
```

### Animation Strategy (Framer Motion)
- **Page transitions**: Soft slide-ins, 400ms duration
- **Component entrance**: Gentle fade-up, 300ms duration
- **Micro-interactions**: Subtle scale/color changes, 200ms duration
- **Loading states**: Gentle pulse animations, never harsh spinners
- **Success feedback**: Soft bounce or glow effects
- **Error states**: Gentle shake, warm error colors

### Data Persistence Strategy
- **Primary**: localStorage for immediate access
- **Backup**: IndexedDB for larger datasets (future)
- **Sync**: Optional cloud sync (Phase 5+)
- **Privacy**: All data stays local by default

## Design System Specifications

### Typography Hierarchy
```css
/* Headings - soft, rounded fonts */
h1: 2rem, font-weight: 300, letter-spacing: -0.02em
h2: 1.5rem, font-weight: 400, letter-spacing: -0.01em
h3: 1.25rem, font-weight: 500

/* Body text - comfortable reading */
body: 1rem, font-weight: 400, line-height: 1.6
small: 0.875rem, font-weight: 400, opacity: 0.8
```

### Spacing System (Tailwind)
- **Micro**: 0.25rem (1) - Icon padding
- **Small**: 0.5rem (2) - Button padding
- **Medium**: 1rem (4) - Component spacing
- **Large**: 1.5rem (6) - Section spacing
- **XL**: 2rem (8) - Page margins

### Animation Timing
```typescript
export const animations = {
  fast: { duration: 0.2, ease: "easeOut" },
  medium: { duration: 0.3, ease: "easeOut" },
  slow: { duration: 0.4, ease: "easeOut" },
  bounce: { type: "spring", damping: 15, stiffness: 300 }
}
```

## User Experience Flow

### First-Time User Journey
1. **Welcome screen**: Gentle introduction, no overwhelming onboarding
2. **Add first task**: Simple, encouraging prompt
3. **Complete first task**: Satisfying animation, gentle celebration
4. **Discover routines**: Soft introduction after 2-3 tasks completed
5. **Customize preferences**: Optional, never forced

### Daily User Flow
1. **Morning check-in**: Optional energy level, routine suggestions
2. **Task management**: Add, complete, gentle reminders throughout day
3. **Evening reflection**: Optional, encouraging progress summary
4. **Flexible adaptation**: App adjusts to user's patterns over time

### Error Recovery Flow
- **Network issues**: Graceful offline mode, sync when reconnected
- **Data loss**: Gentle recovery options, never blame user
- **Overwhelm**: "Take a break" mode, simplified interface
- **Mistakes**: Easy undo for all actions, forgiving interactions

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- [ ] Color contrast ratios ≥ 4.5:1 for normal text
- [ ] Color contrast ratios ≥ 3:1 for large text
- [ ] Keyboard navigation for all interactive elements
- [ ] Screen reader compatibility with proper ARIA labels
- [ ] Focus indicators visible and consistent

### ADHD-Specific Accessibility
- [ ] Reduced motion option for users sensitive to animation
- [ ] High contrast mode for focus difficulties
- [ ] Large touch targets (minimum 44px) for motor difficulties
- [ ] Clear visual hierarchy to reduce cognitive load
- [ ] Consistent interaction patterns throughout app

### Neurodivergent-Friendly Features
- [ ] Customizable notification timing and intensity
- [ ] Option to hide time-based pressure (no visible clocks)
- [ ] Gentle mode for high-anxiety days
- [ ] Predictable navigation patterns
- [ ] Clear undo/redo functionality

## Performance Requirements

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Animation Performance
- **60fps**: All animations must maintain smooth framerate
- **GPU acceleration**: Use transform/opacity for animations
- **Reduced motion**: Respect user's motion preferences
- **Battery consideration**: Pause animations when battery low

### Bundle Size Targets
- **Initial bundle**: < 100KB gzipped
- **Total bundle**: < 300KB gzipped
- **Lazy loading**: Non-critical components loaded on demand
- **Tree shaking**: Remove unused code aggressively

## Testing Strategy

### Unit Testing
- [ ] Task operations (add, complete, delete, undo)
- [ ] Routine scheduling and tracking
- [ ] State management (Zustand stores)
- [ ] Utility functions and helpers

### Integration Testing
- [ ] User workflows (add task → complete → celebrate)
- [ ] Data persistence and recovery
- [ ] Animation sequences and timing
- [ ] Accessibility features

### User Testing with ADHD Community
- [ ] Task completion flows with real users
- [ ] Emotional response to animations and feedback
- [ ] Overwhelm testing (can users handle the interface?)
- [ ] Long-term usage patterns and adaptation

## Success Metrics

### Engagement Metrics (Positive)
- **Daily return rate**: Users coming back consistently
- **Task completion rate**: Users actually finishing tasks
- **Session duration**: Appropriate time spent (not too long)
- **Feature adoption**: Users discovering and using routines

### Wellness Metrics (Primary)
- **Stress reduction**: Self-reported anxiety levels
- **Routine consistency**: Gentle habit formation
- **User satisfaction**: Emotional response to app
- **Accessibility usage**: Features being used by neurodivergent users

### Technical Metrics
- **Performance**: Core Web Vitals staying within targets
- **Error rates**: Minimal crashes or data loss
- **Accessibility**: WCAG compliance maintained
- **Battery usage**: Minimal impact on device performance

## Future Considerations (Phase 5+)

### Advanced Features
- [ ] Gentle social features (optional accountability partners)
- [ ] Smart task suggestions based on patterns
- [ ] Integration with calendar apps (non-intrusive)
- [ ] Voice input for hands-free task addition
- [ ] Wearable device integration for gentle reminders

### Platform Expansion
- [ ] Progressive Web App (PWA) for mobile
- [ ] Desktop app (Electron) for deep work sessions
- [ ] Browser extension for quick task capture
- [ ] API for third-party integrations

### Data Intelligence
- [ ] Pattern recognition for optimal task timing
- [ ] Personalized encouragement messages
- [ ] Energy level prediction based on usage
- [ ] Gentle insights without overwhelming data

## Development Principles

### Code Quality
- **TypeScript strict mode**: Catch errors early
- **Component composition**: Reusable, testable components
- **Custom hooks**: Encapsulate complex logic
- **Error boundaries**: Graceful error handling
- **Performance monitoring**: Track real user metrics

### Team Collaboration
- **Accessibility reviews**: Every feature checked for ADHD-friendliness
- **User feedback loops**: Regular testing with target users
- **Incremental delivery**: Small, frequent improvements
- **Documentation**: Clear, beginner-friendly code comments

### Ethical Considerations
- **Privacy first**: No tracking, no data selling
- **Inclusive design**: Works for all neurodivergent users
- **No dark patterns**: Never manipulate users for engagement
- **Gentle monetization**: If needed, never exploit user vulnerabilities
- **Open source consideration**: Share learnings with community

## Risk Mitigation

### Technical Risks
- **Browser compatibility**: Test across all major browsers
- **Performance degradation**: Monitor and optimize continuously
- **Data loss**: Robust backup and recovery systems
- **Security**: Secure local storage, no sensitive data exposure

### User Experience Risks
- **Feature creep**: Resist adding overwhelming features
- **Accessibility regression**: Continuous accessibility testing
- **Animation overload**: Provide motion reduction options
- **Cognitive overload**: Regular simplification reviews

### Business Risks
- **Niche market**: Focus on quality over quantity
- **Sustainability**: Plan for long-term maintenance
- **Competition**: Differentiate through genuine care for users
- **Scope creep**: Maintain focus on core ADHD-friendly features

---

This requirements document will evolve as we learn more about our users and their needs. The key is maintaining our core principle: every decision should make life easier for ADHD brains, not harder.
