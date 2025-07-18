# requirements.md - "everyday" Development Plan

## Project Vision
A minimalist task manager that feels like a warm hug for ADHD brains. Every interaction should reduce anxiety, not create it.

## Core User
Sarah, 28, ADHD + Anxiety
- Gets overwhelmed by traditional todo apps
- Needs gentle reminders, not guilt-inducing alerts
- Values progress over perfection
- Easily distracted by visual clutter

## Development Phases

### Phase 1: Foundation ✅ COMPLETE
**Goal**: Basic task management with warm, gentle UX

#### Features
- [x] Simple task input with soft styling
- [x] Task list with gentle hover states
- [x] Mark complete with satisfying micro-interaction
- [x] Persistent storage (localStorage)
- [x] Basic Framer Motion animations

### Phase 2: Emotional Intelligence & Onboarding ✅ COMPLETE
**Goal**: Make the app feel personally welcoming and emotionally supportive

#### Features - Onboarding ✅ COMPLETE
- [x] **Gentle welcome sequence** - "welcome" → "to everyday" with sparkles
- [x] **ADHD-friendly messaging** - "built for people with ADHD" with hearts
- [x] **Name collection** - "what should we call you?" with soft input
- [x] **Energy level setup** - 1-5 scale with emoji indicators and descriptions
- [x] **Smooth transitions** - Staggered animations, backdrop blur cards
- [x] **Skip options** - Everything can be bypassed without pressure
- [x] **Encouraging completion** - "you're going to do great things"

#### Features - Daily Experience ✅ COMPLETE
- [x] **Day display on every load** - Always show current day before app interface
- [x] **Gentle app transition** - Day → greeting → main interface
- [x] **Personalized greeting** - Time-aware greetings with user's name
- [x] **Persistent personalization** - User preferences stored locally
- [x] **Warm loading states** - "loading gently..." instead of harsh spinners

### Phase 3: Enhanced UX & Settings ✅ COMPLETE
**Goal**: Polished interface with user customization

#### Features - Interface Polish ✅ COMPLETE
- [x] **Signature circles identity** - Consistent circular elements throughout app
  - Circle checkboxes for tasks (brand recognition)
  - Floating circles in empty states
  - Gentle circle animations for visual interest
- [x] **shadcn Sheet components** - Professional bottom sheets for panels
  - Smooth slide-up animations
  - Proper backdrop handling
  - Native mobile feel
- [x] **Mobile-first design** - Desktop limitation with gentle messaging
- [x] **Task overflow management** - Main page shows 3 tasks, dedicated Tasks page
- [x] **Clean navigation** - Intuitive back buttons and page transitions

#### Features - User Settings ✅ COMPLETE
- [x] **Add button positioning** - Left, center, right options
  - Persistent localStorage storage
  - Immediate visual feedback
  - Accessible from both main and tasks pages
- [x] **Theme control** - Light, dark, system preference
  - Automatic system detection
  - Smooth theme transitions
  - Persistent user preference
- [x] **Settings accessibility** - Easy-to-find settings icon in headers
  - Consistent placement across pages
  - Clear visual hierarchy in settings panel

#### Technical Implementation ✅ COMPLETE
- [x] Enhanced state management for settings
- [x] localStorage persistence for user preferences
- [x] Responsive design with mobile detection
- [x] Theme system with CSS class management
- [x] shadcn Sheet integration for polished UX

### Phase 4: Code Architecture & Maintainability ✅ COMPLETE
**Goal**: Clean, scalable, maintainable codebase

#### Features - Modularization ✅ COMPLETE
- [x] **Component separation** - Logical component breakdown
  - Layout components (headers, empty states, loading)
  - Page components (MainPage, TasksPage)
  - Task components (TaskItem, TaskList, AddTaskSheet)
  - Settings components (SettingsPanel)
- [x] **Custom hooks** - Reusable logic extraction
  - useSettings for theme and button positioning
  - useMobile for responsive behavior
  - Clean separation of concerns
