import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Play } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onUserClick: (userName: string) => void;
  showToast: (message: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onUserClick,
  showToast
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out this video from ${video.user}!`,
          text: video.content,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      }
    } catch (err) {
      showToast('Could not share video', 'error');
    }
  };

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Video Background */}
      <img
        src={video.videoUrl}
        alt="Video thumbnail"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Play size={24} className="text-white ml-1" fill="currentColor" />
        </button>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-end justify-between">
          {/* Left Side - User Info & Content */}
          <div className="flex-1 mr-4">
            <div 
              className="flex items-center space-x-3 mb-3 cursor-pointer"
              onClick={() => onUserClick(video.user)}
            >
              <img
                src={video.avatar}
                alt={video.user}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div className="flex items-center space-x-1">
                <span className="font-bold text-white">{video.user}</span>
                <VerifiedBadge tier={video.verificationTier} />
              </div>
            </div>
            <p className="text-white text-sm leading-relaxed">{video.content}</p>
          </div>

          {/* Right Side - Actions */}
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleLike}
              className="flex flex-col items-center space-y-1"
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200
                ${isLiked ? 'bg-red-500/80' : 'bg-white/20 hover:bg-white/30'}
              `}>
                <Heart size={24} className={`text-white ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-white text-xs font-semibold">
                {likeCount > 999999 ? `${(likeCount / 1000000).toFixed(1)}M` : 
                 likeCount > 999 ? `${(likeCount / 1000).toFixed(1)}K` : 
                 likeCount.toString()}
              </span>
            </button>

            <button className="flex flex-col items-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors">
                <MessageCircle size={24} className="text-white" />
              </div>
              <span className="text-white text-xs font-semibold">
                {video.comments > 999 ? `${(video.comments / 1000).toFixed(1)}K` : video.comments.toString()}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center space-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors">
                <Share2 size={24} className="text-white" />
              </div>
              <span className="text-white text-xs font-semibold">
                {video.shares > 999 ? `${(video.shares / 1000).toFixed(1)}K` : video.shares.toString()}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};