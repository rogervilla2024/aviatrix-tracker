import React, { useState, useMemo } from 'react';

/**
 * NFT Plane Gallery - Aviatrix
 * The ONLY crash game with NFT collectible planes!
 */
export function NFTPlaneGallery({ rtp = 97 }) {
  const [selectedPlane, setSelectedPlane] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [showBlockchainInfo, setShowBlockchainInfo] = useState(false);

  // NFT Plane collection (Aviatrix unique feature)
  const nftPlanes = [
    {
      id: 1,
      name: 'Starter Jet',
      rarity: 'Common',
      color: 'bg-gray-500',
      bonus: 0,
      price: 0,
      icon: '✈️',
      description: 'Basic plane, no special bonuses'
    },
    {
      id: 2,
      name: 'Silver Wing',
      rarity: 'Uncommon',
      color: 'bg-blue-500',
      bonus: 0.5,
      price: 50,
      icon: '🛩️',
      description: '+0.5% cashback on losses'
    },
    {
      id: 3,
      name: 'Golden Eagle',
      rarity: 'Rare',
      color: 'bg-yellow-500',
      bonus: 1.0,
      price: 200,
      icon: '🦅',
      description: '+1% cashback on losses'
    },
    {
      id: 4,
      name: 'Platinum Falcon',
      rarity: 'Epic',
      color: 'bg-purple-500',
      bonus: 1.5,
      price: 500,
      icon: '🚀',
      description: '+1.5% cashback + exclusive missions'
    },
    {
      id: 5,
      name: 'Diamond Phoenix',
      rarity: 'Legendary',
      color: 'bg-red-500',
      bonus: 2.0,
      price: 1000,
      icon: '🔥',
      description: '+2% cashback + VIP tournaments'
    },
    {
      id: 6,
      name: 'Mythic Starship',
      rarity: 'Mythic',
      color: 'bg-gradient-to-r from-pink-500 to-purple-500',
      bonus: 3.0,
      price: 5000,
      icon: '⭐',
      description: '+3% cashback + all perks + exclusive'
    }
  ];

  // Blockchain verification example
  const blockchainData = {
    network: 'Avalanche (AVAX)',
    contract: '0x1234...5678',
    standard: 'ERC-721',
    totalSupply: 50000,
    holders: 12500,
    floorPrice: '0.5 AVAX',
    volume24h: '125 AVAX'
  };

  // Calculate effective RTP with NFT bonus
  const calculations = useMemo(() => {
    const planeBonus = selectedPlane?.bonus || 0;
    const effectiveRTP = rtp + planeBonus;
    const houseEdge = 100 - effectiveRTP;
    const expectedLoss = betAmount * (houseEdge / 100);

    return {
      effectiveRTP,
      houseEdge,
      expectedLoss,
      planeBonus
    };
  }, [selectedPlane, rtp, betAmount]);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-purple-600/50">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🎮</span>
        NFT Plane Gallery
        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded ml-2 animate-pulse">NFT POWERED!</span>
      </h3>

      {/* Unique Feature Banner */}
      <div className="bg-purple-900/50 border border-purple-500 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🎨</span>
          <div>
            <h4 className="text-purple-400 font-bold">The ONLY Crash Game with NFT Collectibles!</h4>
            <p className="text-gray-300 text-sm mt-1">
              Aviatrix is unique: you can own and collect NFT planes that give you <strong className="text-yellow-400">real gameplay bonuses</strong>.
              Higher rarity planes = better cashback percentages. All verifiable on blockchain!
            </p>
          </div>
        </div>
      </div>

      {/* NFT Plane Collection */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <h4 className="text-white font-medium mb-3">Collectible Planes</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {nftPlanes.map(plane => (
            <button
              key={plane.id}
              onClick={() => setSelectedPlane(plane)}
              className={`p-4 rounded-lg text-center transition-all ${
                selectedPlane?.id === plane.id
                  ? 'ring-2 ring-white scale-105'
                  : 'opacity-80 hover:opacity-100'
              } ${plane.color}`}
            >
              <div className="text-4xl mb-2">{plane.icon}</div>
              <div className="text-white font-bold">{plane.name}</div>
              <div className="text-xs text-white/80">{plane.rarity}</div>
              {plane.bonus > 0 && (
                <div className="mt-2 text-xs bg-black/30 rounded px-2 py-1 text-yellow-300">
                  +{plane.bonus}% Cashback
                </div>
              )}
              {plane.price > 0 && (
                <div className="text-xs text-white/60 mt-1">~${plane.price}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Plane Details */}
      {selectedPlane && (
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <h4 className="text-white font-medium mb-3">Selected: {selectedPlane.name}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-5xl mb-2">{selectedPlane.icon}</div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${selectedPlane.color} text-white`}>
                {selectedPlane.rarity}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Bonus</div>
              <div className="text-2xl font-bold text-yellow-400">
                +{selectedPlane.bonus}%
              </div>
              <div className="text-xs text-gray-500">Cashback on losses</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Effective RTP</div>
              <div className="text-2xl font-bold text-green-400">
                {calculations.effectiveRTP}%
              </div>
              <div className="text-xs text-gray-500">vs base {rtp}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Perk</div>
              <div className="text-sm text-gray-300">{selectedPlane.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* RTP Calculator with NFT */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <h4 className="text-white font-medium mb-3">RTP with NFT Bonus</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Bet Amount ($)</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value) || 1)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Base RTP</label>
            <div className="bg-gray-800 rounded px-3 py-2 text-gray-400">{rtp}%</div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">With NFT Bonus</label>
            <div className="bg-gray-800 rounded px-3 py-2 text-green-400 font-bold">
              {calculations.effectiveRTP}%
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Expected Loss/Bet</label>
            <div className="bg-gray-800 rounded px-3 py-2 text-red-400">
              ${calculations.expectedLoss.toFixed(3)}
            </div>
          </div>
        </div>

        {calculations.planeBonus > 0 && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-600/50 rounded">
            <p className="text-green-400 text-sm">
              <strong>NFT Advantage:</strong> Your {selectedPlane.name} reduces the house edge from {100 - rtp}% to {calculations.houseEdge}%,
              saving you ${(betAmount * calculations.planeBonus / 100).toFixed(3)} per bet on average!
            </p>
          </div>
        )}
      </div>

      {/* Blockchain Verification */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <button
          onClick={() => setShowBlockchainInfo(!showBlockchainInfo)}
          className="w-full flex items-center justify-between text-white font-medium"
        >
          <span className="flex items-center gap-2">
            <span>⛓️</span> Blockchain Verification
          </span>
          <span>{showBlockchainInfo ? '▼' : '▶'}</span>
        </button>

        {showBlockchainInfo && (
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Network</span>
              <span className="text-purple-400">{blockchainData.network}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Contract</span>
              <span className="text-blue-400 font-mono">{blockchainData.contract}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Token Standard</span>
              <span className="text-white">{blockchainData.standard}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Supply</span>
              <span className="text-white">{blockchainData.totalSupply.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Unique Holders</span>
              <span className="text-green-400">{blockchainData.holders.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Floor Price</span>
              <span className="text-yellow-400">{blockchainData.floorPrice}</span>
            </div>
          </div>
        )}
      </div>

      {/* Comparison */}
      <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
        <h4 className="text-purple-400 font-bold mb-2">Aviatrix vs Other Crash Games</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white font-bold mb-2">Aviatrix Unique Features:</div>
            <ul className="space-y-1 text-gray-300">
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> NFT collectible planes</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Real gameplay bonuses</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Blockchain verified</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Up to +3% RTP boost</li>
            </ul>
          </div>
          <div>
            <div className="text-white font-bold mb-2">Standard Crash Games:</div>
            <ul className="space-y-1 text-gray-300">
              <li className="flex items-center gap-2"><span className="text-red-400">✗</span> No collectibles</li>
              <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Fixed RTP only</li>
              <li className="flex items-center gap-2"><span className="text-red-400">✗</span> No ownership</li>
              <li className="flex items-center gap-2"><span className="text-red-400">✗</span> No trading</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTPlaneGallery;
