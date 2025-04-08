export type QuestType = 'daily' | 'weekly' | 'monthly' | 'custom'
export type QuestStatus = 'active' | 'completed' | 'failed'

export interface QuestInstance {
  date: string
  xp: number
  timestamp: string
  statBoosts?: {
    strength?: number
    intelligence?: number
    skill?: number
    wisdom?: number
    spirit?: number
  }
}

export interface Quest {
  id: string
  title: string
  description: string
  type: QuestType
  xpReward: number
  xp: number
  statBoosts?: {
    strength?: number
    intelligence?: number
    skill?: number
    wisdom?: number
    spirit?: number
  }
  isPersistent?: boolean
  completionCount?: number
  maxCompletions?: number
  status: QuestStatus
  createdAt: string
  completedAt?: string | null
  completedInstances: QuestInstance[]
  failedInstances: QuestInstance[]
} 