import React from 'react';
import { X, Ticket, Trash2 } from 'lucide-react';
import type { Bet } from '../types';

interface BettingCartProps {
  bets: Bet[];
  isVisible: boolean;
  onClose: () => void;
  onClear: () => void;
  onRemove: (betId: number) => void;
  onPlaceBet: () => void;
}

export const BettingCart: React.FC<BettingCartProps> = ({
  bets,
  isVisible,
  onClose,
  onClear,
  onRemove,
  onPlaceBet
}) => {
  if (!isVisible) return null;

  const totalWager = bets.reduce((sum, bet) => sum + bet.wager, 0);
  const totalPayout = bets.reduce((sum, bet) => sum + bet.payout, 0);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <div 
        className="w-full max-w-sm h-full bg-gray-900 shadow-2xl flex flex-col slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Bet Slip</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        {bets.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <Ticket size={48} className="text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Your bet slip is empty</h3>
            <p className="text-gray-400">Click on odds to add a bet.</p>
          </div>
        ) : (
          <>
            {/* Bets List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {bets.map((bet) => (
                <div key={bet.id} className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-white">{bet.team}</p>
                      <p className="text-xs text-gray-400">
                        {bet.game.team1} vs {bet.game.team2}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-white">
                        {bet.odds > 0 ? `+${bet.odds}` : bet.odds}
                      </p>
                      <button
                        onClick={() => onRemove(bet.id)}
                        className="text-red-400 hover:text-red-300 mt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Stake: ${bet.wager}</span>
                    <span className="text-green-400 font-semibold">
                      Payout: ${bet.payout.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Total Wager:</span>
                <span className="font-bold text-white">${totalWager.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Total Payout:</span>
                <span className="font-bold text-green-400">${totalPayout.toFixed(2)}</span>
              </div>
              
              <button
                onClick={onPlaceBet}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Place Bet
              </button>
              
              <button
                onClick={onClear}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};