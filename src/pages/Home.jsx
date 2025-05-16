import { useState, useEffect } from 'react'
import MainFeature from '../components/MainFeature'
import { getIcon } from '../utils/iconUtils'

const CheckCircleIcon = getIcon('CheckCircle')
const ClipboardListIcon = getIcon('ClipboardList')

const Home = () => {
  const [greeting, setGreeting] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    completed: 0
  })

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning')
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good afternoon')
    } else {
      setGreeting('Good evening')
    }
  }, [])

  // This function will be passed to MainFeature to update stats
  const updateStats = (newStats) => {
    setStats(newStats)
  }

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-primary to-accent text-white py-6 md:py-8 lg:py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">TaskFlow</h1>
              <p className="text-primary-light">{greeting}! What's on your agenda today?</p>
            </div>
            
            <div className="flex gap-6 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-full">
                  <ClipboardListIcon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-primary-light">Total Tasks</p>
                  <p className="text-xl font-semibold">{stats.total}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-full">
                  <CheckCircleIcon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-primary-light">Completed</p>
                  <p className="text-xl font-semibold">{stats.completed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-10 lg:py-12">
        <MainFeature updateStats={updateStats} />
      </main>

      <footer className="py-6 bg-surface-100 dark:bg-surface-800 mt-auto">
        <div className="container mx-auto px-4 md:px-6 text-center text-surface-500 dark:text-surface-400 text-sm">
          <p>© {new Date().getFullYear()} TaskFlow. A simple yet powerful task manager.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home