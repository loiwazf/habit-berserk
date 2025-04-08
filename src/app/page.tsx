import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Habit Berserk</h1>
      <p className="text-xl mb-8">Your RPG-themed habit tracker</p>
      <div className="flex flex-col gap-4">
        <Link 
          href="/auth/signin" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center"
        >
          Sign In
        </Link>
      </div>
    </main>
  )
} 