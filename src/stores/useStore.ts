import { create } from 'zustand'
import { Character } from '@/types/character'
import { Quest, QuestStatus } from '@/types/quest'

interface Store {
  character: Character
  quests: Quest[]
  addQuest: (quest: Omit<Quest, 'id' | 'status' | 'createdAt' | 'completedAt'>) => void
  completeQuest: (id: string) => void
  deleteQuest: (id: string) => void
  updateCharacter: (updates: Partial<Character>) => void
  createDefaultQuests: () => void
  refreshDailyQuests: () => void
  getQuestsByType: (type: Quest['type']) => Quest[]
}

export const useStore = create<Store>((set, get) => ({
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
          status: 'active' as QuestStatus,
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  completeQuest: (id) =>
    set((state) => {
      const quest = state.quests.find((q) => q.id === id)
      if (!quest) return state

      // Handle persistent quests
      if (quest.isPersistent) {
        const completionCount = (quest.completionCount || 0) + 1
        const maxCompletions = quest.maxCompletions || 1
        
        // If the quest has reached its max completions, mark it as completed
        if (completionCount >= maxCompletions) {
          return {
            quests: state.quests.map((q) =>
              q.id === id
                ? {
                    ...q,
                    status: 'completed' as QuestStatus,
                    completedAt: new Date().toISOString(),
                    completionCount,
                  }
                : q
            ),
            character: {
              ...state.character,
              xp: state.character.xp + quest.xpReward,
              stats: {
                strength: state.character.stats.strength + (quest.statBoosts.strength || 0),
                intelligence: state.character.stats.intelligence + (quest.statBoosts.intelligence || 0),
                skill: state.character.stats.skill + (quest.statBoosts.skill || 0),
                wisdom: state.character.stats.wisdom + (quest.statBoosts.wisdom || 0),
                spirit: state.character.stats.spirit + (quest.statBoosts.spirit || 0),
              },
              streak: state.character.streak + 1,
              lastQuestCompleted: new Date().toISOString(),
            },
          }
        }
        
        // Otherwise, just update the completion count
        return {
          quests: state.quests.map((q) =>
            q.id === id
              ? {
                  ...q,
                  completionCount,
                }
              : q
          ),
          character: {
            ...state.character,
            xp: state.character.xp + quest.xpReward,
            stats: {
              strength: state.character.stats.strength + (quest.statBoosts.strength || 0),
              intelligence: state.character.stats.intelligence + (quest.statBoosts.intelligence || 0),
              skill: state.character.stats.skill + (quest.statBoosts.skill || 0),
              wisdom: state.character.stats.wisdom + (quest.statBoosts.wisdom || 0),
              spirit: state.character.stats.spirit + (quest.statBoosts.spirit || 0),
            },
            streak: state.character.streak + 1,
            lastQuestCompleted: new Date().toISOString(),
          },
        }
      }

      // Handle regular quests
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
                status: 'completed' as QuestStatus,
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
  createDefaultQuests: () => {
    const state = get()
    
    // Check if default quests already exist
    const hasDefaultQuests = state.quests.some(q => q.isPersistent)
    if (hasDefaultQuests) return
    
    // Create default daily quests
    const defaultDailyQuests: Omit<Quest, 'id' | 'status' | 'createdAt' | 'completedAt'>[] = [
      {
        title: 'Meditation',
        description: 'Take time to meditate and focus on your breath',
        type: 'daily',
        xpReward: 50,
        statBoosts: { spirit: 1 },
        isPersistent: true,
        completionCount: 0,
        maxCompletions: 1,
      },
      {
        title: 'Journaling',
        description: 'Write in your journal to reflect on your day',
        type: 'daily',
        xpReward: 50,
        statBoosts: { wisdom: 1 },
        isPersistent: true,
        completionCount: 0,
        maxCompletions: 1,
      },
      {
        title: 'Learning/Practicing',
        description: 'Learn something new or practice a skill',
        type: 'daily',
        xpReward: 150,
        statBoosts: { skill: 1 },
        isPersistent: true,
        completionCount: 0,
        maxCompletions: 1,
      },
      {
        title: 'Yoga',
        description: 'Do yoga to improve your flexibility and strength',
        type: 'daily',
        xpReward: 50,
        statBoosts: { strength: 1 },
        isPersistent: true,
        completionCount: 0,
        maxCompletions: 1,
      },
      {
        title: 'Reading',
        description: 'Read a book or article to expand your knowledge',
        type: 'daily',
        xpReward: 50,
        statBoosts: { intelligence: 1 },
        isPersistent: true,
        completionCount: 0,
        maxCompletions: 1,
      },
    ]
    
    // Create default weekly quest
    const defaultWeeklyQuest: Omit<Quest, 'id' | 'status' | 'createdAt' | 'completedAt'> = {
      title: 'Workout 3x',
      description: 'Complete three workouts this week',
      type: 'weekly',
      xpReward: 100,
      statBoosts: { strength: 1 },
      isPersistent: true,
      completionCount: 0,
      maxCompletions: 3,
    }
    
    // Add all default quests
    set((state) => ({
      quests: [
        ...state.quests,
        ...defaultDailyQuests.map(quest => ({
          ...quest,
          id: Math.random().toString(36).substr(2, 9),
          status: 'active' as QuestStatus,
          createdAt: new Date().toISOString(),
        })),
        {
          ...defaultWeeklyQuest,
          id: Math.random().toString(36).substr(2, 9),
          status: 'active' as QuestStatus,
          createdAt: new Date().toISOString(),
        },
      ],
    }))
  },
  refreshDailyQuests: () => {
    const state = get()
    const today = new Date().toISOString().split('T')[0]
    
    // Reset daily quests
    set((state) => ({
      quests: state.quests.map(quest => {
        if (quest.type === 'daily' && quest.isPersistent) {
          return {
            ...quest,
            status: 'active' as QuestStatus,
            completionCount: 0,
            completedAt: undefined,
          }
        }
        return quest
      }),
    }))
  },
  getQuestsByType: (type) => {
    const state = get()
    return state.quests.filter(quest => quest.type === type)
  },
})) 