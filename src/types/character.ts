export interface CharacterStats {
  strength: number
  intelligence: number
  skill: number
  wisdom: number
  spirit: number
}

export interface Character {
  level: number
  xp: number
  xpToNextLevel: number
  stats: CharacterStats
  streak: number
  lastQuestCompleted: string | null
} 