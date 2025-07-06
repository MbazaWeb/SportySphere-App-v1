import React, { useRef } from 'react';
import { Plus, Camera } from 'lucide-react';
import { currentUser } from '../data/mockData';
import type { Story } from '../types';

interface StoriesTrayProps {
  stories: Story[];
  onStoryClick: (storyId: number) => void;
  showToast: (message: string) => void;
}

export const StoriesTray: React.FC<StoriesTrayProps> = ({
  stories,
  onStoryClick,
  showToast
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddStory = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      showToast(`Uploading ${file.name}...`);
    }
  };

  return (
    <div className="bg-black border-b border-gray-800 py-4">
      <div className="flex items-center space-x-4 overflow-x-auto px-4 no-scrollbar">
        {/* Add Story Button */}
        <div className="flex flex-col items-center space-y-2 flex-shrink-0">
          <button
            onClick={handleAddStory}
            className="relative w-16 h-16 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-blue-400 transition-colors"
          >
            <Camera size={20} className="text-gray-400" />
          </button>
          <span className="text-xs text-gray-400 text-center w-16 truncate">Your Story</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Stories */}
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer"
            onClick={() => onStoryClick(story.id)}
          >
            <div className={`
              p-0.5 rounded-full
              ${story.viewed 
                ? 'bg-gray-600' 
                : 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500'
              }
            `}>
              <div className="bg-black p-0.5 rounded-full">
                <img
                  src={story.avatar}
                  alt={story.user}
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs text-gray-300 text-center w-16 truncate">
              {story.user}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};