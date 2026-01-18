/**
 * Utility functions for formatting values in Aviatrix Tracker
 */

/**
 * Format multiplier value with appropriate decimal places
 * @param {number} multiplier - The multiplier value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted multiplier string
 */
export const formatMultiplier = (multiplier, decimals = 2) => {
  if (multiplier === null || multiplier === undefined) return '-.--x'
  return `${Number(multiplier).toFixed(decimals)}x`
}

/**
 * Get multiplier CSS class based on value
 * @param {number} multiplier - The multiplier value
 * @returns {string} CSS class name for styling
 */
export const getMultiplierClass = (multiplier) => {
  if (multiplier >= 100) return 'multiplier-mega'
  if (multiplier >= 10) return 'multiplier-high'
  if (multiplier >= 5) return 'multiplier-medium'
  return 'multiplier-low'
}

/**
 * Get multiplier color based on value (for inline styles)
 * @param {number} multiplier - The multiplier value
 * @returns {string} Hex color code
 */
export const getMultiplierColor = (multiplier) => {
  if (multiplier >= 100) return '#f59e0b' // Amber/Gold for mega
  if (multiplier >= 10) return '#0284c7'  // Aviation blue for high
  if (multiplier >= 5) return '#0ea5e9'   // Sky blue for medium
  return '#38bdf8'                         // Light sky for low
}

/**
 * Format percentage value
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '--%'
  return `${Number(value).toFixed(decimals)}%`
}

/**
 * Format large numbers with K, M, B suffixes
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatCompactNumber = (num) => {
  if (num === null || num === undefined) return '--'
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

/**
 * Format number with thousand separators
 * @param {number} num - The number to format
 * @returns {string} Formatted number with commas
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '--'
  return num.toLocaleString()
}

/**
 * Format timestamp to readable time
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted time string
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '--:--'
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

/**
 * Format timestamp to readable date and time
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return '--'
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

/**
 * Format relative time (e.g., "2 minutes ago")
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '--'
  const now = new Date()
  const date = new Date(timestamp)
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

/**
 * Format flight/round ID
 * @param {string|number} id - The flight ID
 * @returns {string} Formatted flight ID
 */
export const formatFlightId = (id) => {
  if (!id) return '#------'
  return `#${String(id).padStart(6, '0')}`
}

/**
 * Calculate and format win rate
 * @param {number} wins - Number of wins
 * @param {number} total - Total number of rounds
 * @returns {string} Formatted win rate percentage
 */
export const formatWinRate = (wins, total) => {
  if (!total || total === 0) return '0.00%'
  return formatPercentage((wins / total) * 100)
}

/**
 * Format currency value
 * @param {number} value - The currency value
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined) return '--'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

/**
 * Truncate text with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 20) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

export default {
  formatMultiplier,
  getMultiplierClass,
  getMultiplierColor,
  formatPercentage,
  formatCompactNumber,
  formatNumber,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatFlightId,
  formatWinRate,
  formatCurrency,
  truncateText
}
