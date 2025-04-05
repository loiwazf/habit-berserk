import { create } from 'zustand'
import { Character } from '@/types/character'
import { Quest, QuestStatus, QuestInstance, QuestType } from '@/types/quest'

interface Store {
  character: Character
  quests: Quest[]
  addQuest: (quest: Omit<Quest, 'id' | 'status' | 'createdAt' | 'completedAt'>) => void
  completeQuest: (questId: string, date: Date) => void
  failQuest: (questId: string, date: Date) => void
  deleteQuest: (questId: string) => void
  updateCharacter: (updates: Partial<Character>) => void
  createDefaultQuests: () => void
  refreshDailyQuests: () => void
  forceRefreshDailyQuests: () => void
  getQuestsByType: (type: QuestType) => Quest[]
  calculateXpToNextLevel: (level: number) => number
  resetState: () => void
}

// Load state from localStorage
const loadState = () => {
  if (typeof window === 'undefined') return { character: null, quests: [] }
  
  try {
    const characterJson = localStorage.getItem('habit-berserk-character')
    const questsJson = localStorage.getItem('habit-berserk-quests')
    
    return {
      character: characterJson ? JSON.parse(characterJson) : null,
      quests: questsJson ? JSON.parse(questsJson) : [],
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error)
    return { character: null, quests: [] }
  }
}

// Save state to localStorage
const saveState = (state: { character: Character; quests: Quest[] }) => {
  if (typeof window === 'undefined') return
  
  try {
    console.log('Saving state to localStorage:', state)
    localStorage.setItem('habit-berserk-character', JSON.stringify(state.character))
    localStorage.setItem('habit-berserk-quests', JSON.stringify(state.quests))
    console.log('State saved successfully')
  } catch (error) {
    console.error('Error saving state to localStorage:', error)
  }
}

// Calculate XP required for next level
const calculateXpToNextLevel = (level: number): number => {
  // Base XP required for level 1 is 100
  // Each level requires 20% more XP than the previous level
  return Math.floor(100 * Math.pow(1.2, level - 1))
}

