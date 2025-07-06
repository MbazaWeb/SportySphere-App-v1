import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import type { Story } from '../types';

interface StoryViewerProps {
  stories: Story[];
  activeIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onUserClick: (userName: string) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  activeIndex,
  onClose,
  onNext,
  onPrev,
  onUserClick
}) => {
  if (activeIndex === null) return null;

  const activeStoryIndex = stories.findIndex(s => s.id === activeIndex);
  if (activeStoryIndex === -1) return null;

  const activeStory = stories[activeStoryIndex];

  useEffect(() => {
    const timer = setTimeout(onNext, 5000);
    return () => clearTimeout(timer);
  }, [activeIndex, onNext]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex space-x-1 z-20">
          {stories.map((story, index) => (
            <div key={story.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className={`h-full bg-white rounded-full transition-all duration-300 ${
                  index < activeStoryIndex ? 'w-full' :
                  index === activeStoryIndex ? 'w-full animate-pulse' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              onClose();
              onUserClick(activeStory.user);
            }}
          >
            <img
              src={activeStory.avatar}
              alt={activeStory.user}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div className="flex items-center space-x-1">
              <span className="font-bold text-white text-sm">{activeStory.user}</span>
              <VerifiedBadge tier={activeStory.verificationTier} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/50 backdrop-blur-sm"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Story Image */}
        <img
          src={activeStory.imageUrl}
          alt={activeStory.user}
          className="w-full h-full object-cover"
        />

        {/* Touch Areas */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3 h-full" onClick={onPrev} />
          <div className="w-1/3 h-full" onClick={onNext} />
          <div className="w-1/3 h-full" onClick={onNext} />
        </div>
      </div>
    </div>
  );
};