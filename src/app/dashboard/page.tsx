'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/stores/useStore'
import QuestList from '@/components/QuestList'
import CharacterStats from '@/components/CharacterStats'
import QuestForm from '@/components/QuestForm'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { quests, refreshDailyQuests, resetProgress, character, forceRefreshDailyQuests, initialize, saveState } = useStore()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showDebug, setShowDebug] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debug logging for session
  useEffect(() => {
    console.log('Session status:', status)
    console.log('Full session data:', session)
    console.log('User ID from session:', session?.user?.id)
    console.log('User email from session:', session?.user?.email)
  }, [status, session])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  // Initialize store with user session
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      console.log('Initializing store with user email:', session.user.email)
      initialize(session.user.email)
    } else {
      console.log('Cannot initialize store:', { status, userEmail: session?.user?.email })
    }
  }, [status, session, initialize])

  // Save state when it changes
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      console.log('Saving state for user:', session.user.email)
      console.log('Current state:', { character, quests })
      saveState()
    } else {
      console.log('Cannot save state:', { status, userEmail: session?.user?.email })
    }
  }, [character, quests, status, session, saveState])

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Log initial state when component mounts
  useEffect(() => {
    try {
      console.log('Dashboard mounted with initial state:')
      console.log('Character:', character)
      console.log('Quests:', quests)
      
      // Check if running in development mode
      console.log('Environment:', process.env.NODE_ENV)
      console.log('Is development mode:', process.env.NODE_ENV === 'development')
    } catch (error) {
      console.error('Error in dashboard initialization:', error)
      setError(`Error in dashboard initialization: ${error}`)
    }
  }, [])

  useEffect(() => {
    try {
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
    } catch (error) {
      console.error('Error in quest initialization:', error)
      setError(`Error in quest initialization: ${error}`)
    }
  }, [refreshDailyQuests])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      try {
        resetProgress()
        // Force a page reload to ensure all components are re-rendered
        window.location.reload()
      } catch (error) {
        console.error('Error resetting state:', error)
        setError(`Error resetting state: ${error}`)
      }
    }
  }

  const handleForceRefresh = () => {
    if (window.confirm('Are you sure you want to force refresh the daily quests? This will reset all daily quests.')) {
      try {
        forceRefreshDailyQuests()
        // Force a page reload to ensure all components are re-rendered
        window.location.reload()
      } catch (error) {
        console.error('Error refreshing daily quests:', error)
        setError(`Error refreshing daily quests: ${error}`)
      }
    }
  }

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear all data and reload the page? This will reset everything.')) {
      try {
        useStore.getState().clearCache()
        // Force a page reload
        window.location.reload()
      } catch (error) {
        console.error('Error clearing cache:', error)
        setError(`Error clearing cache: ${error}`)
      }
    }
  }

  const toggleDebug = () => {
    setShowDebug(!showDebug)
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Dashboard</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <p>Loading...</p>
        </div>
      </div>
    )
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
        <h1 className="text-4xl font-bold accent-color">Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={toggleDebug}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button>
          <Link
            href="/simple-test"
            className="px-4 py-2 accent-bg text-white rounded accent-hover"
          >
            Simple Test
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

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
              className="w-full px-4 py-2 accent-bg text-white rounded accent-hover"
            >
              Reset Progress
            </button>
            <button
              onClick={handleForceRefresh}
              className="w-full px-4 py-2 accent-bg text-white rounded accent-hover"
            >
              Force Refresh Daily Quests
            </button>
            <button
              onClick={handleClearCache}
              className="w-full px-4 py-2 accent-bg text-white rounded accent-hover"
            >
              Clear Cache
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