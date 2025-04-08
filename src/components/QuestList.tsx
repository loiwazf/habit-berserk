'use client'

import { useStore } from '@/stores/useStore'
import { Quest, QuestType } from '@/types/quest'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { XCircleIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline'
import ConfirmModal from '@/components/ConfirmModal'

interface QuestListProps {
  quests: Quest[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
}

export default function QuestList({ quests, selectedDate, onDateSelect }: QuestListProps) {
  const { completeQuest, failQuest, deleteQuest, updateQuest, uncheckQuest } = useStore()
  const [displayDate, setDisplayDate] = useState<Date>(selectedDate || new Date())
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'complete' | 'delete' | null>(null)
  const character = useStore(state => state.character)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (selectedDate) {
      setDisplayDate(selectedDate)
    }
  }, [selectedDate])

  const handleDateChange = (days: number) => {
    try {
      const newDate = new Date(displayDate)
      newDate.setDate(newDate.getDate() + days)
      setDisplayDate(newDate)
      if (onDateSelect) {
        onDateSelect(newDate)
      }
    } catch (error) {
      console.error('Error changing date:', error)
      setError(`Error changing date: ${error}`)
    }
  }

  const isQuestCompleted = (quest: Quest) => {
    try {
      return (quest.completedInstances || []).some(
        instance => new Date(instance.date).toDateString() === displayDate.toDateString()
      )
    } catch (error) {
      console.error('Error checking quest completion:', error)
      setError(`Error checking quest completion: ${error}`)
      return false
    }
  }

  const isQuestFailed = (quest: Quest) => {
    try {
      return (quest.failedInstances || []).some(
        instance => new Date(instance.date).toDateString() === displayDate.toDateString()
      )
    } catch (error) {
      console.error('Error checking quest failure:', error)
      setError(`Error checking quest failure: ${error}`)
      return false
    }
  }

  const getQuestStatus = (quest: Quest) => {
    try {
      const displayDateStr = displayDate.toISOString().split('T')[0]
      const isCompletedForDate = quest.completedInstances?.some(
        instance => instance.date === displayDateStr
      )

      if (isCompletedForDate) return 'completed'
      return 'active'
    } catch (error) {
      console.error('Error getting quest status:', error)
      setError(`Error getting quest status: ${error}`)
      return 'active'
    }
  }

  const getStreakDisplay = (quest: Quest) => {
    if (quest.type !== 'daily') return null

    const streak = quest.completedInstances?.reduce((count, instance) => {
      const instanceDate = new Date(instance.date)
      const displayDateCopy = new Date(displayDate)
      displayDateCopy.setHours(0, 0, 0, 0)

      // Check if the instance is from displayDate or the day before
      if (instanceDate >= displayDateCopy || 
          (instanceDate < displayDateCopy && 
           instanceDate >= new Date(displayDateCopy.getTime() - 24 * 60 * 60 * 1000))) {
        return count + 1
      }
      return count
    }, 0) || 0

    return streak > 0 ? `🔥 ${streak}` : null
  }

  const handleCompleteQuest = (questId: string) => {
    try {
      const quest = quests.find(q => q.id === questId)
      if (!quest) return
      
      // Check if the quest is already completed for the selected date
      const isCompleted = isQuestCompleted(quest)
      
      if (isCompleted) {
        // If already completed, uncheck it and subtract XP
        uncheckQuest(questId, displayDate)
      } else {
        // If not completed, complete it
        completeQuest(questId, displayDate)
      }
    } catch (error) {
      console.error('Error completing quest:', error)
      setError(`Error completing quest: ${error}`)
    }
  }

  const handleFailQuest = (questId: string) => {
    try {
      const quest = quests.find(q => q.id === questId)
      if (!quest) return
      
      // Check if the quest is already failed for the selected date
      const isFailed = isQuestFailed(quest)
      
      if (isFailed) {
        // If already failed, remove the failure for the selected date
        const displayDateStr = displayDate.toISOString().split('T')[0]
        const updatedQuest = {
          ...quest,
          failedInstances: quest.failedInstances.filter(
            instance => instance.date !== displayDateStr
          )
        }
        updateQuest(updatedQuest)
      } else {
        // If not failed, fail it
        failQuest(questId)
      }
    } catch (error) {
      console.error('Error failing quest:', error)
      setError(`Error failing quest: ${error}`)
    }
  }

  const handleDeleteQuest = (questId: string) => {
    try {
      deleteQuest(questId)
    } catch (error) {
      console.error('Error deleting quest:', error)
      setError(`Error deleting quest: ${error}`)
    }
  }

  const handleAction = (quest: Quest, type: 'complete' | 'delete') => {
    setSelectedQuest(quest)
    setActionType(type)
    setIsConfirmModalOpen(true)
  }

  const handleConfirm = () => {
    if (!selectedQuest || !actionType) return

    switch (actionType) {
      case 'complete':
        handleCompleteQuest(selectedQuest.id)
        break
      case 'delete':
        handleDeleteQuest(selectedQuest.id)
        break
    }

    setIsConfirmModalOpen(false)
    setSelectedQuest(null)
    setActionType(null)
  }

  const handleCancel = () => {
    setIsConfirmModalOpen(false)
    setSelectedQuest(null)
    setActionType(null)
  }

  const renderQuestItem = (quest: Quest) => {
    try {
      const status = getQuestStatus(quest)
      const streakDisplay = getStreakDisplay(quest)

      return (
        <div
          key={quest.id}
          className={`p-4 rounded-lg mb-2 ${
            status === 'completed'
              ? 'bg-green-100 border border-green-200'
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{quest.title}</h3>
              <p className="text-gray-600">{quest.description}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {quest.type.charAt(0).toUpperCase() + quest.type.slice(1)}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{quest.xpReward} XP</span>
                {streakDisplay && (
                  <>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{streakDisplay}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-500">
                {quest.xpReward} XP
              </span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {status === 'completed' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAction(quest, 'complete')}
                  className="text-green-500 hover:text-green-700 mr-2"
                >
                  Uncheck
                </button>
                <button
                  onClick={() => handleAction(quest, 'delete')}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            )}
            {status === 'active' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAction(quest, 'complete')}
                  className="text-green-500 hover:text-green-700 mr-2"
                >
                  ✓
                </button>
                <button
                  onClick={() => handleAction(quest, 'delete')}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )
    } catch (error) {
      console.error('Error rendering quest item:', error)
      setError(`Error rendering quest item: ${error}`)
      return null
    }
  }

  const renderQuestSection = (type: QuestType) => {
    try {
      const filteredQuests = quests.filter(quest => quest.type === type)
      if (filteredQuests.length === 0) return null

      return (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 capitalize">{type} Quests</h2>
          {filteredQuests.map(renderQuestItem)}
        </div>
      )
    } catch (error) {
      console.error(`Error rendering ${type} quest section:`, error)
      setError(`Error rendering ${type} quest section: ${error}`)
      return null
    }
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
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleDateChange(-1)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            &lt;
          </button>
          <span className="text-sm font-medium text-gray-700">
            {format(displayDate, 'MMMM d, yyyy')}
          </span>
          <button
            onClick={() => handleDateChange(1)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            &gt;
          </button>
        </div>
      </div>

      {renderQuestSection('daily')}
      {renderQuestSection('weekly')}
      {renderQuestSection('monthly')}
      {renderQuestSection('custom')}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={
          actionType === 'complete'
            ? 'Complete Quest'
            : 'Delete Quest'
        }
        message={
          actionType === 'complete'
            ? 'Are you sure you want to mark this quest as completed?'
            : 'Are you sure you want to delete this quest?'
        }
      />
    </div>
  )
} 