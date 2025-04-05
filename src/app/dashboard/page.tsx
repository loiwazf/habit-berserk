'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/stores/useStore'
import QuestList from '@/components/QuestList'
import CharacterStats from '@/components/CharacterStats'
import QuestForm from '@/components/QuestForm'
import Link from 'next/link'

export default function DashboardPage() {
  const { quests, createDefaultQuests, refreshDailyQuests, resetState, character, forceRefreshDailyQuests } = useStore()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showDebug, setShowDebug] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Log initial state when component mounts
  useEffect(() => {
    console.log('Dashboard mounted with initial state:')
    console.log('Character:', character)
    console.log('Quests:', quests)
    
    // Check if running in development mode
    console.log('Environment:', process.env.NODE_ENV)
    console.log('Is development mode:', process.env.NODE_ENV === 'development')
    
    // Check localStorage directly
    try {
      const storedCharacter = localStorage.getItem('habit-berserk-character')
      const storedQuests = localStorage.getItem('habit-berserk-quests')
      console.log('Stored character:', storedCharacter ? JSON.parse(storedCharacter) : 'Not found')
      console.log('Stored quests:', storedQuests ? JSON.parse(storedQuests) : 'Not found')
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    }
  }, [])

  useEffect(() => {
    // Create default quests if they don't exist
    createDefaultQuests()
    
    // Refresh daily quests to reset completion status for the new day
    refreshDailyQuests()
    
    // Set up an interval to refresh daily quests at midnight
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime()
    
    const timer = setTimeout(() => {
      refreshDailyQuests()
    }, timeUntilMidnight)
    
    return () => clearTimeout(timer)
  }, [createDefaultQuests, refreshDailyQuests])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetState()
      // Force a page reload to ensure all components are re-rendered
      window.location.reload()
    }
  }

  const handleForceRefresh = () => {
    if (window.confirm('Are you sure you want to force refresh the daily quests? This will reset all daily quests.')) {
      forceRefreshDailyQuests()
      // Force a page reload to ensure all components are re-rendered
      window.location.reload()
    }
  }

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear all data and reload the page? This will reset everything.')) {
      // Clear all localStorage
      localStorage.clear()
      // Force a page reload
      window.location.reload()
    }
  }

  const handleForceUpdate = () => {
    // Force a state update by updating the character
    const updatedCharacter = { ...character }
    updatedCharacter.stats = { ...character.stats }
    // Increment one stat to force a change
    updatedCharacter.stats.strength += 1
    useStore.getState().updateCharacter(updatedCharacter)
    
    // Force a page reload
    window.location.reload()
  }

  const toggleDebug = () => {
    setShowDebug(!showDebug)
  }

  // Only render the full content after client-side hydration is complete
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Dashboard</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={toggleDebug}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button>
          <Link
            href="/simple-test"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Simple Test
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <QuestList
            quests={quests}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
          <div className="mt-6">
            <QuestForm />
          </div>
        </div>
        <div>
          <CharacterStats />
          <div className="mt-6 space-y-2">
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reset Progress
            </button>
            <button
              onClick={handleForceRefresh}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Force Refresh Daily Quests
            </button>
            <button
              onClick={handleClearCache}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Clear Cache
            </button>
            <button
              onClick={handleForceUpdate}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Force Update
            </button>
          </div>
        </div>
      </div>

      {showDebug && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Debug Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">Character:</h3>
              <pre className="bg-white p-2 rounded overflow-auto max-h-96">
                {JSON.stringify(character, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-bold mb-2">Quests:</h3>
              <pre className="bg-white p-2 rounded overflow-auto max-h-96">
                {JSON.stringify(quests, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 