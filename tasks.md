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

### Phase 4: Encouragement System 🔄 NEXT FOCUS
**Goal**: Make every interaction feel encouraging and supportive

#### Features - Completion Celebrations 📋 NEXT UP
- [ ] **Gentle toast notifications** - Warm messages after task completion
  - "that's wonderful!" "you did it!" "gentle progress" 
  - Soft slide-in from top, auto-dismiss after 3 seconds
  - Random selection from encouraging message pool
- [ ] **Progress acknowledgment** - Daily completion summary
  - "you've completed 3 things today" in soft card
  - Appears after 2+ completions, dismissible
  - Warm colors, gentle fade-in animation
- [ ] **Energy-based suggestions** - Smart task recommendations
  - "feeling low energy? try something gentle"
  - Based on current energy level from onboarding
  - Appears in empty state or as gentle prompt

#### Features - Daily Check-ins 📋 PLANNED
- [ ] **Optional energy check-in** - "how are you feeling today?"
  - Appears for returning users, easily dismissible
  - Same 5-level emoji system from onboarding
  - Updates suggestions and task filtering
- [ ] **Gentle reminders** - Soft notifications for self-care
  - "remember to drink water" "time for a gentle break"
  - Browser notifications (with permission)
  - Respectful timing, easy to disable

### Phase 5: Gentle Routines 📋 FUTURE
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
- **Clean architecture** - Separate main/tasks pages, overflow management
- **Mobile-first approach** - Desktop limitation with gentle explanation

### 🔄 Currently Building
- **Encouragement system** - Completion celebrations and progress acknowledgment
- **Smart suggestions** - Energy-based and time-based task recommendations

### 📋 Next Sprint Priorities
1. **Gentle toast notifications** - Warm messages after task completion
2. **Daily completion summary** - "you've completed X things today"
3. **Energy-based suggestions** - Smart task recommendations
4. **Optional daily check-in** - "how are you feeling?" for returning users

### 🎯 Success Metrics So Far
- ✅ Onboarding feels welcoming, not overwhelming
- ✅ Daily ritual creates mindful moment
- ✅ Task completion feels satisfying
- ✅ Interface feels warm and safe
- ✅ All interactions are forgiving and reversible
- ✅ Signature circles create visual identity and brand recognition
- ✅ Settings provide user control without complexity
- ✅ Mobile-first design respects ADHD focus needs

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

---

**Key Principle**: Remove features that add complexity. Add features that reduce anxiety.

**Current Focus**: The foundation is solid and beautiful. Now we add gentle encouragement that makes users feel celebrated, not pressured. ✨

**Design Identity**: Circles are our signature - they represent completeness, safety, and the gentle nature of ADHD-friendly design. 🔵
