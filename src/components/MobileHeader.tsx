import React from 'react';
import { Bell, Search, ShoppingCart } from 'lucide-react';

interface MobileHeaderProps {
  activeTab: string;
  onUserClick: (userName: string) => void;
  cartCount: number;
  onCartClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  activeTab,
  onUserClick,
  cartCount,
  onCartClick
}) => {
  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 safe-area-top flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          SportSphere
        </h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors touch-target">
          <Search size={20} className="text-gray-300" />
        </button>
        
        <button 
          onClick={onCartClick}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors touch-target relative"
        >
          <ShoppingCart size={20} className="text-gray-300" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors touch-target">
          <Bell size={20} className="text-gray-300" />
        </button>
      </div>
    </header>
  );
};