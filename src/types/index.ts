export interface Character {
  id: string
  userId: string
  name: string
  level: number
  currentXp: number
  totalXp: number
  createdAt: Date
  updatedAt: Date
}

export interface Stats {
  id: string
  characterId: string
  strength: number
  intelligence: number
  skill: number
  wisdom: number
  spirit: number
  updatedAt: Date
}

export interface Quest {
  id: string
  userId: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  xpReward: number
  statBoost: {
    strength?: number
    intelligence?: number
    skill?: number
    wisdom?: number
    spirit?: number
  }
  dueDate: Date
  createdAt: Date
  updatedAt: Date
  status: 'pending' | 'completed' | 'failed'
  category: string
  tags: string[]
}

export interface QuestCompletion {
  id: string
  questId: string
  completedAt: Date
  xpEarned: number
  streakCount: number
}

export interface Streak {
  id: string
  userId: string
  questType: 'daily' | 'weekly' | 'monthly'
  currentStreak: number
  longestStreak: number
  lastCompleted: Date
} 