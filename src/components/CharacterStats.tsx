'use client'

import { useStore } from '@/stores/useStore'
import { useState, useEffect } from 'react'

export default function CharacterStats() {
  const { character } = useStore()
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Format the last quest completed date
  const formatLastQuestDate = (dateString: string | null) => {
    try {
      if (!dateString) return 'Never'
      
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      setError(`Error formatting date: ${error}`)
      return 'Invalid date'
    }
  }
  
  // Calculate XP progress percentage
  const xpProgress = (character.xp / character.xpToNextLevel) * 100

  // Only render the full content after client-side hydration is complete
  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p>Loading character stats...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Level</h3>
          <p className="text-2xl font-bold accent-color">{character.level}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">XP</h3>
          <p className="text-2xl font-bold accent-color">
            {character.xp} / {character.xpToNextLevel}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="accent-bg h-2.5 rounded-full" 
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Streak</h3>
          <p className="text-2xl font-bold accent-color">{character.streak}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Last Quest</h3>
          <p className="text-2xl font-bold accent-color">
            {formatLastQuestDate(character.lastQuestCompleted)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Strength</h4>
            <p className="text-xl font-bold accent-color">{character.stats.strength}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Intelligence</h4>
            <p className="text-xl font-bold accent-color">{character.stats.intelligence}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Skill</h4>
            <p className="text-xl font-bold accent-color">{character.stats.skill}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Wisdom</h4>
            <p className="text-xl font-bold accent-color">{character.stats.wisdom}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Spirit</h4>
            <p className="text-xl font-bold accent-color">{character.stats.spirit}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 