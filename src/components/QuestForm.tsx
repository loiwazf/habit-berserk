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
    statBoosts: {
      strength: 0,
      intelligence: 0,
      skill: 0,
      wisdom: 0,
      spirit: 0,
    },
    dueDate: '',
    isPersistent: false,
    maxCompletions: 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addQuest({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      xpReward: formData.xpReward,
      statBoosts: formData.statBoosts,
      dueDate: formData.dueDate || undefined,
      isPersistent: formData.isPersistent,
      maxCompletions: formData.maxCompletions,
    })
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'daily',
      xpReward: 50,
      statBoosts: {
        strength: 0,
        intelligence: 0,
        skill: 0,
        wisdom: 0,
        spirit: 0,
      },
      dueDate: '',
      isPersistent: false,
      maxCompletions: 1,
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
          onChange={(e) => setFormData({ ...formData, xpReward: Number(e.target.value) })}
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
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPersistent"
          checked={formData.isPersistent}
          onChange={(e) => setFormData({ ...formData, isPersistent: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="isPersistent"
          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
        >
          Persistent Quest
        </label>
      </div>

      {formData.isPersistent && (
        <div>
          <label
            htmlFor="maxCompletions"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Max Completions
          </label>
          <input
            type="number"
            id="maxCompletions"
            value={formData.maxCompletions}
            onChange={(e) => setFormData({ ...formData, maxCompletions: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            min="1"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create Quest
      </button>
    </form>
  )
} 