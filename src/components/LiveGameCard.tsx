import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LiveGame, Bet } from '../types';

interface LiveGameCardProps {
  game: LiveGame;
  onBetClick: (bet: Omit<Bet, 'id' | 'wager' | 'payout'>) => void;
  onGameClick: () => void;
}

export const LiveGameCard: React.FC<LiveGameCardProps> = ({
  game,
  onBetClick,
  onGameClick
}) => {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
        onClick={onGameClick}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">{game.sport}</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-red-500">{game.time}</span>
          </div>
        </div>

        {/* Teams and Scores */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">{game.team1}</span>
            <span className="text-2xl font-bold text-white">{game.score1}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">{game.team2}</span>
            <span className="text-2xl font-bold text-white">{game.score2}</span>
          </div>
        </div>
      </div>

      {/* Betting Options */}
      <div className="bg-gray-800 p-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onBetClick({
              game,
              team: game.team1,
              odds: game.odds.team1,
              type: 'Moneyline'
            })}
            className="bg-gray-700 hover:bg-green-600 p-3 rounded-lg transition-all duration-200 text-center group"
          >
            <div className="flex items-center justify-center space-x-1">
              {game.odds.team1 > 0 ? (
                <TrendingUp size={14} className="text-green-400 group-hover:text-white" />
              ) : (
                <TrendingDown size={14} className="text-red-400 group-hover:text-white" />
              )}
              <span className="font-bold text-white">
                {game.odds.team1 > 0 ? `+${game.odds.team1}` : game.odds.team1}
              </span>
            </div>
            <span className="text-xs text-gray-400 group-hover:text-white block mt-1">
              {game.team1}
            </span>
          </button>

          {game.odds.draw && (
            <button
              onClick={() => onBetClick({
                game,
                team: 'Draw',
                odds: game.odds.draw!,
                type: 'Moneyline'
              })}
              className="bg-gray-700 hover:bg-green-600 p-3 rounded-lg transition-all duration-200 text-center group"
            >
              <div className="flex items-center justify-center space-x-1">
                <span className="font-bold text-white">
                  {game.odds.draw > 0 ? `+${game.odds.draw}` : game.odds.draw}
                </span>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white block mt-1">
                Draw
              </span>
            </button>
          )}

          <button
            onClick={() => onBetClick({
              game,
              team: game.team2,
              odds: game.odds.team2,
              type: 'Moneyline'
            })}
            className={`bg-gray-700 hover:bg-green-600 p-3 rounded-lg transition-all duration-200 text-center group ${
              !game.odds.draw ? 'col-start-3' : ''
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              {game.odds.team2 > 0 ? (
                <TrendingUp size={14} className="text-green-400 group-hover:text-white" />
              ) : (
                <TrendingDown size={14} className="text-red-400 group-hover:text-white" />
              )}
              <span className="font-bold text-white">
                {game.odds.team2 > 0 ? `+${game.odds.team2}` : game.odds.team2}
              </span>
            </div>
            <span className="text-xs text-gray-400 group-hover:text-white block mt-1">
              {game.team2}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};