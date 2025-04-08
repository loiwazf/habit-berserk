'use client'

import { useState } from 'react'
import { useStore } from '@/stores/useStore'
import { QuestType } from '@/types/quest'

export default function QuestForm() {
  const { addQuest } = useStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<QuestType>('custom')
  const [xpReward, setXpReward] = useState(50)
  const [showForm, setShowForm] = useState(false)
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
      title: title.trim(),
      description: description.trim(),
      type,
      xpReward,
      xp: xpReward,
      statBoosts,
      isPersistent: false,
      maxCompletions: 1
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
    setShowForm(false)
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full px-4 py-2 accent-bg text-white rounded accent-hover"
      >
        ➕ Add New Quest
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter quest title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter quest description"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as QuestType)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          XP Reward
        </label>
        <input
          type="number"
          value={xpReward}
          onChange={(e) => setXpReward(Number(e.target.value))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          min="0"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Stat Boosts
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Strength</label>
            <input
              type="number"
              value={statBoosts.strength}
              onChange={(e) =>
                setStatBoosts((prev) => ({
                  ...prev,
                  strength: Number(e.target.value)
                }))
              }
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Intelligence
            </label>
            <input
              type="number"
              value={statBoosts.intelligence}
              onChange={(e) =>
                setStatBoosts((prev) => ({
                  ...prev,
                  intelligence: Number(e.target.value)
                }))
              }
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Skill</label>
            <input
              type="number"
              value={statBoosts.skill}
              onChange={(e) =>
                setStatBoosts((prev) => ({
                  ...prev,
                  skill: Number(e.target.value)
                }))
              }
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Wisdom</label>
            <input
              type="number"
              value={statBoosts.wisdom}
              onChange={(e) =>
                setStatBoosts((prev) => ({
                  ...prev,
                  wisdom: Number(e.target.value)
                }))
              }
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Spirit</label>
            <input
              type="number"
              value={statBoosts.spirit}
              onChange={(e) =>
                setStatBoosts((prev) => ({
                  ...prev,
                  spirit: Number(e.target.value)
                }))
              }
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 accent-bg text-white rounded accent-hover"
        >
          Add Quest
        </button>
      </div>
    </form>
  )
} 