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
      if (quest.status === 'completed' && quest.completedInstances.length > 0) {
        // Check if any of the completed instances match the date
        return quest.completedInstances.some(instance => {
          const completedDate = new Date(instance.date).toISOString().split('T')[0]
          return completedDate === dateString
        })
      }
      
      // For active quests, check if they're due on this date
      if (quest.status === 'active') {
        // If it's a persistent quest for today
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
          <p className="text-xs text-gray-500 dark:text-gray-400">{quest.description}</p>
        </div>
        <div className="flex items-center">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mr-2">
            +{quest.xpReward} XP
          </span>
          {quest.status === 'completed' ? (
            <button
              onClick={() => deleteQuest(quest.id)}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              Delete
            </button>
          ) : (
            <button
              onClick={() => completeQuest(quest.id, new Date())}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  )
  
  // Render a day column
  const renderDayColumn = (date: Date, isPast: boolean) => {
    const questsForDate = getQuestsForDate(date)
    const isToday = new Date().toDateString() === date.toDateString()
    
    return (
      <div
        key={date.toISOString()}
        className={`flex flex-col ${
          isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
        } rounded-lg p-2`}
      >
        <div className="text-center mb-2">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {formatDate(date)}
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            {date.getDate()}
          </div>
        </div>
        
        <div className="flex-1">
          {questsForDate.length > 0 ? (
            questsForDate.map(renderQuestItem)
          ) : (
            <div className="text-center text-xs text-gray-400 dark:text-gray-500 py-2">
              No quests
            </div>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Quest Timetable
      </h2>
      
      <div className="grid grid-cols-15 gap-2">
        {pastDays.map(date => renderDayColumn(date, true))}
        {renderDayColumn(selectedDate, false)}
        {futureDays.map(date => renderDayColumn(date, false))}
      </div>
    </div>
  )
} 