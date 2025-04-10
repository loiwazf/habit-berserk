import { create } from 'zustand'
import { Character } from '@/types/character'
import { Quest, QuestStatus, QuestInstance, QuestType } from '@/types/quest'
import { useSession } from 'next-auth/react'

export interface Store {
  userId: string | null
  character: Character
  quests: Quest[]
  isInitialized: boolean
  initialize: (userId: string) => void
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
    console.log('Loading state for user:', userId)
    if (!userId) {
      console.error('No user ID provided for loading state')
      return { character: null, quests: [] }
    }

    const characterJson = localStorage.getItem(`habit-berserk-character-${userId}`)
    const questsJson = localStorage.getItem(`habit-berserk-quests-${userId}`)
    
    const state = {
      character: characterJson ? JSON.parse(characterJson) : null,
      quests: questsJson ? JSON.parse(questsJson) : [],
    }
    
    console.log('Loaded state:', state)
    return state
  } catch (error) {
    console.error('Error loading state from localStorage:', error)
    return { character: null, quests: [] }
  }
}

// Save state to localStorage
const saveState = (state: { character: Character; quests: Quest[] }, userId: string | null) => {
  if (typeof window === 'undefined') return
  
  try {
    console.log('Saving state to localStorage for user:', userId)
    console.log('State to save:', state)
    
    if (!userId) {
      console.error('No user ID provided for saving state')
      return
    }
    
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
  userId: null,
  isInitialized: false,
}

export const useStore = create<Store>((set, get) => ({
  ...initialState,

  initialize: (userId: string) => {
    if (!userId) {
      console.error('Cannot initialize store: No user ID provided')
      return
    }

    if (get().isInitialized && get().userId === userId) {
      console.log('Store already initialized for user:', userId)
      return
    }

    console.log('Initializing store for user:', userId)
    const { character, quests } = loadState(userId)
    
    set({
      userId,
      character: character || initialState.character,
      quests: quests || [],
      isInitialized: true,
    })
    
    console.log('Store initialized with state:', { character, quests })
  },

  saveState: () => {
    const state = get()
    if (!state.userId) {
      console.error('Cannot save state: No user ID')
      return
    }
    
    console.log('Saving current state for user:', state.userId)
    saveState(
      {
        character: state.character,
        quests: state.quests,
      },
      state.userId
    )
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
    const state = get()
    const quest = state.quests.find(q => q.id === questId)
    
    if (!quest) {
      console.error('Quest not found:', questId)
      return
    }

    const targetDate = date || new Date()
    const dateStr = targetDate.toISOString().split('T')[0]
    
    // Check if already completed for this date
    const alreadyCompleted = quest.completedInstances.some(
      instance => instance.date === dateStr
    )
    
    if (alreadyCompleted) {
      console.log('Quest already completed for this date:', dateStr)
      return
    }

    const xpReward = quest.xpReward || quest.xp || 0

    // Create new completion instance with all required properties
    const completionInstance: QuestInstance = {
      id: crypto.randomUUID(),
      date: dateStr,
      completedAt: targetDate,
      xpGained: xpReward,
      xp: xpReward,
      timestamp: new Date().toISOString(),
      statBoosts: quest.statBoosts || {}
    }

    // Update quest status
    const updatedQuest = {
      ...quest,
      completedInstances: [...quest.completedInstances, completionInstance],
      status: quest.maxCompletions && quest.completedInstances.length + 1 >= quest.maxCompletions
        ? 'completed' as QuestStatus
        : 'active' as QuestStatus
    }

    // Update store
    set(state => ({
      ...state,
      quests: state.quests.map(q => q.id === questId ? updatedQuest : q),
      character: {
        ...state.character,
        xp: state.character.xp + xpReward,
        xpToNextLevel: calculateXpToNextLevel(state.character.level),
        lastQuestCompleted: targetDate.toISOString()
      }
    }))

    // Save state
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
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0],
        completedAt: new Date(),
        xpGained: 0,
        xp: 0,
        timestamp: new Date().toISOString(),
        statBoosts: {}
      }

      return {
        ...state,
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
  },
  
  // Uncheck a quest
  uncheckQuest: (questId: string, date?: Date) => {
    const state = get()
    const quest = state.quests.find(q => q.id === questId)
    
    if (!quest) {
      console.error('Quest not found:', questId)
      return
    }

    const targetDate = date || new Date()
    const dateStr = targetDate.toISOString().split('T')[0]
    
    // Find the completion instance for this date
    const completionIndex = quest.completedInstances.findIndex(
      instance => instance.completedAt.toISOString().split('T')[0] === dateStr
    )
    
    if (completionIndex === -1) {
      console.error('Completion instance not found for date:', dateStr)
      return
    }

    // Get the completion instance to know how much XP to remove
    const completionInstance = quest.completedInstances[completionIndex]
    
    // Remove the completion instance
    const updatedQuest = {
      ...quest,
      completedInstances: quest.completedInstances.filter((_, index) => index !== completionIndex),
      status: 'active' as QuestStatus,
    }

    // Update the quest in the store
    set(state => ({
      quests: state.quests.map(q => q.id === questId ? updatedQuest : q),
      character: {
        ...state.character,
        xp: state.character.xp - (completionInstance.xpGained || 0),
        xpToNextLevel: calculateXpToNextLevel(state.character.level),
      }
    }))

    // Save the updated state
    get().saveState()
  }
})) 