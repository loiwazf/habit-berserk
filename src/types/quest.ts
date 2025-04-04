export type QuestType = 'daily' | 'weekly' | 'monthly' | 'custom'
export type QuestStatus = 'active' | 'completed' | 'failed'

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
  failedAt?: string
  dueDate?: string
  isPersistent?: boolean
  completionCount?: number
  maxCompletions?: number
} 