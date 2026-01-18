import { useState, useEffect, useCallback } from 'react'
import { gameConfig } from '../config/gameConfig'

/**
 * Custom hook for fetching and managing Aviatrix statistics
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Statistics state and methods
 */
export const useStats = (options = {}) => {
  const {
    autoRefresh = true,
    refreshInterval = 5000,
    initialFetch = true
  } = options

  const [stats, setStats] = useState({
    totalFlights: 0,
    averageMultiplier: 0,
    highestMultiplier: 0,
    lowestMultiplier: 0,
    lastHourFlights: 0,
    crashedBelow2x: 0,
    above10x: 0,
    above100x: 0,
    rtp: gameConfig.rtp,
    lastUpdated: null
  })

  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch statistics from API
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${gameConfig.api.baseUrl}${gameConfig.api.endpoints.stats}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setStats(prev => ({
        ...prev,
        ...data,
        lastUpdated: new Date().toISOString()
      }))
      setError(null)
    } catch (err) {
      // Use mock data if API is not available
      setStats(prev => ({
        ...prev,
        totalFlights: prev.totalFlights || 125847,
        averageMultiplier: prev.averageMultiplier || 2.47,
        highestMultiplier: prev.highestMultiplier || 8542.31,
        lowestMultiplier: prev.lowestMultiplier || 1.00,
        lastHourFlights: prev.lastHourFlights || 342,
        crashedBelow2x: prev.crashedBelow2x || 52.3,
        above10x: prev.above10x || 8.7,
        above100x: prev.above100x || 0.89,
        rtp: gameConfig.rtp,
        lastUpdated: new Date().toISOString()
      }))
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch flight history from API
  const fetchHistory = useCallback(async (limit = 50) => {
    try {
      const response = await fetch(
        `${gameConfig.api.baseUrl}${gameConfig.api.endpoints.history}?limit=${limit}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setHistory(data)
      setError(null)
    } catch (err) {
      // Generate mock history if API is not available
      const mockHistory = generateMockHistory(limit)
      setHistory(mockHistory)
      setError(err.message)
    }
  }, [])

  // Generate mock flight history for demo/development
  const generateMockHistory = (count) => {
    const history = []
    const now = Date.now()

    for (let i = 0; i < count; i++) {
      // Generate realistic multiplier distribution
      // ~50% below 2x, ~40% between 2-10x, ~9% between 10-100x, ~1% above 100x
      const rand = Math.random()
      let multiplier

      if (rand < 0.50) {
        multiplier = 1.00 + Math.random() * 1.00 // 1.00 - 2.00
      } else if (rand < 0.90) {
        multiplier = 2.00 + Math.random() * 8.00 // 2.00 - 10.00
      } else if (rand < 0.99) {
        multiplier = 10.00 + Math.random() * 90.00 // 10.00 - 100.00
      } else {
        multiplier = 100.00 + Math.random() * 900.00 // 100.00 - 1000.00
      }

      history.push({
        id: 1000000 - i,
        multiplier: parseFloat(multiplier.toFixed(2)),
        timestamp: new Date(now - i * 30000).toISOString(), // 30 seconds between each
        hash: generateRandomHash()
      })
    }

    return history
  }

  // Generate random hash for flight verification
  const generateRandomHash = () => {
    const chars = '0123456789abcdef'
    let hash = ''
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)]
    }
    return hash
  }

  // Add new flight to history (used with WebSocket)
  const addFlight = useCallback((flight) => {
    setHistory(prev => [flight, ...prev.slice(0, 49)])

    // Update stats
    setStats(prev => {
      const newTotal = prev.totalFlights + 1
      const newAvg = ((prev.averageMultiplier * prev.totalFlights) + flight.multiplier) / newTotal

      return {
        ...prev,
        totalFlights: newTotal,
        averageMultiplier: parseFloat(newAvg.toFixed(2)),
        highestMultiplier: Math.max(prev.highestMultiplier, flight.multiplier),
        lastHourFlights: prev.lastHourFlights + 1,
        lastUpdated: new Date().toISOString()
      }
    })
  }, [])

  // Refresh all data
  const refresh = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchStats(), fetchHistory()])
  }, [fetchStats, fetchHistory])

  // Initial fetch
  useEffect(() => {
    if (initialFetch) {
      fetchStats()
      fetchHistory()
    }
  }, [initialFetch, fetchStats, fetchHistory])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchStats()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchStats])

  return {
    stats,
    history,
    loading,
    error,
    fetchStats,
    fetchHistory,
    addFlight,
    refresh
  }
}

export default useStats
