'use client'

import { useState } from 'react'
import { useStore } from '@/stores/useStore'
import { QuestType } from '@/types/quest'

export default function QuestForm() {
  const { addQuest } = useStore()
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<QuestType>('custom')
  const [xpReward, setXpReward] = useState(50)
  const [statBoosts, setStatBoosts] = useState({
    strength: 0,
    intelligence: 0,
    skill: 0,
    wisdom: 0,
    spirit: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return
    
    addQuest({
      title,
      description,
      type,
      xpReward,
      xp: xpReward,
      statBoosts,
      isPersistent: false,
      completionCount: 0,
      maxCompletions: 1,
      completedInstances: [],
      failedInstances: []
    })
    
    // Reset form
    setTitle('')
    setDescription('')
    setType('custom')
    setXpReward(50)
    setStatBoosts({
      strength: 0,
      intelligence: 0,
      skill: 0,
      wisdom: 0,
      spirit: 0
    })
    
    // Hide form after submission
    setIsFormVisible(false)
  }

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible)
  }

  return (
    <div className="mt-6">
      <button
        onClick={toggleForm}
        className="w-full px-4 py-2 accent-bg text-white rounded accent-hover mb-4"
      >
        {isFormVisible ? 'Hide Add Quest Form' : 'Add New Quest'}
      </button>
      
      {isFormVisible && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
          <h2 className="text-xl font-bold mb-4 accent-color">Create New Quest</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Quest Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                placeholder="Enter quest title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                placeholder="Enter quest description"
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Quest Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as QuestType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="xpReward" className="block text-sm font-medium text-gray-700 mb-1">
                XP Reward
              </label>
              <input
                type="number"
                id="xpReward"
                value={xpReward}
                onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stat Boosts
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div>
                  <label htmlFor="strength" className="block text-xs text-gray-600">Strength</label>
                  <input
                    type="number"
                    id="strength"
                    value={statBoosts.strength}
                    onChange={(e) => setStatBoosts({...statBoosts, strength: parseInt(e.target.value) || 0})}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="intelligence" className="block text-xs text-gray-600">Intelligence</label>
                  <input
                    type="number"
                    id="intelligence"
                    value={statBoosts.intelligence}
                    onChange={(e) => setStatBoosts({...statBoosts, intelligence: parseInt(e.target.value) || 0})}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="skill" className="block text-xs text-gray-600">Skill</label>
                  <input
                    type="number"
                    id="skill"
                    value={statBoosts.skill}
                    onChange={(e) => setStatBoosts({...statBoosts, skill: parseInt(e.target.value) || 0})}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="wisdom" className="block text-xs text-gray-600">Wisdom</label>
                  <input
                    type="number"
                    id="wisdom"
                    value={statBoosts.wisdom}
                    onChange={(e) => setStatBoosts({...statBoosts, wisdom: parseInt(e.target.value) || 0})}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="spirit" className="block text-xs text-gray-600">Spirit</label>
                  <input
                    type="number"
                    id="spirit"
                    value={statBoosts.spirit}
                    onChange={(e) => setStatBoosts({...statBoosts, spirit: parseInt(e.target.value) || 0})}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-4 py-2 accent-bg text-white rounded accent-hover"
              >
                Create Quest
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
} 