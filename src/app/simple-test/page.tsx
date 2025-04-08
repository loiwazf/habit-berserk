'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/stores/useStore'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface LocalStorageData {
  character: any;
  quests: any;
}

export default function SimpleTest() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { character, quests, updateCharacter, addQuest } = useStore()
  const [localStorageData, setLocalStorageData] = useState<LocalStorageData | null>(null)
  const [error, setError] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load localStorage data on component mount
  useEffect(() => {
    try {
      const characterData = localStorage.getItem(`habit-berserk-character-${session?.user?.id}`)
      const questsData = localStorage.getItem(`habit-berserk-quests-${session?.user?.id}`)
      
      setLocalStorageData({
        character: characterData ? JSON.parse(characterData) : null,
        quests: questsData ? JSON.parse(questsData) : null
      })
    } catch (err) {
      setError(`Error reading from localStorage: ${err}`)
    }
  }, [session?.user?.id])

  const handleUpdateCharacter = () => {
    try {
      // Update the character's strength
      const updatedCharacter = { ...character }
      updatedCharacter.stats = { ...character.stats }
      updatedCharacter.stats.strength += 1
      
      updateCharacter(updatedCharacter)
      
      // Update localStorage data
      const characterData = localStorage.getItem(`habit-berserk-character-${session?.user?.id}`)
      const questsData = localStorage.getItem(`habit-berserk-quests-${session?.user?.id}`)
      
      setLocalStorageData((prev: LocalStorageData | null) => {
        if (!prev) return null;
        return {
          character: characterData ? JSON.parse(characterData) : prev.character,
          quests: prev.quests
        };
      })
      
      setError('')
    } catch (err) {
      setError(`Error updating character: ${err}`)
    }
  }

  const handleAddQuest = () => {
    try {
      // Add a new quest
      addQuest({
        title: `Test Quest ${new Date().toISOString()}`,
        description: 'This is a test quest',
        type: 'custom',
        xpReward: 50,
        xp: 50,
        statBoosts: { strength: 1 },
        isPersistent: false,
        maxCompletions: 1
      })
      
      // Update localStorage data
      const characterData = localStorage.getItem(`habit-berserk-character-${session?.user?.id}`)
      const questsData = localStorage.getItem(`habit-berserk-quests-${session?.user?.id}`)
      
      setLocalStorageData((prev: LocalStorageData | null) => {
        if (!prev) return null;
        return {
          character: prev.character,
          quests: questsData ? JSON.parse(questsData) : prev.quests
        };
      })
      
      setError('')
    } catch (err) {
      setError(`Error adding quest: ${err}`)
    }
  }

  const handleClearLocalStorage = () => {
    try {
      useStore.getState().clearCache()
      setLocalStorageData({
        character: null,
        quests: null
      })
      setError('')
    } catch (err) {
      setError(`Error clearing localStorage: ${err}`)
    }
  }

  const handleReloadPage = () => {
    window.location.reload()
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Simple Test Page</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Only render the full content after client-side hydration is complete
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Simple Test Page</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Simple Test Page</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Test Actions</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleUpdateCharacter}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Character
          </button>
          
          <button
            onClick={handleAddQuest}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Quest
          </button>
          
          <button
            onClick={handleClearLocalStorage}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear LocalStorage
          </button>
          
          <button
            onClick={handleReloadPage}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Reload Page
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
            <h3 className="font-bold">Error:</h3>
            <p>{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Zustand Store State</h3>
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              <h4 className="font-bold mb-2">Character:</h4>
              <pre>{JSON.stringify(character, null, 2)}</pre>
              
              <h4 className="font-bold mb-2 mt-4">Quests ({quests.length}):</h4>
              <pre>{JSON.stringify(quests, null, 2)}</pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2">LocalStorage Data</h3>
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              <h4 className="font-bold mb-2">Character:</h4>
              <pre>{JSON.stringify(localStorageData?.character, null, 2)}</pre>
              
              <h4 className="font-bold mb-2 mt-4">Quests:</h4>
              <pre>{JSON.stringify(localStorageData?.quests, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 