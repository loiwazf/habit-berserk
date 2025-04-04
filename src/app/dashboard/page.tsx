'use client'

import { useStore } from '@/stores/useStore'
import QuestList from '@/components/QuestList'
import CharacterStats from '@/components/CharacterStats'
import QuestForm from '@/components/QuestForm'

export default function DashboardPage() {
  const { quests } = useStore()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Character Stats</h2>
          <CharacterStats />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Create New Quest</h2>
          <QuestForm />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Active Quests</h2>
        <QuestList quests={quests} />
      </div>
    </div>
  )
} 