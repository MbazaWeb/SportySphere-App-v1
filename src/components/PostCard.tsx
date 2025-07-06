import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
  onUserClick: (userName: string) => void;
  showToast: (message: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onUserClick,
  showToast
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out this post from ${post.user}!`,
          text: post.content,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      }
    } catch (err) {
      showToast('Could not share post', 'error');
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => onUserClick(post.user)}
        >
          <img
            src={post.avatar}
            alt={post.user}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-white">{post.user}</span>
              <VerifiedBadge tier={post.verificationTier} />
            </div>
            <span className="text-sm text-gray-400">{post.time}</span>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors touch-target">
          <MoreHorizontal size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-white leading-relaxed">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-4 pb-3">
          <img
            src={post.image}
            alt="Post content"
            className="w-full rounded-xl object-cover max-h-96"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`
              flex items-center space-x-2 p-2 rounded-full transition-all duration-200 touch-target
              ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}
            `}
          >
            <Heart size={20} className={isLiked ? 'fill-current' : ''} />
            <span className="text-sm font-medium">{likeCount.toLocaleString()}</span>
          </button>
          
          <button className="flex items-center space-x-2 p-2 rounded-full text-gray-400 hover:text-blue-400 transition-colors touch-target">
            <MessageCircle size={20} />
            <span className="text-sm font-medium">{post.comments.toLocaleString()}</span>
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 rounded-full text-gray-400 hover:text-green-400 transition-colors touch-target"
          >
            <Share2 size={20} />
          </button>
        </div>
        
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`
            p-2 rounded-full transition-colors touch-target
            ${isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}
          `}
        >
          <Bookmark size={20} className={isBookmarked ? 'fill-current' : ''} />
        </button>
      </div>
    </div>
  );
};