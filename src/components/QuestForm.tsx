'use client'

import React, { useState } from 'react'
import { useStore } from '@/stores/useStore'
import { QuestType } from '@/types/quest'

export default function QuestForm() {
  const { addQuest } = useStore()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'daily' as QuestType,
    xpReward: 50,
    xp: 50,
    statBoosts: {
      strength: 0,
      intelligence: 0,
      skill: 0,
      wisdom: 0,
      spirit: 0,
    },
    isPersistent: false,
    completionCount: 0,
    maxCompletions: 1,
    completedInstances: [],
    failedInstances: [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create a new quest object with the correct type
    const newQuest = {
      title: formData.title,
      description: formData.description,
      type: formData.type as QuestType,
      xpReward: formData.xpReward,
      xp: formData.xp,
      statBoosts: formData.statBoosts,
      isPersistent: formData.isPersistent,
      completionCount: formData.completionCount,
      maxCompletions: formData.maxCompletions,
      completedInstances: formData.completedInstances,
      failedInstances: formData.failedInstances,
    }
    
    // Add the quest to the store
    addQuest(newQuest)
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'daily',
      xpReward: 50,
      xp: 50,
      statBoosts: {
        strength: 0,
        intelligence: 0,
        skill: 0,
        wisdom: 0,
        spirit: 0,
      },
      isPersistent: false,
      completionCount: 0,
      maxCompletions: 1,
      completedInstances: [],
      failedInstances: [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Type
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestType })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="xpReward"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          XP Reward
        </label>
        <input
          type="number"
          id="xpReward"
          value={formData.xpReward}
          onChange={(e) => {
            const value = Number(e.target.value)
            setFormData({ 
              ...formData, 
              xpReward: value,
              xp: value 
            })
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          min="1"
          required
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="strength"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Strength Boost
          </label>
          <input
            type="number"
            id="strength"
            value={formData.statBoosts.strength}
            onChange={(e) =>
              setFormData({
                ...formData,
                statBoosts: {
                  ...formData.statBoosts,
                  strength: Number(e.target.value),
                },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            min="0"
          />
        </div>

        <div>
          <label
            htmlFor="intelligence"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Intelligence Boost
          </label>
          <input
            type="number"
            id="intelligence"
            value={formData.statBoosts.intelligence}
            onChange={(e) =>
              setFormData({
                ...formData,
                statBoosts: {
                  ...formData.statBoosts,
                  intelligence: Number(e.target.value),
                },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            min="0"
          />
        </div>

        <div>
          <label
            htmlFor="skill"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Skill Boost
          </label>
          <input
            type="number"
            id="skill"
            value={formData.statBoosts.skill}
            onChange={(e) =>
              setFormData({
                ...formData,
                statBoosts: {
                  ...formData.statBoosts,
                  skill: Number(e.target.value),
                },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            min="0"
          />
        </div>

        <div>
          <label
            htmlFor="wisdom"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Wisdom Boost
          </label>
          <input
            type="number"
            id="wisdom"
            value={formData.statBoosts.wisdom}
            onChange={(e) =>
              setFormData({
                ...formData,
                statBoosts: {
                  ...formData.statBoosts,
                  wisdom: Number(e.target.value),
                },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            min="0"
          />
        </div>

        <div>
          <label
            htmlFor="spirit"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Spirit Boost
          </label>
          <input
            type="number"
            id="spirit"
            value={formData.statBoosts.spirit}
            onChange={(e) =>
              setFormData({
                ...formData,
                statBoosts: {
                  ...formData.statBoosts,
                  spirit: Number(e.target.value),
                },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            min="0"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="isPersistent"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Persistent Quest
        </label>
        <input
          type="checkbox"
          id="isPersistent"
          checked={formData.isPersistent}
          onChange={(e) => setFormData({ ...formData, isPersistent: e.target.checked })}
          className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="maxCompletions"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Maximum Completions
        </label>
        <input
          type="number"
          id="maxCompletions"
          value={formData.maxCompletions}
          onChange={(e) => setFormData({ ...formData, maxCompletions: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          min="1"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Add Quest
      </button>
    </form>
  )
} 