# RPG-Themed Habit Tracker (Web Version)

## Overview

The RPG-Themed Habit Tracker is a gamified productivity web application that transforms daily habits into epic quests. Users build their character by completing tasks, gaining experience points (XP), and leveling up. The app combines the addictive nature of RPGs with the practical benefits of habit tracking.

## Core Features

### 1. Character Stats System

Each habit contributes to specific character stats:

| Stat      | Associated Habit |
|-----------|------------------|
| Strength  | Workout          |
| Intelligence | Reading        |
| Skill     | Learning         |
| Wisdom    | Journaling       |
| Spirit    | Meditation       |

- Completing daily, weekly, or monthly quests increases corresponding stat points
- Stats are visually represented with progress bars
- Stats contribute to overall character progression

### 2. Daily Quests (Calendar Format)

- Interactive calendar interface for habit tracking
- Scrollable view for past and future days
- Visual indicators for completed and pending quests
- Daily XP Rewards:
  - Workout: 50 XP
  - Reading: 50 XP
  - Learning: 150 XP
  - Journaling: 50 XP
  - Meditation: 50 XP

### 3. Weekly and Monthly Quests

Custom quest creation system with:
- Stat boost selection
- Customizable XP rewards
- Flexible due dates
- Progress tracking
- Quest categories and tags

### 4. Leveling System

- Maximum level: 80
- Progressive XP requirements:
  - Level 2: 200 XP
  - Level 3: 250 XP
  - Level 4: 325 XP
  - Level 5: 425 XP
  - Each subsequent level increases gradually
- Visual progress tracking
- Level-up animations and celebrations

### 5. Streak Tracking

- Streak counter for daily quest completion
- Visual streak indicators in calendar
- Streak milestones and rewards
- Streak protection system (optional)

## User Flow

### Onboarding
1. Welcome screen
2. Character creation
3. Initial stat allocation
4. Tutorial walkthrough

### Dashboard
- Current level and XP display
- Active quests overview
- Stat progress visualization
- Calendar integration
- Achievement showcase

### Quest Completion
1. Mark quests as complete
2. Automatic XP and stat updates
3. Streak maintenance tracking
4. Progress visualization
5. Reward animations

### Leveling Up
1. XP threshold achievement
2. Level-up animation
3. New abilities/features unlocked
4. Progress reset for next level

## UI/UX Design

### Visual Design
- Clean, minimalist interface
- Dark and light mode support
- RPG-themed visual elements
- Responsive design for desktop and tablet

### Navigation
- Intuitive calendar navigation
- Quick access to daily tasks
- Easy quest creation
- Simple stat viewing

### Progress Visualization
- XP progress bars
- Stat growth indicators
- Level progression display
- Streak counters

## Technical Stack

### Frontend
- React 18 with TypeScript
- Next.js 14 (App Router)
- Tailwind CSS for styling
- Framer Motion for animations
- React Query for data fetching
- Zustand for state management

### Backend
- Supabase for backend services
- PostgreSQL database
- Real-time subscriptions
- Authentication and authorization

### AI Integration
- DeepSeek for AI-powered features

## Database Schema

### Tables

#### users
- id: uuid (primary key)
- email: string (unique)
- created_at: timestamp
- updated_at: timestamp
- username: string (unique)
- avatar_url: string (nullable)
- last_login: timestamp

#### characters
- id: uuid (primary key)
- user_id: uuid (foreign key -> users.id)
- name: string
- level: integer
- current_xp: integer
- total_xp: integer
- created_at: timestamp
- updated_at: timestamp

#### stats
- id: uuid (primary key)
- character_id: uuid (foreign key -> characters.id)
- strength: integer
- intelligence: integer
- skill: integer
- wisdom: integer
- spirit: integer
- updated_at: timestamp

#### quests
- id: uuid (primary key)
- user_id: uuid (foreign key -> users.id)
- title: string
- description: text
- type: enum ('daily', 'weekly', 'monthly', 'custom')
- xp_reward: integer
- stat_boost: jsonb
- due_date: timestamp
- created_at: timestamp
- updated_at: timestamp
- status: enum ('pending', 'completed', 'failed')
- category: string
- tags: string[]

#### quest_completions
- id: uuid (primary key)
- quest_id: uuid (foreign key -> quests.id)
- completed_at: timestamp
- xp_earned: integer
- streak_count: integer

#### achievements
- id: uuid (primary key)
- title: string
- description: text
- xp_reward: integer
- requirements: jsonb
- icon_url: string

#### user_achievements
- id: uuid (primary key)
- user_id: uuid (foreign key -> users.id)
- achievement_id: uuid (foreign key -> achievements.id)
- earned_at: timestamp

#### streaks
- id: uuid (primary key)
- user_id: uuid (foreign key -> users.id)
- quest_type: enum ('daily', 'weekly', 'monthly')
- current_streak: integer
- longest_streak: integer
- last_completed: timestamp

## Project Structure

```
habit-tracker/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── (auth)/         # Authentication routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/    # Protected dashboard routes
│   │   │   ├── quests/
│   │   │   ├── stats/
│   │   │   └── profile/
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── quests/        # Quest-related components
│   │   ├── stats/         # Stats-related components
│   │   └── achievements/  # Achievement components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and configurations
│   │   ├── supabase/     # Supabase client and utilities
│   │   ├── ai/           # AI service integration
│   │   └── utils/        # Helper functions
│   ├── stores/           # State management (Zustand)
│   ├── types/            # TypeScript type definitions
│   └── styles/           # Global styles and Tailwind config
├── public/               # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
├── docs/                 # Documentation
├── tests/               # Test files
├── .env.example        # Environment variables template
├── next.config.js      # Next.js configuration
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Implement proper error handling
- Write unit tests for critical functionality

### Performance
- Implement proper code splitting
- Use Next.js Image optimization
- Optimize bundle size
- Implement proper caching strategies

### Security
- Implement proper authentication
- Use environment variables for sensitive data
- Follow security best practices
- Regular security audits

### Accessibility
- Follow WCAG 2.1 guidelines
- Implement proper ARIA labels
- Ensure keyboard navigation
- Support screen readers
