'use client'

import { useStore } from '@/stores/useStore'
import { Quest } from '@/types/quest'

export default function QuestList() {
  const { quests, completeQuest, deleteQuest } = useStore()

  return (
    <div className="space-y-4">
      {quests.map((quest) => (
        <div
          key={quest.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{quest.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{quest.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {quest.type}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {quest.xpReward} XP
              </span>
              {(quest.statBoosts.strength ?? 0) > 0 && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  +{quest.statBoosts.strength} Strength
                </span>
              )}
              {(quest.statBoosts.intelligence ?? 0) > 0 && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  +{quest.statBoosts.intelligence} Intelligence
                </span>
              )}
              {(quest.statBoosts.skill ?? 0) > 0 && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  +{quest.statBoosts.skill} Skill
                </span>
              )}
              {(quest.statBoosts.wisdom ?? 0) > 0 && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  +{quest.statBoosts.wisdom} Wisdom
                </span>
              )}
              {(quest.statBoosts.spirit ?? 0) > 0 && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  +{quest.statBoosts.spirit} Spirit
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {quest.status === 'active' && (
              <button
                onClick={() => completeQuest(quest.id)}
                className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Complete
              </button>
            )}
            <button
              onClick={() => deleteQuest(quest.id)}
              className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {quests.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No quests available. Create a new quest to get started!
        </div>
      )}
    </div>
  )
} 