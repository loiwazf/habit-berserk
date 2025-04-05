'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TestNavigation() {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    return pathname === path
  }
  
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg mb-8">
      <h2 className="text-xl font-bold mb-4">Test Pages</h2>
      <div className="flex flex-wrap gap-2">
        <Link 
          href="/test-localstorage" 
          className={`px-4 py-2 rounded ${isActive('/test-localstorage') ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          LocalStorage Test
        </Link>
        <Link 
          href="/test-store" 
          className={`px-4 py-2 rounded ${isActive('/test-store') ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Zustand Store Test
        </Link>
        <Link 
          href="/test-environment" 
          className={`px-4 py-2 rounded ${isActive('/test-environment') ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Environment Test
        </Link>
        <Link 
          href="/dashboard" 
          className={`px-4 py-2 rounded ${isActive('/dashboard') ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
} 