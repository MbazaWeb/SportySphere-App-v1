import React from 'react';
import { Shield, Star, UserCheck, Mic, Heart, Clipboard, Briefcase, BarChart3 } from 'lucide-react';
import { verificationTiers } from '../data/mockData';

interface VerifiedBadgeProps {
  tier: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ tier }) => {
  if (!tier || !verificationTiers[tier as keyof typeof verificationTiers]) return null;

  const { label, color } = verificationTiers[tier as keyof typeof verificationTiers];

  const getIcon = () => {
    switch (tier) {
      case 'player': return <UserCheck size={12} className="text-white" />;
      case 'team': return <Shield size={12} className="text-white" />;
      case 'sponsor': return <Star size={12} className="text-white" />;
      case 'reporter': return <Mic size={12} className="text-white" />;
      case 'fan': return <Heart size={12} className="text-white" />;
      case 'coach': return <Clipboard size={12} className="text-white" />;
      case 'manager': return <Briefcase size={12} className="text-white" />;
      case 'analyst': return <BarChart3 size={12} className="text-white" />;
      default: return <UserCheck size={12} className="text-white" />;
    }
  };

  return (
    <span className="relative group">
      <span className={`w-5 h-5 rounded-full flex items-center justify-center ${color}`}>
        {getIcon()}
      </span>
      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-50">
        {label}
      </span>
    </span>
  );
};