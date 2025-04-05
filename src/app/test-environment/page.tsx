'use client'

import { useState, useEffect } from 'react'
import TestNavigation from '@/components/TestNavigation'

export default function TestEnvironment() {
  const [environment, setEnvironment] = useState<string>('')
  const [isDev, setIsDev] = useState<boolean>(false)
  const [isProd, setIsProd] = useState<boolean>(false)
  const [isTest, setIsTest] = useState<boolean>(false)
  const [isBrowser, setIsBrowser] = useState<boolean>(false)
  const [isServer, setIsServer] = useState<boolean>(false)
  const [windowObj, setWindowObj] = useState<any>(null)
  const [documentObj, setDocumentObj] = useState<any>(null)
  const [localStorageObj, setLocalStorageObj] = useState<any>(null)

  useEffect(() => {
    // Check environment
    setEnvironment(process.env.NODE_ENV || 'unknown')
    setIsDev(process.env.NODE_ENV === 'development')
    setIsProd(process.env.NODE_ENV === 'production')
    setIsTest(process.env.NODE_ENV === 'test')
    
    // Check if running in browser or server
    setIsBrowser(typeof window !== 'undefined')
    setIsServer(typeof window === 'undefined')
    
    // Check window and document objects
    if (typeof window !== 'undefined') {
      setWindowObj({
        location: window.location.href,
        userAgent: window.navigator.userAgent,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      })
      
      setDocumentObj({
        title: document.title,
        readyState: document.readyState,
      })
      
      // Check localStorage
      try {
        setLocalStorageObj({
          available: !!window.localStorage,
          test: localStorage.getItem('test-key'),
        })
      } catch (err: any) {
        setLocalStorageObj({
          available: false,
          error: err.toString(),
        })
      }
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Environment Test</h1>
      
      <TestNavigation />
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Environment Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Environment:</h3>
            <p><strong>NODE_ENV:</strong> {environment}</p>
            <p><strong>Is Development:</strong> {isDev ? 'Yes' : 'No'}</p>
            <p><strong>Is Production:</strong> {isProd ? 'Yes' : 'No'}</p>
            <p><strong>Is Test:</strong> {isTest ? 'Yes' : 'No'}</p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Runtime:</h3>
            <p><strong>Is Browser:</strong> {isBrowser ? 'Yes' : 'No'}</p>
            <p><strong>Is Server:</strong> {isServer ? 'Yes' : 'No'}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Window Object:</h3>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre>{JSON.stringify(windowObj, null, 2)}</pre>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Document Object:</h3>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre>{JSON.stringify(documentObj, null, 2)}</pre>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">LocalStorage:</h3>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre>{JSON.stringify(localStorageObj, null, 2)}</pre>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Environment Variables:</h3>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <p><strong>NEXT_PUBLIC_APP_URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</p>
            <p><strong>NEXT_TELEMETRY_DISABLED:</strong> {process.env.NEXT_TELEMETRY_DISABLED || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 