import { create } from 'zustand'
import { Character } from '@/types/character'
import { Quest, QuestStatus, QuestInstance, QuestType } from '@/types/quest'
import { useSession } from 'next-auth/react'

export interface Store {
  userId: string | null
  character: Character
  quests: Quest[]
  isInitialized: boolean
  initialize: () => void
  saveState: () => void
  updateCharacter: (character: Character) => void
  addXP: (amount: number) => void
  updateStats: (stats: Partial<Character['stats']>) => void
  addQuest: (quest: {
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
    maxCompletions?: number
  }) => void
  updateQuest: (updatedQuest: Quest) => void
  completeQuest: (questId: string, date?: Date) => void
  deleteQuest: (questId: string) => void
  resetProgress: () => void
  refreshDailyQuests: () => void
  forceRefreshDailyQuests: () => void
  clearCache: () => void
  forceUpdateCharacter: () => void
  getQuestsByType: (type: QuestType) => Quest[]
  calculateXpToNextLevel: (level: number) => number
  failQuest: (questId: string) => void
  uncheckQuest: (questId: string, date?: Date) => void
}

// Load state from localStorage
const loadState = (userId: string | null) => {
  if (typeof window === 'undefined') return { character: null, quests: [] }
  
  try {
    const characterJson = localStorage.getItem(`habit-berserk-character-${userId}`)
    const questsJson = localStorage.getItem(`habit-berserk-quests-${userId}`)
    
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
const saveState = (state: { character: Character; quests: Quest[] }, userId: string | null) => {
  if (typeof window === 'undefined') return
  
  try {
    console.log('Saving state to localStorage:', state)
    localStorage.setItem(`habit-berserk-character-${userId}`, JSON.stringify(state.character))
    localStorage.setItem(`habit-berserk-quests-${userId}`, JSON.stringify(state.quests))
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

export const useStore = create<Store>((set, get) => ({
  userId: null,
  character: initialState.character,
  quests: initialState.quests,
  isInitialized: false,
  
  // Initialize the store
  initialize: () => {
    try {
      const { data: session } = useSession()
      const userId = session?.user?.id || null
      
      if (userId) {
        set({ userId })
        // Load state from localStorage for this user
        const savedState = loadState(userId)
        
        if (savedState.character && savedState.quests.length > 0) {
          set({ 
            character: savedState.character,
            quests: savedState.quests,
            isInitialized: true 
          })
          console.log('State loaded from localStorage for user:', userId)
        } else {
          // Set default state if nothing is saved for this user
          set({ isInitialized: true })
          console.log('No saved state found for user, using defaults:', userId)
        }
      } else {
        set({ isInitialized: true })
        console.log('No user session found')
      }
    } catch (error) {
      console.error('Error initializing store:', error)
      set({ isInitialized: true })
    }
  },
  
  // Save state to localStorage
  saveState: () => {
    try {
      const state = get()
      const stateToSave = {
        character: state.character,
        quests: state.quests
      }
      saveState(stateToSave, state.userId)
      console.log('State saved to localStorage for user:', state.userId)
    } catch (error) {
      console.error('Error saving state:', error)
    }
  },
  
  // Update character
  updateCharacter: (character) => {
    set({ character })
    get().saveState()
  },
  
  // Add XP to character
  addXP: (amount) => {
    console.log('Adding XP:', amount)
    const state = get()
    const { character } = state
    
    // Calculate new XP and level
    let newXP = character.xp + amount
    let newLevel = character.level
    let newXPToNextLevel = character.xpToNextLevel
    
    // Check for level up
    while (newXP >= newXPToNextLevel) {
      newXP -= newXPToNextLevel
      newLevel++
      newXPToNextLevel = Math.floor(newXPToNextLevel * 1.5)
    }
    
    // Update character
    const updatedCharacter = {
      ...character,
      level: newLevel,
      xp: newXP,
      xpToNextLevel: newXPToNextLevel
    }
    
    console.log('Updated character after adding XP:', updatedCharacter)
    set({ character: updatedCharacter })
    get().saveState()
  },
  
  // Update character stats
  updateStats: (stats) => {
    const state = get()
    const { character } = state
    
    const updatedCharacter = {
      ...character,
      stats: {
        ...character.stats,
        ...stats
      }
    }
    
    set({ character: updatedCharacter })
    get().saveState()
  },
  
  // Add a quest
  addQuest: (quest) => {
    const newQuest: Quest = {
      ...quest,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'active' as QuestStatus,
      completedAt: null,
      completedInstances: [],
      failedInstances: [],
      completionCount: 0,
      maxCompletions: quest.maxCompletions || 1,
      isPersistent: quest.isPersistent || false,
      statBoosts: quest.statBoosts || {
        strength: 0,
        intelligence: 0,
        skill: 0,
        wisdom: 0,
        spirit: 0
      }
    }
    set((state) => ({
      ...state,
      quests: [...state.quests, newQuest]
    }))
    get().saveState()
  },
  
  // Update a quest
  updateQuest: (updatedQuest) => {
    set((state) => {
      const updatedQuests = state.quests.map(quest => 
        quest.id === updatedQuest.id ? updatedQuest : quest
      )
      return { quests: updatedQuests }
    })
    get().saveState()
  },
  
  // Complete a quest
  completeQuest: (questId: string, date?: Date) => {
    const completionDate = date || new Date()
    const dateStr = completionDate.toISOString().split('T')[0]
    
    set((state) => {
      const quest = state.quests.find((q) => q.id === questId)
      if (!quest) return state

      // Check if quest is already completed for this date
      const isAlreadyCompleted = quest.completedInstances.some(
        instance => instance.date === dateStr
      )
      if (isAlreadyCompleted) return state

      const instance: QuestInstance = {
        date: dateStr,
        timestamp: completionDate.toISOString(),
        xp: quest.xpReward || quest.xp || 0,
        statBoosts: quest.statBoosts || {}
      }

      // Add XP to the character
      const xpToAdd = quest.xpReward || quest.xp || 0
      const character = state.character
      
      // Calculate new XP and level
      let newXP = character.xp + xpToAdd
      let newLevel = character.level
      let newXPToNextLevel = character.xpToNextLevel
      
      // Check for level up
      while (newXP >= newXPToNextLevel) {
        newXP -= newXPToNextLevel
        newLevel++
        newXPToNextLevel = Math.floor(newXPToNextLevel * 1.5)
      }

      // Apply stat boosts if they exist
      const updatedStats = { ...character.stats }
      if (quest.statBoosts) {
        Object.entries(quest.statBoosts).forEach(([stat, boost]) => {
          if (boost && stat in updatedStats) {
            updatedStats[stat as keyof typeof updatedStats] += boost
          }
        })
      }
      
      // Update character with new stats
      const updatedCharacter = {
        ...character,
        level: newLevel,
        xp: newXP,
        xpToNextLevel: newXPToNextLevel,
        lastQuestCompleted: completionDate.toISOString(),
        stats: updatedStats
      }

      const updatedQuest: Quest = {
        ...quest,
        completedInstances: [...quest.completedInstances, instance],
        failedInstances: quest.failedInstances || [],
        completionCount: (quest.completionCount || 0) + 1,
        status: (quest.completionCount || 0) + 1 >= (quest.maxCompletions || 1) ? 'completed' as QuestStatus : 'active' as QuestStatus,
        completedAt: (quest.completionCount || 0) + 1 >= (quest.maxCompletions || 1) ? completionDate.toISOString() : null
      }

      return {
        character: updatedCharacter,
        quests: state.quests.map((q) => (q.id === questId ? updatedQuest : q))
      }
    })
    get().saveState()
  },
  
  // Delete a quest
  deleteQuest: (questId) => {
    set((state) => ({
      quests: state.quests.filter((quest) => quest.id !== questId)
    }))
    get().saveState()
  },
  
  // Reset progress
  resetProgress: () => {
    set({
      character: initialState.character,
      quests: initialState.quests
    })
    get().saveState()
  },
  
  // Refresh daily quests
  refreshDailyQuests: () => {
    set((state) => {
      const today = new Date().toISOString().split('T')[0]
      const updatedQuests = state.quests.map(quest => {
        if (quest.type === 'daily') {
          const lastCompleted = quest.completedInstances[quest.completedInstances.length - 1]
          if (!lastCompleted || lastCompleted.date !== today) {
            return {
              ...quest,
              status: 'active' as QuestStatus,
              completedInstances: quest.completedInstances.filter(instance => instance.date === today)
            }
          }
        }
        return quest
      })
      return { quests: updatedQuests }
    })
    get().saveState()
  },
  
  // Force refresh daily quests
  forceRefreshDailyQuests: () => {
    set((state) => {
      const updatedQuests = state.quests.map(quest => {
        if (quest.type === 'daily') {
          return {
            ...quest,
            status: 'active' as QuestStatus,
            completedInstances: []
          }
        }
        return quest
      })
      return { quests: updatedQuests }
    })
    get().saveState()
  },
  
  // Clear cache
  clearCache: () => {
    const state = get()
    if (state.userId) {
      localStorage.removeItem(`habit-berserk-character-${state.userId}`)
      localStorage.removeItem(`habit-berserk-quests-${state.userId}`)
    }
  },
  
  // Force update character
  forceUpdateCharacter: () => {
    const state = get()
    set({ character: { ...state.character } })
  },
  
  // Get quests by type
  getQuestsByType: (type) => {
    return get().quests.filter((quest) => quest.type === type)
  },
  
  // Calculate XP to next level
  calculateXpToNextLevel,
  
  // Fail a quest
  failQuest: (questId) => {
    set((state) => {
      const quest = state.quests.find((q) => q.id === questId)
      if (!quest) return state

      const instance: QuestInstance = {
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        xp: 0,
        statBoosts: {}
      }

      return {
        quests: state.quests.map((q) =>
          q.id === questId
            ? {
                ...q,
                failedInstances: [...q.failedInstances, instance],
                status: 'failed' as QuestStatus
              }
            : q
        )
      }
    })
    get().saveState()
  },
  
  // Uncheck a quest
  uncheckQuest: (questId, date?: Date) => {
    const targetDate = date || new Date()
    const dateStr = targetDate.toISOString().split('T')[0]
    
    set((state) => {
      const quest = state.quests.find((q) => q.id === questId)
      if (!quest) return state

      const updatedQuest: Quest = {
        ...quest,
        completedInstances: quest.completedInstances.filter(
          instance => instance.date !== dateStr
        ),
        completionCount: Math.max(0, (quest.completionCount || 0) - 1),
        status: 'active' as QuestStatus,
        completedAt: null
      }

      return {
        quests: state.quests.map((q) => (q.id === questId ? updatedQuest : q))
      }
    })
    get().saveState()
  }
})) 