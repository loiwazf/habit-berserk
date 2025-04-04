'use client'

import { useStore } from '@/stores/useStore'
import QuestList from '@/components/QuestList'
import QuestCalendar from '@/components/QuestCalendar'
import CharacterStats from '@/components/CharacterStats'
import QuestForm from '@/components/QuestForm'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { createDefaultQuests } = useStore()

  // Initialize default quests on component mount
  useEffect(() => {
    createDefaultQuests()
  }, [createDefaultQuests])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Character Stats</h2>
          <CharacterStats />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Create Quest</h2>
          <QuestForm />
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Quests</h2>
        <QuestList />
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Quest History</h2>
        <QuestCalendar />
      </div>
    </div>
  )
} 