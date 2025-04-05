'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/stores/useStore'
import TestNavigation from '@/components/TestNavigation'

export default function TestStore() {
  const { character, quests, updateCharacter, addQuest } = useStore()
  const [testValue, setTestValue] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [storeUpdates, setStoreUpdates] = useState<number>(0)

  // Force a re-render when the store updates
  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (state) => {
        console.log('Store updated:', state)
        setStoreUpdates(prev => prev + 1)
      }
    )
    
    return () => unsubscribe()
  }, [])

  const handleUpdateCharacter = () => {
    try {
      // Update the character's strength
      updateCharacter({
        stats: {
          ...character.stats,
          strength: character.stats.strength + 1
        }
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
        completionCount: 0,
        maxCompletions: 1,
        completedInstances: [],
        failedInstances: []
      })
      setError('')
    } catch (err) {
      setError(`Error adding quest: ${err}`)
    }
  }

  const handleForceReload = () => {
    window.location.reload()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Zustand Store Test</h1>
      
      <TestNavigation />
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Test Zustand Store</h2>
        
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleUpdateCharacter}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Character
          </button>
          
          <button
            onClick={handleAddQuest}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Quest
          </button>
          
          <button
            onClick={handleForceReload}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Force Reload
          </button>
        </div>
        
        {error && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-red-600">Error:</h3>
            <div className="bg-red-100 p-4 rounded text-red-700">
              <pre>{error}</pre>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Store Updates:</h3>
          <div className="bg-gray-100 p-4 rounded">
            <p>Number of store updates: {storeUpdates}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Character:</h3>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre>{JSON.stringify(character, null, 2)}</pre>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Quests ({quests.length}):</h3>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre>{JSON.stringify(quests, null, 2)}</pre>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">LocalStorage Check:</h3>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Character in localStorage:</strong> {typeof window !== 'undefined' ? localStorage.getItem('habit-berserk-character') ? 'Present' : 'Not found' : 'Not available'}</p>
            <p><strong>Quests in localStorage:</strong> {typeof window !== 'undefined' ? localStorage.getItem('habit-berserk-quests') ? 'Present' : 'Not found' : 'Not available'}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 