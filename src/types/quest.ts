export type QuestType = 'daily' | 'weekly' | 'monthly' | 'custom'
export type QuestStatus = 'active' | 'completed' | 'failed'

export interface QuestInstance {
  date: string
  xp: number
}

export interface Quest {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  xpReward: number
  xp: number
  statBoosts?: {
    strength?: number
    intelligence?: number
    skill?: number
    wisdom?: number
    spirit?: number
  }
  isPersistent: boolean
  completionCount: number
  maxCompletions: number
  completedInstances: QuestInstance[]
  failedInstances: QuestInstance[]
  createdAt: string
  status: QuestStatus
} 