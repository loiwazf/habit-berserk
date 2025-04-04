'use client'

import { useStore } from '@/stores/useStore'

export default function CharacterStats() {
  const { character } = useStore()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Level</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{character.level}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">XP</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {character.xp} / {character.xpToNextLevel}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Streak</h3>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{character.streak}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Last Quest</h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {character.lastQuestCompleted ? new Date(character.lastQuestCompleted).toLocaleDateString() : 'Never'}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Strength</h4>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">{character.stats.strength}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Intelligence</h4>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{character.stats.intelligence}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Agility</h4>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{character.stats.agility}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 