# everyday

A gentle task manager designed specifically for ADHD brains. Every interaction prioritizes emotional safety and reduces cognitive load.

## Philosophy

Traditional todo apps can feel overwhelming and judgmental. **everyday** takes a different approach, following a **capture → clarify → execute** mental model:

- **Gentle language** - "add something" instead of "CREATE TASK"
- **Warm interactions** - Soft animations and encouraging feedback
- **Forgiving design** - Easy to add, remove, and modify without pressure
- **ADHD-friendly** - Minimal cognitive load, warm color palette, no harsh whites

## Features

- ✅ Inbox, Today, Manage views for GTD-style organization
- ✅ Natural language date parsing with chrono-node
- ✅ Recurrence support with rrule
- ✅ Notification system with Capacitor
- ✅ Spaces and projects for task organization
- ✅ Simple task input with soft styling
- ✅ Gentle hover states and micro-interactions
- ✅ Warm, cozy color palette (terracotta, sage, peach)
- ✅ Framer Motion animations for emotional comfort
- ✅ Persistent storage (localStorage)
- ✅ Task completion with satisfying micro-interactions
- 📋 Gentle routine tracking (planned)
- 🎉 Soft celebrations for completed tasks (planned)

## Tech Stack

- **React 19** + TypeScript
- **Tailwind CSS 4** with warm, ADHD-friendly color system
- **Framer Motion** for gentle animations
- **Zustand** for simple state management
- **shadcn/ui** components with custom warm styling
- **Vite** for fast development
- **wouter** for lightweight routing
- **chrono-node** for natural language date parsing
- **rrule** for recurrence patterns
- **Capacitor** for native notifications

## Routing

The app uses **wouter** for lightweight, hash-based routing between the three main views:

- `/inbox` - Raw capture zone
- `/today` - Tactical execution view
 - `/inbox` - Raw capture zone
 - `/today` - Tactical execution view
 - `/manage` - Long-term organization

## Design Principles

- **Lowercase branding** - Reinforces gentle, non-judgmental vibe
- **Warm colors** - Earth tones, no stark whites or blacks
- **Soft animations** - Guide attention without overwhelming
- **Minimal decisions** - Clear hierarchy, reduced cognitive friction
- **Emotional safety** - Every interaction feels forgiving

## Development

```bash
# Install dependencies (use pnpm workspace setup if in a monorepo)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Target Users

People with ADHD, anxiety, or executive dysfunction who find traditional productivity apps overwhelming. Built for those who need gentle consistency support rather than aggressive productivity tracking.

---

*"Remove features that add complexity. Add features that reduce anxiety."*