- [x] **Type definitions** - Comprehensive TypeScript interfaces
  - AppState, ViewMode, ButtonPosition, ThemeMode
  - Proper type safety throughout application
- [x] **Utility organization** - Centralized animations and helpers
  - All Framer Motion variants in utils/animations.ts
  - Consistent animation timing and easing
- [x] **Clean architecture** - Maintainable file structure
  - Clear folder organization
  - Single responsibility principle
  - Easy to test and extend

#### Technical Benefits ✅ COMPLETE
- [x] **Maintainable codebase** - Easy to find and modify features
- [x] **Testable components** - Each component can be tested in isolation
- [x] **Scalable architecture** - Easy to add new features
- [x] **Type safety** - Comprehensive TypeScript coverage
- [x] **Reusable components** - DRY principle throughout

### Phase 5: Encouragement System 🔄 NEXT FOCUS
**Goal**: Make every interaction feel encouraging and supportive

#### Features - Completion Celebrations 📋 NEXT UP
- [ ] **Gentle toast notifications** - Warm messages after task completion
  - "that's wonderful!" "you did it!" "gentle progress" 
  - Soft slide-in from top, auto-dismiss after 3 seconds
  - Random selection from encouraging message pool
  - Component: `<CompletionToast />` with Framer Motion
- [ ] **Progress acknowledgment** - Daily completion summary
  - "you've completed 3 things today" in soft card
  - Appears after 2+ completions, dismissible
  - Warm colors, gentle fade-in animation
  - Component: `<DailyProgress />` with localStorage tracking
- [ ] **Energy-based suggestions** - Smart task recommendations
  - "feeling low energy? try something gentle"
  - Based on current energy level from onboarding
  - Appears in empty state or as gentle prompt
  - Component: `<EnergySuggestions />` with contextual tips

#### Features - Daily Check-ins 📋 PLANNED
- [ ] **Optional energy check-in** - "how are you feeling today?"
  - Appears for returning users, easily dismissible
  - Same 5-level emoji system from onboarding
  - Updates suggestions and task filtering
  - Component: `<EnergyCheckIn />` with gentle animations
- [ ] **Gentle reminders** - Soft notifications for self-care
  - "remember to drink water" "time for a gentle break"
  - Browser notifications (with permission)
  - Respectful timing, easy to disable
  - Hook: `useGentleReminders()` with Web Notifications API

#### Technical Implementation - Encouragement 📋 NEXT SPRINT
- [ ] **Completion tracking store** - Track daily completions
  - Zustand store for completion statistics
  - localStorage persistence for daily/weekly data
  - Privacy-first approach (no external tracking)
- [ ] **Toast notification system** - Gentle celebration messages
  - Custom toast component with warm styling
  - Message pool with ADHD-friendly language
  - Proper accessibility and screen reader support
- [ ] **Suggestion engine** - Context-aware recommendations
  - Energy level-based task suggestions
  - Time-of-day appropriate recommendations
  - Gentle, never pushy or overwhelming

### Phase 6: Gentle Routines 📋 FUTURE
**Goal**: Daily routine tracking without streak pressure

#### Features
- [ ] Morning/evening routine templates
- [ ] Gentle routine reminders (not alarms)
- [ ] Progress visualization (encouraging, not judgmental)
- [ ] Flexible scheduling (skip days without guilt)
- [ ] Routine customization based on energy level

## Current Status Summary

### ✅ What's Working Beautifully
- **Complete onboarding flow** - Warm welcome → name → energy → celebration
- **Daily mindfulness ritual** - Day display on every app load
- **Task management** - Add, complete, persist with satisfying animations
- **Personalization** - User name, energy level, time-aware greetings
- **Signature circles identity** - Consistent circular elements create brand recognition
- **Professional UX** - shadcn sheets, smooth animations, mobile-native feel
- **User customization** - Button positioning, theme control, persistent settings
- **Clean architecture** - Modular components, custom hooks, type safety
- **Mobile-first approach** - Desktop limitation with gentle explanation
- **Maintainable codebase** - Easy to extend and modify

