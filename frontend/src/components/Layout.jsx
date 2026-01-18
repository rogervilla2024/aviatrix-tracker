import { Outlet, Link } from 'react-router-dom'
import { Footer } from '../../../../shared-core/components/footer/Footer'
import { gameConfig } from '../config/gameConfig'
import { SchemaMarkup } from '../../../../shared-core/components/SchemaMarkup'

// Aircraft SVG Icon Component
const AircraftIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
)


// Game configuration for SEO
const GAME_SEO = {
  name: 'Aviatrix',
  provider: 'Aviatrix.bet',
  rtp: 97,
  domain: 'aviatrixtracker.com',
  maxMultiplier: '10,000x',
  description: 'Real-time Aviatrix statistics tracker with live multiplier data, RTP analysis, and historical patterns.'
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-100 via-sky-50 to-white">
      {/* Schema.org SEO Markup */}
      <SchemaMarkup game={GAME_SEO} />

      {/* Header */}
      <header className="bg-gradient-aviation text-white shadow-aviation-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="aircraft-icon group-hover:animate-fly">
                <AircraftIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Aviatrix Tracker</h1>
                <p className="text-xs text-sky-200">Live Flight Statistics</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sky-100 hover:text-white transition-colors">
                Dashboard
              </Link>
              <a
                href="#statistics"
                className="text-sky-100 hover:text-white transition-colors"
              >
                Statistics
              </a>
              <a
                href="#history"
                className="text-sky-100 hover:text-white transition-colors"
              >
                History
              </a>
            </nav>

            {/* Live Indicator */}
            <div className="live-indicator bg-white/10 backdrop-blur-sm">
              <span className="text-sm font-medium text-white">LIVE</span>
            </div>
          </div>
        </div>

        {/* Provider Attribution Bar */}
        <div className="bg-sky-800/50 py-1">
          <div className="container mx-auto px-4">
            <p className="text-xs text-sky-200 text-center">
              Tracking data for {gameConfig.name} by {gameConfig.provider} | {gameConfig.rtp}% RTP | Up to {gameConfig.maxMultiplier.toLocaleString()}x
            </p>
          </div>
        </div>
      </header>

      {/* Responsible Gambling Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container mx-auto px-4 py-2">
          <p className="text-xs text-amber-700 text-center">
            <strong>18+</strong> | Gambling can be addictive. Play responsibly. |{' '}
            <a
              href={gameConfig.responsibleGambling.helplines.international}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-900"
            >
              Get Help
            </a>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer
        gameName="Aviatrix"
        gameEmoji="✈️"
        domain="aviatrixtracker.com"
        primaryColor="#7c3aed"
        botUsername="AviatrixTrackerBot"
        rtp={97}
        provider="Aviatrix"
      />
    </div>
  )
}

export default Layout
