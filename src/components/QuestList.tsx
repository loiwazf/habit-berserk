'use client'

import { useStore } from '@/stores/useStore'
import { Quest } from '@/types/quest'
import { useEffect } from 'react'

export default function QuestList() {
  const {
    quests,
    createDefaultQuests,
    refreshDailyQuests,
    getQuestsByType,
    completeQuest,
    failQuest,
    deleteQuest,
  } = useStore()

  // Initialize default quests on component mount
  useEffect(() => {
    createDefaultQuests()
    
    // Check if we need to refresh daily quests
    const lastRefresh = localStorage.getItem('lastDailyQuestRefresh')
    const today = new Date().toISOString().split('T')[0]
    
    if (!lastRefresh || lastRefresh !== today) {
      refreshDailyQuests()
      localStorage.setItem('lastDailyQuestRefresh', today)
    }
  }, [createDefaultQuests, refreshDailyQuests])

  const dailyQuests = getQuestsByType('daily')
  const weeklyQuests = getQuestsByType('weekly')
  const monthlyQuests = getQuestsByType('monthly')
  const customQuests = getQuestsByType('custom')

  const renderQuestItem = (quest: Quest) => {
    const isPersistent = quest.isPersistent
    const completionCount = quest.completionCount || 0
    const maxCompletions = quest.maxCompletions || 1
    const progress = isPersistent ? `${completionCount}/${maxCompletions}` : null

    return (
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
            {quest.isPersistent && quest.maxCompletions && quest.maxCompletions > 1 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {quest.completionCount || 0}/{quest.maxCompletions} Completions
              </span>
            )}
            {quest.dueDate && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                Due: {new Date(quest.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {quest.status === 'active' && (
            <>
              <button
                onClick={() => completeQuest(quest.id)}
                className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Complete
              </button>
              <button
                onClick={() => failQuest(quest.id)}
                className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Fail
              </button>
            </>
          )}
          <button
            onClick={() => deleteQuest(quest.id)}
            className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  const renderQuestSection = (title: string, quests: Quest[]) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h3>
      <div className="space-y-4">
        {quests.length > 0 ? (
          quests.map(renderQuestItem)
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No {title.toLowerCase()} available.
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      {renderQuestSection('Daily Quests', dailyQuests)}
      {renderQuestSection('Weekly Quests', weeklyQuests)}
      {renderQuestSection('Monthly Quests', monthlyQuests)}
      {renderQuestSection('Custom Quests', customQuests)}
    </div>
  )
} 