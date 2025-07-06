import React from 'react';
import { Home, Play, Ticket, MessageCircle, User, Radio, TrendingUp, ShoppingCart } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  betSlipCount: number;
  onBetSlipClick: () => void;
  onUserClick: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  onTabChange,
  betSlipCount,
  onBetSlipClick,
  onUserClick
}) => {
  const tabs = [
    { id: 'Feed', icon: Home, label: 'Feed' },
    { id: 'Highlights', icon: Play, label: 'Videos' },
    { id: 'Live', icon: Radio, label: 'Live' },
    { id: 'Shop', icon: ShoppingCart, label: 'Shop' },
    { id: 'Polls', icon: TrendingUp, label: 'Polls' }
  ];

  return (
    <nav className="bg-black/95 backdrop-blur-sm border-t border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`
              flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 touch-target
              ${activeTab === id 
                ? 'text-blue-400 scale-105' 
                : 'text-gray-400 hover:text-gray-300'
              }
            `}
          >
            <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 2} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </button>
        ))}
        
        {/* Bet Slip Button */}
        <button
          onClick={onBetSlipClick}
          className="flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 touch-target text-gray-400 hover:text-gray-300 relative"
        >
          <Ticket size={22} />
          <span className="text-xs mt-1 font-medium">Bets</span>
          {betSlipCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {betSlipCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};