'use client'

import { useStore } from '@/stores/useStore'
import { useState, useEffect } from 'react'

export default function CharacterStats() {
  const { character } = useStore()
  const [isClient, setIsClient] = useState(false)
  
  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Format the last quest completed date
  const formatLastQuestDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Level</h3>
          <p className="text-2xl font-bold text-blue-600">{character.level}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">XP</h3>
          <p className="text-2xl font-bold text-green-600">
            {character.xp} / {character.xpToNextLevel}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Streak</h3>
          <p className="text-2xl font-bold text-orange-600">{character.streak}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Last Quest</h3>
          <p className="text-2xl font-bold text-purple-600">
            {formatLastQuestDate(character.lastQuestCompleted)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Strength</h4>
            <p className="text-xl font-bold text-red-600">{character.stats.strength}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Intelligence</h4>
            <p className="text-xl font-bold text-blue-600">{character.stats.intelligence}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Skill</h4>
            <p className="text-xl font-bold text-green-600">{character.stats.skill}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Wisdom</h4>
            <p className="text-xl font-bold text-yellow-600">{character.stats.wisdom}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Spirit</h4>
            <p className="text-xl font-bold text-purple-600">{character.stats.spirit}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 