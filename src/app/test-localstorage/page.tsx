'use client'

import { useState, useEffect } from 'react'
import TestNavigation from '@/components/TestNavigation'

export default function TestLocalStorage() {
  const [testValue, setTestValue] = useState<string>('')
  const [savedValue, setSavedValue] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    try {
      // Try to read from localStorage
      const storedValue = localStorage.getItem('test-key')
      setSavedValue(storedValue || 'No value found')
    } catch (err) {
      setError(`Error reading from localStorage: ${err}`)
    }
  }, [])

  const handleSave = () => {
    try {
      // Try to save to localStorage
      localStorage.setItem('test-key', testValue)
      setSavedValue(testValue)
      setError('')
    } catch (err) {
      setError(`Error saving to localStorage: ${err}`)
    }
  }

  const handleClear = () => {
    try {
      // Try to clear localStorage
      localStorage.clear()
      setSavedValue('No value found')
      setError('')
    } catch (err) {
      setError(`Error clearing localStorage: ${err}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">LocalStorage Test</h1>
      
      <TestNavigation />
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Test LocalStorage</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="test-value">
            Enter a value to save:
          </label>
          <input
            id="test-value"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save to LocalStorage
          </button>
          
          <button
            onClick={handleClear}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Clear LocalStorage
          </button>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Current Value in LocalStorage:</h3>
          <div className="bg-gray-100 p-4 rounded">
            <pre>{savedValue}</pre>
          </div>
        </div>
        
        {error && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-red-600">Error:</h3>
            <div className="bg-red-100 p-4 rounded text-red-700">
              <pre>{error}</pre>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Browser Information:</h3>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'Not available'}</p>
            <p><strong>LocalStorage Available:</strong> {typeof window !== 'undefined' && window.localStorage ? 'Yes' : 'No'}</p>
            <p><strong>Cookies Enabled:</strong> {typeof window !== 'undefined' && window.navigator.cookieEnabled ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 