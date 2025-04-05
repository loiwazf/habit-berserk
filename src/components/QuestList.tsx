'use client'

import { useStore } from '@/stores/useStore'
import { Quest, QuestType } from '@/types/quest'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface QuestListProps {
  quests: Quest[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
}

export default function QuestList({ quests, selectedDate, onDateSelect }: QuestListProps) {
  const { completeQuest, failQuest, deleteQuest } = useStore()
  const [displayDate, setDisplayDate] = useState<Date>(selectedDate || new Date())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (selectedDate) {
      setDisplayDate(selectedDate)
    }
  }, [selectedDate])

  const handleDateChange = (days: number) => {
    const newDate = new Date(displayDate)
    newDate.setDate(newDate.getDate() + days)
    setDisplayDate(newDate)
    if (onDateSelect) {
      onDateSelect(newDate)
    }
  }

  const isQuestCompleted = (quest: Quest) => {
    return quest.completedInstances.some(
      instance => new Date(instance.date).toDateString() === displayDate.toDateString()
    )
  }

  const isQuestFailed = (quest: Quest) => {
    return quest.failedInstances.some(
      instance => new Date(instance.date).toDateString() === displayDate.toDateString()
    )
  }

  const handleCompleteQuest = (questId: string) => {
    completeQuest(questId, displayDate)
  }

  const handleFailQuest = (questId: string) => {
    failQuest(questId, displayDate)
  }

  const handleDeleteQuest = (questId: string) => {
    deleteQuest(questId)
  }

  const renderQuestItem = (quest: Quest) => {
    const completed = isQuestCompleted(quest)
    const failed = isQuestFailed(quest)
    const status = completed ? 'completed' : failed ? 'failed' : 'active'

    return (
      <div
        key={quest.id}
        className={`p-4 rounded-lg mb-2 ${
          status === 'completed'
            ? 'bg-green-100 border border-green-200'
            : status === 'failed'
            ? 'bg-red-100 border border-red-200'
            : 'bg-white border border-gray-200'
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{quest.title}</h3>
            <p className="text-gray-600">{quest.description}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-500">
              {quest.xpReward} XP
            </span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {status === 'completed' && (
            <button
              onClick={() => handleDeleteQuest(quest.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          )}
          {status === 'failed' && (
            <>
              <button
                onClick={() => handleCompleteQuest(quest.id)}
                className="text-green-500 hover:text-green-700 mr-2"
              >
                Complete
              </button>
              <button
                onClick={() => handleDeleteQuest(quest.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </>
          )}
          {status === 'active' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleCompleteQuest(quest.id)}
                className="text-green-500 hover:text-green-700 mr-2"
              >
                Complete
              </button>
              <button
                onClick={() => handleFailQuest(quest.id)}
                className="text-red-500 hover:text-red-700"
              >
                Fail
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderQuestSection = (type: QuestType) => {
    const filteredQuests = quests.filter(quest => quest.type === type)
    if (filteredQuests.length === 0) return null

    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 capitalize">{type} Quests</h2>
        {filteredQuests.map(renderQuestItem)}
      </div>
    )
  }

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p>Loading quests...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-blue-200">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-bold text-blue-600">Select Date</h2>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleDateChange(-1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
            >
              Previous Day
            </button>
            <span className="text-xl font-medium text-gray-700">
              {format(displayDate, 'MMMM d, yyyy')}
            </span>
            <button
              onClick={() => handleDateChange(1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
            >
              Next Day
            </button>
          </div>
        </div>
      </div>

      {renderQuestSection('daily')}
      {renderQuestSection('weekly')}
      {renderQuestSection('monthly')}
      {renderQuestSection('custom')}
    </div>
  )
} 