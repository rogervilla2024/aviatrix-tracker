import { useState, useEffect } from 'react'
import LiveFeed from '../components/LiveFeed'
import { useStats } from '../hooks/useStats'
import { useWebSocket } from '../hooks/useWebSocket'
import { gameConfig } from '../config/gameConfig'
import {
  formatMultiplier,
  formatNumber,
  formatPercentage,
  formatCompactNumber,
  getMultiplierClass,
  formatRelativeTime
} from '../utils/formatters'

// Aircraft Icon Component
const AircraftIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
)

// Stats Card Component
const StatCard = ({ title, value, subtitle, icon: Icon, color = 'sky' }) => (
  <div className="aviation-card p-5 hover:scale-[1.02] transition-transform duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-sky-500/70 font-medium">{title}</p>
        <p className={`text-2xl md:text-3xl font-bold mt-1 text-${color}-600`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-sky-400 mt-1">{subtitle}</p>
        )}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
      )}
    </div>
  </div>
)

// NFT Feature Banner
const NFTBanner = () => (
  <div className="aviation-card bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200/50 p-4">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-purple-900 font-semibold flex items-center gap-2">
          NFT Aircraft Feature
          <span className="nft-badge">UNIQUE</span>
        </h3>
        <p className="text-purple-700/80 text-sm mt-1">
          {gameConfig.features.nftDescription}
        </p>
      </div>
    </div>
  </div>
)

