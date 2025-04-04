export type QuestType = 'daily' | 'weekly' | 'monthly' | 'custom'
export type QuestStatus = 'active' | 'completed'

export interface Quest {
  id: string
  title: string
  description: string
  type: QuestType
  xpReward: number
  statBoosts: {
    strength?: number
    intelligence?: number
    skill?: number
    wisdom?: number
    spirit?: number
  }
  status: QuestStatus
  createdAt: string
  completedAt?: string
  dueDate?: string
  isPersistent?: boolean
  completionCount?: number
  maxCompletions?: number
} 