'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/stores/useStore'
import { Quest } from '@/types/quest'

export default function QuestTimetable() {
  const { quests, completeQuest, deleteQuest } = useStore()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [pastDays, setPastDays] = useState<Date[]>([])
  const [futureDays, setFutureDays] = useState<Date[]>([])
  
  // Generate past and future days
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Generate 7 past days
    const past = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (i + 1))
      return date
    })
    
    // Generate 7 future days
    const future = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() + (i + 1))
      return date
    })
    
    setPastDays(past)
    setFutureDays(future)
  }, [])
  
  // Get quests for a specific date
  const getQuestsForDate = (date: Date): Quest[] => {
    const dateString = date.toISOString().split('T')[0]
    return quests.filter(quest => {
      if (quest.type !== 'daily') return false
      
      // For completed quests, check the completion date
      if (quest.status === 'completed' && quest.completedAt) {
        const completedDate = new Date(quest.completedAt).toISOString().split('T')[0]
        return completedDate === dateString
      }
      
      // For active quests, check if they're due on this date
      if (quest.status === 'active') {
        if (quest.dueDate) {
          const dueDate = new Date(quest.dueDate).toISOString().split('T')[0]
          return dueDate === dateString
        }
        
        // If no due date, check if it's a persistent quest for today
        if (quest.isPersistent) {
          const today = new Date().toISOString().split('T')[0]
          return dateString === today
        }
      }
      
      return false
    })
  }
  
  // Format date for display
  const formatDate = (date: Date): string => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date.getTime() === today.getTime()) {
      return 'Today'
    }
    
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    
    if (date.getTime() === yesterday.getTime()) {
      return 'Yesterday'
    }
    
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow'
    }
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }
  
  // Render a quest item
  const renderQuestItem = (quest: Quest) => (
    <div
      key={quest.id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 mb-2"
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{quest.title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300">{quest.description}</p>
        </div>
        <div className="flex gap-1">
          {quest.status === 'active' && (
            <button
              onClick={() => completeQuest(quest.id)}
              className="p-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
              title="Complete"
            >
              ✓
            </button>
          )}
          <button
            onClick={() => deleteQuest(quest.id)}
            className="p-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
            title="Delete"
          >
            ×
          </button>
        </div>
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        <span className="px-1 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {quest.xpReward} XP
        </span>
        {Object.entries(quest.statBoosts).map(([stat, value]) => 
          value ? (
            <span 
              key={stat}
              className="px-1 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              +{value} {stat.charAt(0).toUpperCase() + stat.slice(1)}
            </span>
          ) : null
        )}
      </div>
    </div>
  )
  
  // Render a day column
  const renderDayColumn = (date: Date, isPast: boolean) => {
    const questsForDate = getQuestsForDate(date)
    const isToday = new Date().toISOString().split('T')[0] === date.toISOString().split('T')[0]
    
    return (
      <div 
        key={date.toISOString()}
        className={`flex flex-col ${isPast ? 'mr-4' : 'ml-4'}`}
      >
        <div className={`text-center font-semibold mb-2 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
          {formatDate(date)}
        </div>
        <div className="w-48 border-t border-gray-200 dark:border-gray-700 pt-2">
          {questsForDate.length > 0 ? (
            questsForDate.map(renderQuestItem)
          ) : (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
              No quests
            </div>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Quest Timeline</h3>
      
      <div className="flex overflow-x-auto pb-4">
        <div className="flex flex-col">
          <div className="text-center font-semibold mb-2 text-gray-700 dark:text-gray-300">Past</div>
          <div className="flex flex-row-reverse">
            {pastDays.map(date => renderDayColumn(date, true))}
          </div>
        </div>
        
        <div className="flex flex-col mx-4">
          <div className="text-center font-semibold mb-2 text-blue-600 dark:text-blue-400">Today</div>
          <div className="w-48 border-t border-gray-200 dark:border-gray-700 pt-2">
            {getQuestsForDate(new Date()).length > 0 ? (
              getQuestsForDate(new Date()).map(renderQuestItem)
            ) : (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                No quests
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="text-center font-semibold mb-2 text-gray-700 dark:text-gray-300">Future</div>
          <div className="flex flex-row">
            {futureDays.map(date => renderDayColumn(date, false))}
          </div>
        </div>
      </div>
    </div>
  )
} 