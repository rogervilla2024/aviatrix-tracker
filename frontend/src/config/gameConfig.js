/**
 * Aviatrix Game Configuration
 *
 * Aviatrix is a crash game developed by Aviatrix.bet featuring:
 * - 97% RTP (Return to Player)
 * - Maximum multiplier of 10,000x
 * - Unique NFT aircraft customization feature
 * - Aviation/flight themed gameplay
 */

export const gameConfig = {
  // Stats Page Config
  gameId: 'aviatrix',
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8014',

  // Game Identity
  name: 'Aviatrix',
  provider: 'Aviatrix.bet',
  domain: 'aviatrixtracker.com',

  // Game Statistics
  rtp: 97.00,  // 97% Return to Player
  houseEdge: 3.00,  // 3% house edge
  maxMultiplier: 10000,  // 10,000x maximum multiplier
  minMultiplier: 1.00,

  // Unique Features
  features: {
    nftAircraft: true,  // NFT aircraft customization
    nftDescription: 'Customize and own unique NFT aircraft with different stats and appearances',
    provablyFair: true,
    autoPlay: true,
    autoCashout: true,
  },

  // Theme Configuration
  theme: {
    primary: '#0ea5e9',      // Sky blue
    secondary: '#0284c7',    // Aviation blue
    accent: '#f59e0b',       // Gold/amber for highlights
    dark: '#0c4a6e',         // Dark blue
    silver: '#e2e8f0',       // Silver accents
    white: '#f8fafc',        // Cloud white
  },

  // API Configuration
  api: {
    baseUrl: '/api',
    wsUrl: '/ws',
    endpoints: {
      stats: '/stats',
      history: '/history',
      live: '/live',
    }
  },

  // Multiplier Thresholds for Display
  multiplierThresholds: {
    low: 2.0,       // Below 2x - low
    medium: 5.0,    // 2x to 5x - medium
    high: 10.0,     // 5x to 10x - high
    mega: 100.0,    // Above 10x - mega/jackpot
  },

  // Responsible Gambling Configuration
  responsibleGambling: {
    enabled: true,
    warnings: [
      'Gambling can be addictive. Play responsibly.',
      'Never gamble more than you can afford to lose.',
      'Set limits on your time and money spent gambling.',
      'Past results do not predict future outcomes.',
    ],
    helplines: {
      international: 'https://www.gamblingtherapy.org',
      usa: '1-800-522-4700',
      uk: 'https://www.begambleaware.org',
    },
    ageRestriction: 18,
  },

  // Disclaimer
  disclaimer: {
    affiliation: 'This website is NOT affiliated with, endorsed by, or connected to Aviatrix.bet in any way.',
    educational: 'All statistics and information provided are for educational and informational purposes only.',
    noGuarantee: 'We do not guarantee the accuracy of any statistics or predictions.',
    gamblersFallacy: 'Remember: Each flight is independent. Past results have no influence on future outcomes.',
  },

  // Contact Information
  contact: {
    general: 'contact@aviatrixtracker.com',
    business: 'business@aviatrixtracker.com',
    legal: 'legal@aviatrixtracker.com',
    privacy: 'privacy@aviatrixtracker.com',
  },

  // Social Media
  social: {
    twitter: 'https://twitter.com/aviatrixtracker',
    telegram: 'https://t.me/aviatrixtracker',
  }
}

export default gameConfig
