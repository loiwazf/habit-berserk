import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Habit Berserk</h1>
      <p className="text-xl mb-8">Your RPG-themed habit tracker</p>
      <Link 
        href="/dashboard" 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Go to Dashboard
      </Link>
    </main>
  )
} 