// Initial state
const initialState = {
  character: {
    level: 1,
    xp: 0,
    xpToNextLevel: calculateXpToNextLevel(1),
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
}

// Load saved state or use initial state
const savedState = loadState()
const initialStoreState = {
  character: savedState.character || initialState.character,
  quests: savedState.quests || initialState.quests,
}

export const useStore = create<Store>((set, get) => ({
  character: initialStoreState.character,
  quests: initialStoreState.quests,
  addQuest: (quest) =>
    set((state) => {
      console.log('Adding quest:', quest)
      const newQuest: Quest = {
        ...quest,
        id: Math.random().toString(36).substr(2, 9),
        status: 'active' as QuestStatus,
        createdAt: new Date().toISOString(),
        completedInstances: [],
        failedInstances: [],
        xp: quest.xpReward || 0,
      }
      
      const newState = {
        quests: [...state.quests, newQuest],
      }
      console.log('New state after adding quest:', newState)
      saveState({ character: state.character, quests: newState.quests })
      return newState
    }),
  completeQuest: (questId: string, date: Date) =>
    set((state) => {
      const quest = state.quests.find((q) => q.id === questId)
      if (!quest) return state

      const newInstance: QuestInstance = {
        date: date.toISOString(),
        xp: quest.xpReward || 0
      }

      const updatedQuests = state.quests.map(q => {
        if (q.id === questId) {
          return {
            ...q,
            completedInstances: [...q.completedInstances, newInstance]
          }
        }
        return q
      })

      // Calculate new XP and check for level up
      const newXp = state.character.xp + (quest.xpReward || 0)
      const currentLevel = state.character.level
      const currentXpToNextLevel = state.character.xpToNextLevel
      
      // Check if we need to level up
      let newLevel = currentLevel
      let remainingXp = newXp
      let newXpToNextLevel = currentXpToNextLevel
      
      while (remainingXp >= newXpToNextLevel) {
        remainingXp -= newXpToNextLevel
        newLevel++
        newXpToNextLevel = calculateXpToNextLevel(newLevel)
      }
      
      // Update character stats based on quest stat boosts
      const updatedStats = { ...state.character.stats }
      if (quest.statBoosts) {
        Object.entries(quest.statBoosts).forEach(([stat, value]) => {
          if (value && typeof updatedStats[stat as keyof typeof updatedStats] === 'number') {
            updatedStats[stat as keyof typeof updatedStats] = 
              (updatedStats[stat as keyof typeof updatedStats] as number) + value
          }
        })
      }
      
      // Update streak
      const lastQuestDate = state.character.lastQuestCompleted 
        ? new Date(state.character.lastQuestCompleted) 
        : null
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      let newStreak = state.character.streak
      
      if (!lastQuestDate) {
        // First quest completed
        newStreak = 1
      } else {
        const lastQuestDay = new Date(lastQuestDate)
        lastQuestDay.setHours(0, 0, 0, 0)
        
        if (lastQuestDay.getTime() === yesterday.getTime()) {
          // Completed a quest yesterday, increment streak
          newStreak++
        } else if (lastQuestDay.getTime() !== today.getTime()) {
          // Didn't complete a quest yesterday, reset streak
          newStreak = 1
        }
        // If completed a quest today, keep the same streak
      }
      
      const newState = {
        quests: updatedQuests,
        character: {
          ...state.character,
          level: newLevel,
          xp: remainingXp,
          xpToNextLevel: newXpToNextLevel,
          stats: updatedStats,
          streak: newStreak,
          lastQuestCompleted: date.toISOString()
        }
      }
      
      saveState(newState)
      return newState
    }),
  failQuest: (questId: string, date: Date) =>
    set((state) => {
      const quest = state.quests.find((q) => q.id === questId)
      if (!quest) return state

      const newInstance: QuestInstance = {
        date: date.toISOString(),
        xp: 0
      }

      const updatedQuests = state.quests.map(q => {
        if (q.id === questId) {
      return {
            ...q,
            failedInstances: [...q.failedInstances, newInstance]
          }
        }
        return q
      })

      const newState = { 
        quests: updatedQuests,
        character: {
          ...state.character,
          streak: 0
        }
      }
      saveState(newState)
      return newState
    }),
  deleteQuest: (questId: string) =>
    set((state) => {
      const newState = {
        quests: state.quests.filter((q) => q.id !== questId),
      }
      saveState({ character: state.character, quests: newState.quests })
      return newState
    }),
  updateCharacter: (updates) =>
    set((state) => {
      const newState = {
        character: { ...state.character, ...updates },
      }
      saveState({ character: newState.character, quests: state.quests })
      return newState
    }),
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
        xp: 50,
        statBoosts: { spirit: 1 },
        isPersistent: true,
        completionCount: 0,
        maxCompletions: 1,
        completedInstances: [],
        failedInstances: []
      },
      {
        title: 'Journaling',
        description: 'Write in your journal to reflect on your day',
        type: 'daily',
        xpReward: 50,
        xp: 50,
        statBoosts: { wisdom: 1 },
        isPersistent: true,
        completionCount: 0,
        maxCompletions: 1,
        completedInstances: [],
        failedInstances: []
      },
      {
        title: 'Learning/Practicing',
        description: 'Learn something new or practice a skill',
        type: 'daily',
        xpReward: 150,
        xp: 150,
        statBoosts: { skill: 1 },
        isPersistent: true,
        completionCount: 0,
        maxCompletions: 1,
        completedInstances: [],
        failedInstances: []
      },
      {
        title: 'Yoga',
        description: 'Do yoga to improve your flexibility and strength',
        type: 'daily',
        xpReward: 50,
        xp: 50,
        statBoosts: { strength: 1 },
        isPersistent: true,
        completionCount: 0,
        maxCompletions: 1,
        completedInstances: [],
        failedInstances: []
      },
      {
        title: 'Reading',
        description: 'Read a book or article to expand your knowledge',
        type: 'daily',
        xpReward: 50,
        xp: 50,
        statBoosts: { intelligence: 1 },
        isPersistent: true,
        completionCount: 0,
        maxCompletions: 1,
        completedInstances: [],
        failedInstances: []
      },
    ]
    
    // Create default weekly quest
    const defaultWeeklyQuest: Omit<Quest, 'id' | 'status' | 'createdAt' | 'completedAt'> = {
      title: 'Workout 3x',
      description: 'Complete three workouts this week',
      type: 'weekly',
      xpReward: 100,
      xp: 100,
      statBoosts: { strength: 1 },
      isPersistent: true,
      completionCount: 0,
      maxCompletions: 1,
      completedInstances: [],
      failedInstances: []
    }
    
    // Create default monthly quest
    const defaultMonthlyQuest: Omit<Quest, 'id' | 'status' | 'createdAt' | 'completedAt'> = {
      title: 'Monthly Review',
      description: 'Review your progress and set new goals',
      type: 'monthly',
      xpReward: 200,
      xp: 200,
      statBoosts: { wisdom: 1 },
      isPersistent: true,
      completionCount: 0,
      maxCompletions: 1,
      completedInstances: [],
      failedInstances: []
    }
    
    // Add all default quests
    const allDefaultQuests = [...defaultDailyQuests, defaultWeeklyQuest, defaultMonthlyQuest]
    
    set((state) => {
      const newQuests = allDefaultQuests.map(quest => ({
        ...quest,
        id: Math.random().toString(36).substr(2, 9),
        status: 'active' as QuestStatus,
        createdAt: new Date().toISOString(),
      }))
      
      const newState = {
        quests: [...state.quests, ...newQuests],
      }
      
      saveState({ character: state.character, quests: newState.quests })
      return newState
    })
  },
  refreshDailyQuests: () => {
    set((state) => {
      const updatedQuests = state.quests.map(quest => {
        if (quest.type === 'daily') {
          return {
            ...quest,
            completedInstances: quest.completedInstances.filter(
              instance => new Date(instance.date).toDateString() !== new Date().toDateString()
            ),
            failedInstances: quest.failedInstances.filter(
              instance => new Date(instance.date).toDateString() !== new Date().toDateString()
            )
          }
        }
        return quest
      })
      
      const newState = { quests: updatedQuests }
      saveState({ character: state.character, quests: newState.quests })
      return newState
    })
  },
  forceRefreshDailyQuests: () => {
    console.log('Force refreshing daily quests')
    set((state) => {
      // Create a completely new set of daily quests
      const nonDailyQuests = state.quests.filter(q => q.type !== 'daily')
      console.log('Non-daily quests:', nonDailyQuests)
      
      // Create default daily quests
      const defaultDailyQuests: Omit<Quest, 'id' | 'status' | 'createdAt' | 'completedAt'>[] = [
        {
          title: 'Meditation',
          description: 'Take time to meditate and focus on your breath',
          type: 'daily',
          xpReward: 50,
          xp: 50,
          statBoosts: { spirit: 1 },
          isPersistent: true,
          completionCount: 0,
          maxCompletions: 1,
          completedInstances: [],
          failedInstances: []
        },
        {
          title: 'Journaling',
          description: 'Write in your journal to reflect on your day',
          type: 'daily',
          xpReward: 50,
          xp: 50,
          statBoosts: { wisdom: 1 },
          isPersistent: true,
          completionCount: 0,
          maxCompletions: 1,
          completedInstances: [],
          failedInstances: []
        },
        {
          title: 'Learning/Practicing',
          description: 'Learn something new or practice a skill',
          type: 'daily',
          xpReward: 150,
          xp: 150,
          statBoosts: { skill: 1 },
          isPersistent: true,
          completionCount: 0,
          maxCompletions: 1,
          completedInstances: [],
          failedInstances: []
        },
        {
          title: 'Yoga',
          description: 'Do yoga to improve your flexibility and strength',
          type: 'daily',
          xpReward: 50,
          xp: 50,
          statBoosts: { strength: 1 },
          isPersistent: true,
          completionCount: 0,
          maxCompletions: 1,
          completedInstances: [],
          failedInstances: []
        },
        {
          title: 'Reading',
          description: 'Read a book or article to expand your knowledge',
          type: 'daily',
          xpReward: 50,
          xp: 50,
          statBoosts: { intelligence: 1 },
          isPersistent: true,
          completionCount: 0,
          maxCompletions: 1,
          completedInstances: [],
          failedInstances: []
        },
      ]
      
      const newDailyQuests = defaultDailyQuests.map(quest => ({
        ...quest,
        id: Math.random().toString(36).substr(2, 9),
        status: 'active' as QuestStatus,
        createdAt: new Date().toISOString(),
      }))
      console.log('New daily quests:', newDailyQuests)
      
      const newState = {
        quests: [...nonDailyQuests, ...newDailyQuests],
      }
      console.log('New state after force refresh:', newState)
      
      saveState({ character: state.character, quests: newState.quests })
      return newState
    })
  },
  getQuestsByType: (type) => {
    return get().quests.filter(quest => quest.type === type)
  },
  calculateXpToNextLevel: (level) => {
    return calculateXpToNextLevel(level)
  },
  resetState: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('habit-berserk-character')
      localStorage.removeItem('habit-berserk-quests')
    }
    
    set({
      character: initialState.character,
      quests: initialState.quests
    })
  }
})) 