// Responsible Gambling Warning
const ResponsibleGamblingCard = () => (
  <div className="aviation-card border-amber-200/50 bg-amber-50/50 p-5">
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-lg bg-amber-100">
        <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
      </div>
      <div>
        <h3 className="text-amber-900 font-semibold">Play Responsibly</h3>
        <ul className="mt-2 space-y-1 text-sm text-amber-700">
          {gameConfig.responsibleGambling.warnings.map((warning, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">-</span>
              {warning}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-3">
          <a
            href={gameConfig.responsibleGambling.helplines.international}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-600 hover:text-amber-800 underline"
          >
            Get Help
          </a>
          <span className="text-xs text-amber-500">
            18+ Only
          </span>
        </div>
      </div>
    </div>
  </div>
)

// Gambler's Fallacy Warning
const FallacyWarning = () => (
  <div className="bg-sky-100/50 rounded-xl p-4 border border-sky-200/50">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-sky-200/50">
        <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
        </svg>
      </div>
      <div>
        <p className="text-sm text-sky-800 font-medium">
          {gameConfig.disclaimer.gamblersFallacy}
        </p>
      </div>
    </div>
  </div>
)

function HomePage() {
  const { stats, history, loading, error, addFlight } = useStats()
  const [currentMultiplier, setCurrentMultiplier] = useState(null)
  const [gameState, setGameState] = useState('waiting') // waiting, flying, crashed

  // WebSocket for real-time updates
  const { isConnected, lastMessage } = useWebSocket('/ws', {
    onMessage: (data) => {
      if (data.type === 'multiplier') {
        setCurrentMultiplier(data.value)
        setGameState('flying')
      } else if (data.type === 'crash' || data.type === 'flight') {
        setGameState('crashed')
        addFlight(data)
        setTimeout(() => {
          setGameState('waiting')
          setCurrentMultiplier(null)
        }, 3000)
      }
    }
  })

  // Simulate game state for demo when not connected
  useEffect(() => {
    if (isConnected) return

    const simulateGame = () => {
      // Simulate flying phase
      setGameState('flying')
      let mult = 1.00

      const flyInterval = setInterval(() => {
        mult += 0.01 + Math.random() * 0.05
        setCurrentMultiplier(mult)

        // Random crash
        if (Math.random() < 0.02 || mult > 10) {
          clearInterval(flyInterval)
          setGameState('crashed')

          // Add to history
          addFlight({
            id: Date.now(),
            multiplier: parseFloat(mult.toFixed(2)),
            timestamp: new Date().toISOString()
          })

          // Reset after delay
          setTimeout(() => {
            setGameState('waiting')
            setCurrentMultiplier(null)
          }, 3000)
        }
      }, 100)

      return flyInterval
    }

    // Start simulation after initial load
    const startTimeout = setTimeout(() => {
      const interval = simulateGame()
      return () => clearInterval(interval)
    }, 2000)

    // Repeat simulation
    const repeatInterval = setInterval(() => {
      if (gameState === 'waiting') {
        simulateGame()
      }
    }, 8000)

    return () => {
      clearTimeout(startTimeout)
      clearInterval(repeatInterval)
    }
  }, [isConnected, gameState, addFlight])

  return (
    <div className="min-h-screen">
      {/* Hero Section with Live Multiplier */}
      <section className="sky-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            {/* Current Multiplier Display */}
            <div className="mb-6">
              <div className={`
                inline-block p-8 rounded-3xl backdrop-blur-sm
                ${gameState === 'flying' ? 'bg-white/20 animate-pulse-glow' : 'bg-white/10'}
                ${gameState === 'crashed' ? 'bg-red-500/30' : ''}
              `}>
                <div className="flex items-center justify-center gap-4 mb-2">
                  <AircraftIcon className={`w-12 h-12 ${gameState === 'flying' ? 'aircraft-flying' : ''} ${gameState === 'crashed' ? 'aircraft-takeoff' : ''}`} />
                </div>
                <p className={`multiplier-display ${currentMultiplier ? getMultiplierClass(currentMultiplier) : 'text-white/50'}`}>
                  {currentMultiplier ? formatMultiplier(currentMultiplier) : '-.--x'}
                </p>
                <p className="text-sky-100 text-sm mt-2">
                  {gameState === 'waiting' && 'Waiting for next flight...'}
                  {gameState === 'flying' && 'Aircraft in flight!'}
                  {gameState === 'crashed' && 'Flight ended!'}
                </p>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Aviatrix Flight Tracker
            </h1>
            <p className="text-lg text-sky-100 max-w-2xl mx-auto mb-6">
              Real-time flight statistics and analytics for {gameConfig.name} by {gameConfig.provider}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sky-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{formatPercentage(gameConfig.rtp)}</p>
                <p className="text-xs">RTP</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{formatCompactNumber(gameConfig.maxMultiplier)}x</p>
                <p className="text-xs">Max Multiplier</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{formatCompactNumber(stats.totalFlights)}</p>
                <p className="text-xs">Total Flights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12" id="statistics">
        <div className="container mx-auto px-4">
          {/* NFT Feature Banner */}
          <div className="mb-8">
            <NFTBanner />
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Flights"
              value={formatCompactNumber(stats.totalFlights)}
              subtitle="All time"
              icon={AircraftIcon}
            />
            <StatCard
              title="Average Multiplier"
              value={formatMultiplier(stats.averageMultiplier)}
              subtitle="Across all flights"
              color="sky"
            />
            <StatCard
              title="Highest Multiplier"
              value={formatMultiplier(stats.highestMultiplier)}
              subtitle="All time record"
              color="amber"
            />
            <StatCard
              title="Last Hour"
              value={formatNumber(stats.lastHourFlights)}
              subtitle="Flights tracked"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Live Feed - Takes 2 columns */}
            <div className="md:col-span-2" id="history">
              <LiveFeed history={history} maxItems={20} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Distribution Stats */}
              <div className="aviation-card p-5">
                <h3 className="text-lg font-semibold text-sky-900 mb-4">
                  Multiplier Distribution
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-sky-600">Below 2x</span>
                      <span className="font-medium text-sky-900">
                        {formatPercentage(stats.crashedBelow2x)}
                      </span>
                    </div>
                    <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400 rounded-full transition-all duration-500"
                        style={{ width: `${stats.crashedBelow2x || 52}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-sky-600">Above 10x</span>
                      <span className="font-medium text-sky-900">
                        {formatPercentage(stats.above10x)}
                      </span>
                    </div>
                    <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-500"
                        style={{ width: `${(stats.above10x || 8.7) * 5}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-sky-600">Above 100x</span>
                      <span className="font-medium text-sky-900">
                        {formatPercentage(stats.above100x)}
                      </span>
                    </div>
                    <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${(stats.above100x || 0.89) * 20}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gambler's Fallacy Warning */}
              <FallacyWarning />

              {/* Responsible Gambling */}
              <ResponsibleGamblingCard />

              {/* Game Info */}
              <div className="aviation-card p-5">
                <h3 className="text-lg font-semibold text-sky-900 mb-3">
                  Game Information
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-sky-500">Provider</dt>
                    <dd className="text-sky-900 font-medium">{gameConfig.provider}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sky-500">RTP</dt>
                    <dd className="text-sky-900 font-medium">{formatPercentage(gameConfig.rtp)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sky-500">House Edge</dt>
                    <dd className="text-sky-900 font-medium">{formatPercentage(gameConfig.houseEdge)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sky-500">Max Multiplier</dt>
                    <dd className="text-sky-900 font-medium">{formatCompactNumber(gameConfig.maxMultiplier)}x</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-8 bg-sky-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">
              Independent Analytics Platform
            </h2>
            <p className="text-sky-600 text-sm mb-4">
              {gameConfig.disclaimer.affiliation}
            </p>
            <p className="text-sky-500 text-xs">
              {gameConfig.disclaimer.educational} {gameConfig.disclaimer.noGuarantee}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
