'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/stores/useStore'
import { Quest } from '@/types/quest'

export default function QuestCalendar() {
  const { quests } = useStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<Date[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  
  useEffect(() => {
    generateCalendarDays()
  }, [currentMonth])
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1)
    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0)
    
    // Get days from previous month to fill the first week
    const firstDayOfWeek = firstDay.getDay()
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    
    // Get days from next month to fill the last week
    const lastDayOfWeek = lastDay.getDay()
    const daysFromNextMonth = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek
    
    const days: Date[] = []
    
    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i))
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    
    // Add days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push(new Date(year, month + 1, i))
    }
    
    setCalendarDays(days)
  }
  
  const getQuestsForDate = (date: Date) => {
    return quests.filter(quest => {
      if (!quest.completedAt && !quest.failedAt) return false
      
      const questDate = new Date(quest.completedAt || quest.failedAt!)
      return (
        questDate.getDate() === date.getDate() &&
        questDate.getMonth() === date.getMonth() &&
        questDate.getFullYear() === date.getFullYear()
      )
    })
  }
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }
  
  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }
  
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth()
  }
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }
  
  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setShowDetails(true)
  }
  
  const renderQuestItem = (quest: Quest) => {
    const isCompleted = quest.status === 'completed'
    const isFailed = quest.status === 'failed'
    
    return (
      <div
        key={quest.id}
        className={`p-2 mb-1 rounded text-sm ${
          isCompleted
            ? 'bg-green-100 text-green-800'
            : isFailed
            ? 'bg-red-100 text-red-800'
            : ''
        }`}
      >
        <div className="font-medium">{quest.title}</div>
        <div className="text-xs">
          {isCompleted ? 'Completed' : 'Failed'} • {quest.xpReward} XP
        </div>
      </div>
    )
  }
  
  const renderDetailedQuestItem = (quest: Quest) => {
    const isCompleted = quest.status === 'completed'
    const isFailed = quest.status === 'failed'
    
    return (
      <div
        key={quest.id}
        className={`p-3 mb-2 rounded ${
          isCompleted
            ? 'bg-green-100 text-green-800'
            : isFailed
            ? 'bg-red-100 text-red-800'
            : ''
        }`}
      >
        <div className="font-medium text-base">{quest.title}</div>
        <div className="text-sm mt-1">{quest.description}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {quest.type.charAt(0).toUpperCase() + quest.type.slice(1)}
          </span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            {quest.xpReward} XP
          </span>
          {Object.entries(quest.statBoosts).map(([stat, value]) =>
            value ? (
              <span
                key={stat}
                className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
              >
                +{value} {stat.charAt(0).toUpperCase() + stat.slice(1)}
              </span>
            ) : null
          )}
          {quest.isPersistent && quest.maxCompletions && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              Progress: {quest.completionCount || 0}/{quest.maxCompletions}
            </span>
          )}
        </div>
        <div className="mt-2 text-xs">
          {isCompleted ? 'Completed' : 'Failed'} on{' '}
          {new Date(quest.completedAt || quest.failedAt!).toLocaleTimeString()}
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold">
          {currentMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium py-2">
            {day}
          </div>
        ))}
        
        {calendarDays.map((date, index) => {
          const dayQuests = getQuestsForDate(date)
          const hasQuests = dayQuests.length > 0
          
          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border rounded cursor-pointer ${
                isToday(date)
                  ? 'bg-blue-50 border-blue-200'
                  : !isCurrentMonth(date)
                  ? 'bg-gray-50 text-gray-400'
                  : 'bg-white'
              } ${hasQuests ? 'hover:bg-gray-50' : ''}`}
              onClick={() => handleDayClick(date)}
            >
              <div className="text-sm font-medium mb-1">{date.getDate()}</div>
              {hasQuests && (
                <div className="space-y-1">
                  {dayQuests.map(renderQuestItem)}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {showDetails && selectedDate && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-lg">
              {formatFullDate(selectedDate)}
            </h4>
            <button 
              onClick={() => setShowDetails(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {getQuestsForDate(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {getQuestsForDate(selectedDate).map(renderDetailedQuestItem)}
            </div>
          ) : (
            <p className="text-gray-500 italic">No quests completed or failed on this day.</p>
          )}
        </div>
      )}
    </div>
  )
} 