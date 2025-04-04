export interface CharacterStats {
  strength: number
  intelligence: number
  agility: number
}

export interface Character {
  level: number
  xp: number
  xpToNextLevel: number
  stats: {
    strength: number
    intelligence: number
    agility: number
  }
  streak: number
  lastQuestCompleted: string | null
} 