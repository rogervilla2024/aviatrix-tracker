import { useState, useEffect } from 'react'
import { formatMultiplier, getMultiplierClass, formatTime, formatFlightId } from '../utils/formatters'
import { useWebSocket } from '../hooks/useWebSocket'

// Aircraft Icon for flight indicator
const AircraftIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
)

// Crash Icon
const CrashIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
)

/**
 * LiveFeed Component - Displays real-time flight/crash updates
 */
function LiveFeed({ history = [], maxItems = 20 }) {
  const [flights, setFlights] = useState(history)
  const [isLive, setIsLive] = useState(true)
  const [newFlightId, setNewFlightId] = useState(null)

  // WebSocket connection for live updates
  const { isConnected, lastMessage } = useWebSocket('/ws', {
    onConnect: () => setIsLive(true),
    onDisconnect: () => setIsLive(false),
    onMessage: (data) => {
      if (data.type === 'flight' || data.type === 'crash') {
        handleNewFlight(data)
      }
    }
  })

  // Update flights when history prop changes
  useEffect(() => {
    if (history.length > 0) {
      setFlights(history.slice(0, maxItems))
    }
  }, [history, maxItems])

  // Handle new flight from WebSocket
  const handleNewFlight = (flight) => {
    setFlights(prev => {
      const newFlights = [flight, ...prev.slice(0, maxItems - 1)]
      return newFlights
    })
    setNewFlightId(flight.id)

    // Clear new flight highlight after animation
    setTimeout(() => {
      setNewFlightId(null)
    }, 2000)
  }

  return (
    <div className="aviation-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <AircraftIcon className="w-5 h-5 text-sky-500 aircraft-flying" />
          <h2 className="text-lg font-semibold text-sky-900">Live Flight History</h2>
        </div>
        <div className="flex items-center gap-2">
          {isLive || isConnected ? (
            <div className="live-indicator">
              <span className="text-xs font-medium">LIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-500">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span className="text-xs font-medium">OFFLINE</span>
            </div>
          )}
        </div>
      </div>

      {/* Flight List */}
      <div className="max-h-96 overflow-y-auto">
        {flights.length === 0 ? (
          <div className="p-8 text-center text-sky-400">
            <AircraftIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Waiting for flight data...</p>
          </div>
        ) : (
          <div className="divide-y divide-sky-50">
            {flights.map((flight, index) => (
              <FlightItem
                key={flight.id || index}
                flight={flight}
                isNew={flight.id === newFlightId}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 bg-sky-50/50 border-t border-sky-100">
        <div className="flex justify-between text-xs text-sky-600">
          <span>Showing last {flights.length} flights</span>
          <span>
            {isConnected ? 'Real-time updates active' : 'Reconnecting...'}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Individual Flight Item Component
 */
function FlightItem({ flight, isNew, index }) {
  const multiplierClass = getMultiplierClass(flight.multiplier)
  const isCrash = flight.multiplier < 2

  return (
    <div
      className={`
        flight-item mx-3 my-2 transition-all duration-300
        ${isNew ? 'bg-sky-100 border-sky-300 scale-[1.02]' : ''}
        ${index === 0 ? 'border-sky-200' : ''}
      `}
      style={{
        animationDelay: `${index * 50}ms`
      }}
    >
      {/* Left: Flight Info */}
      <div className="flex items-center gap-3">
        <div className={`
          p-2 rounded-lg
          ${isCrash ? 'bg-red-100 text-red-500' : 'bg-sky-100 text-sky-500'}
        `}>
          {isCrash ? (
            <CrashIcon className="w-4 h-4" />
          ) : (
            <AircraftIcon className="w-4 h-4" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-sky-900">
            {formatFlightId(flight.id)}
          </p>
          <p className="text-xs text-sky-500">
            {formatTime(flight.timestamp)}
          </p>
        </div>
      </div>

      {/* Right: Multiplier */}
      <div className="text-right">
        <p className={`text-lg font-bold ${multiplierClass}`}>
          {formatMultiplier(flight.multiplier)}
        </p>
        {flight.multiplier >= 10 && (
          <span className="text-xs text-sky-400">High Altitude</span>
        )}
        {flight.multiplier >= 100 && (
          <span className="nft-badge text-[10px] ml-1">MEGA</span>
        )}
      </div>
    </div>
  )
}

/**
 * Compact Live Feed for sidebar/widget use
 */
export function LiveFeedCompact({ history = [], maxItems = 10 }) {
  return (
    <div className="space-y-2">
      {history.slice(0, maxItems).map((flight, index) => (
        <div
          key={flight.id || index}
          className="flex items-center justify-between p-2 rounded-lg bg-sky-50/50"
        >
          <span className="text-xs text-sky-600">{formatTime(flight.timestamp)}</span>
          <span className={`text-sm font-semibold ${getMultiplierClass(flight.multiplier)}`}>
            {formatMultiplier(flight.multiplier)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default LiveFeed