### 🔄 Currently Building
- **Encouragement system** - Completion celebrations and progress acknowledgment
- **Smart suggestions** - Energy-based and time-based task recommendations

### 📋 Next Sprint Priorities
1. **Gentle toast notifications** - Warm messages after task completion
   - Create `CompletionToast` component with message pool
   - Integrate with task completion flow
   - Test accessibility and timing
2. **Daily completion summary** - "you've completed X things today"
   - Create `DailyProgress` component with localStorage tracking
   - Show after 2+ completions, make dismissible
   - Warm colors and gentle animations
3. **Energy-based suggestions** - Smart task recommendations
   - Create `EnergySuggestions` component
   - Integrate with energy level from onboarding
   - Context-aware suggestions (time of day, energy level)
4. **Optional daily check-in** - "how are you feeling?" for returning users
   - Create `EnergyCheckIn` component
   - Same emoji system as onboarding
   - Easy to dismiss, updates suggestions

### 🎯 Success Metrics So Far
- ✅ Onboarding feels welcoming, not overwhelming
- ✅ Daily ritual creates mindful moment
- ✅ Task completion feels satisfying
- ✅ Interface feels warm and safe
- ✅ All interactions are forgiving and reversible
- ✅ Signature circles create visual identity and brand recognition
- ✅ Settings provide user control without complexity
- ✅ Mobile-first design respects ADHD focus needs
- ✅ Codebase is maintainable and scalable
- ✅ Components are reusable and testable

## Design Identity - Signature Circles

### 🔵 Circle Language Throughout App
- **Task checkboxes** - Perfect circles that fill with checkmarks
- **Empty state decorations** - Floating circles with gentle animations
- **Loading indicators** - Soft circular elements instead of harsh spinners
- **Brand recognition** - Circles become synonymous with "everyday"
- **Gentle psychology** - Circles feel complete, safe, non-threatening
- **ADHD-friendly** - No sharp edges or aggressive geometric shapes

### 🎨 Visual Consistency
- **Rounded corners** - All UI elements use consistent border-radius
- **Soft shadows** - Gentle depth without harsh contrast
- **Circular buttons** - FAB and interactive elements maintain circle theme
- **Flowing animations** - Circular motion paths and gentle rotations
- **Warm gradients** - Circular gradient backgrounds in empty states

## Technical Stack
- React 19 + TypeScript ✅
- Tailwind CSS 4 (warm color palette) ✅
- shadcn/ui components (with Sheet integration) ✅
- Framer Motion (gentle animations) ✅
- Zustand (state management) ✅
- localStorage (data persistence + settings) ✅

## Design Principles
- **Warm colors**: Terracotta, sage, peach - no harsh whites/blacks ✅
- **Soft language**: Encouraging, never judgmental ✅
- **Gentle interactions**: Smooth hover states, easy undo ✅
- **Minimal cognitive load**: Few decisions, clear hierarchy ✅
- **Personal connection**: Use their name, remember preferences ✅
- **Daily mindfulness**: Day display creates moment of presence ✅
- **Emotional safety**: Every interaction feels forgiving ✅
- **Signature circles**: Consistent circular identity throughout ✅
- **User control**: Customizable settings without overwhelming options ✅
- **Clean code**: Maintainable, testable, scalable architecture ✅

---

**Key Principle**: Remove features that add complexity. Add features that reduce anxiety.

**Current Focus**: The foundation is rock-solid and beautifully architected. Now we add gentle encouragement that makes users feel celebrated, not pressured. Time to make task completion feel like a warm hug! ✨

**Architecture Win**: Clean, modular codebase means we can add features quickly without breaking existing functionality. The ADHD-friendly design principles are baked into every component. 🔵

## 🚀 **Ready for Phase 5: Encouragement System!**

The codebase is now perfectly structured to add:
1. **Gentle toast celebrations** when tasks are completed
2. **Daily progress acknowledgment** without pressure
3. **Energy-based suggestions** that feel helpful, not pushy
4. **Optional check-ins** that users can easily dismiss

Let's make every interaction feel like a gentle celebration! 🎉
