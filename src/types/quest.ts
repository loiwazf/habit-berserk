export type QuestType = 'daily' | 'weekly' | 'custom'
export type QuestStatus = 'active' | 'completed'

export interface Quest {
  id: string
  title: string
  description: string
  type: QuestType
  xpReward: number
  statBoosts: {
    strength: number
    intelligence: number
    agility: number
  }
  status: QuestStatus
  createdAt: string
  completedAt?: string
} 