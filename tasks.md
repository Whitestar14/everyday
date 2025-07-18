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

### Phase 1: Foundation (Current)
**Goal**: Basic task management with warm, gentle UX

#### Features
- [x] Simple task input with soft styling
- [x] Task list with gentle hover states
- [ ] Mark complete with satisfying micro-interaction
- [ ] Persistent storage (localStorage)
- [ ] Basic Framer Motion animations

#### UX Priorities
- **Gentle language**: "add something", "done", "that's perfectly okay"
- **Soft interactions**: Hover states, gentle transitions
- **Forgiving**: Easy to add/remove, no pressure
- **Immediate feedback**: Tasks appear/disappear smoothly

### Phase 2: Polish (Next 2 weeks)
**Goal**: Make interactions feel delightful

#### Features
- [ ] Gentle animations with Framer Motion
- [ ] Task persistence with localStorage
- [ ] Simple routine tracking (morning/evening)
- [ ] Soft celebration when tasks completed

### Phase 3: Gentle Reminders (Later)
**Goal**: Helpful notifications without anxiety

#### Features
- [ ] Optional gentle notifications
- [ ] Energy level check-in (1-5 scale)
- [ ] Encouraging messages

## Technical Stack
- React 19 + TypeScript
- Tailwind CSS 4 (warm color palette)
- shadcn/ui components
- Framer Motion (for gentle animations)
- Zustand (simple state management)

## Design Principles
- **Warm colors**: Terracotta, sage, peach - no harsh whites/blacks
- **Soft language**: Encouraging, never judgmental
- **Gentle interactions**: Smooth hover states, easy undo
- **Minimal cognitive load**: Few decisions, clear hierarchy

## Success Metrics
- Users return daily
- Tasks actually get completed
- Users report feeling less anxious
- Interface feels warm and welcoming

---

**Key Principle**: Remove features that add complexity. Add features that reduce anxiety.
```

And let's simplify our AGENT.md:

```markdown:AGENT.md
# AGENT.md - Cody Assistant Context for "everyday"

## Project Overview
**App Name:** everyday (lowercase branding)
**Purpose:** Minimalist task manager for ADHD users
**Tech Stack:** React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Framer Motion

## Core Identity
- **Lowercase styling** - gentle, non-judgmental
- **Warm colors** - terracotta, sage, peach (no harsh whites/blacks)
- **Soft animations** - emotional comfort, not just flair
- **Gentle language** - "add something", "done", "that's perfectly okay"

## Target User
People with ADHD who get overwhelmed by traditional todo apps

## Current Status
- ✅ Warm color palette implemented
- ✅ Basic task add/remove functionality
- ✅ shadcn/ui components with gentle styling
- 🔄 Need Framer Motion animations
- 🔄 Need localStorage persistence
- 🔄 Need Zustand store

## Key Principles
1. **Remove complexity** - Less is more
2. **Gentle interactions** - No harsh feedback
3. **Warm visual design** - Cozy, welcoming
4. **ADHD-friendly** - Reduce cognitive load

## Questions Before Adding Features
- Does this reduce anxiety or create it?
- Is this interaction gentle and forgiving?
- Would this overwhelm an ADHD user?
- Can we make this simpler?

---

**Focus**: Build the minimum viable warm hug for ADHD brains.
