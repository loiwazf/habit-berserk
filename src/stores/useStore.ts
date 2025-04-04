import { create } from 'zustand'
import { Character } from '@/types/character'
import { Quest } from '@/types/quest'

interface Store {
  character: Character
  quests: Quest[]
  addQuest: (quest: Omit<Quest, 'id' | 'status' | 'createdAt' | 'completedAt'>) => void
  completeQuest: (id: string) => void
  deleteQuest: (id: string) => void
  updateCharacter: (updates: Partial<Character>) => void
}

export const useStore = create<Store>((set) => ({
  character: {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    stats: {
      strength: 10,
      intelligence: 10,
      skill: 10,
      wisdom: 10,
      spirit: 10,
    },
    streak: 0,
    lastQuestCompleted: null,
  },
  quests: [],
  addQuest: (quest) =>
    set((state) => ({
      quests: [
        ...state.quests,
        {
          ...quest,
          id: Math.random().toString(36).substr(2, 9),
          status: 'active',
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  completeQuest: (id) =>
    set((state) => {
      const quest = state.quests.find((q) => q.id === id)
      if (!quest) return state

      const newXp = state.character.xp + quest.xpReward
      const newLevel =
        newXp >= state.character.xpToNextLevel
          ? state.character.level + 1
          : state.character.level
      const newXpToNextLevel = newLevel * 100

      const newStats = {
        strength: state.character.stats.strength + (quest.statBoosts.strength || 0),
        intelligence: state.character.stats.intelligence + (quest.statBoosts.intelligence || 0),
        skill: state.character.stats.skill + (quest.statBoosts.skill || 0),
        wisdom: state.character.stats.wisdom + (quest.statBoosts.wisdom || 0),
        spirit: state.character.stats.spirit + (quest.statBoosts.spirit || 0),
      }

      const lastQuestCompleted = new Date().toISOString()
      const streak = state.character.lastQuestCompleted
        ? new Date(lastQuestCompleted).getDate() -
          new Date(state.character.lastQuestCompleted).getDate() ===
          1
          ? state.character.streak + 1
          : 1
        : 1

      return {
        quests: state.quests.map((q) =>
          q.id === id
            ? {
                ...q,
                status: 'completed',
                completedAt: new Date().toISOString(),
              }
            : q
        ),
        character: {
          ...state.character,
          level: newLevel,
          xp: newXp,
          xpToNextLevel: newXpToNextLevel,
          stats: newStats,
          streak,
          lastQuestCompleted,
        },
      }
    }),
  deleteQuest: (id) =>
    set((state) => ({
      quests: state.quests.filter((q) => q.id !== id),
    })),
  updateCharacter: (updates) =>
    set((state) => ({
      character: { ...state.character, ...updates },
    })),
})) 