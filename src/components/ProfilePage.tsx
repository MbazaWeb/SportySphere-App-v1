import React, { useState } from 'react';
import { ArrowLeft, MapPin, Link as LinkIcon, Calendar, MoreHorizontal, Settings, Share2, Bell, Flag, Blocks as Block, Heart, MessageCircle, Users, Trophy, Star, Camera, Edit3, Grid, List, Bookmark, Image as ImageIcon, Video, BarChart3, UserPlus, UserCheck } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { PostCard } from './PostCard';
import { mockData } from '../data/mockData';
import type { User, Post } from '../types';

interface ProfilePageProps {
  user: User;
  onClose: () => void;
  onUserClick: (userName: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  followingList: Set<string>;
  onFollowToggle: (userId: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onClose,
  onUserClick,
  showToast,
  followingList,
  onFollowToggle
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media' | 'likes'>('posts');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const isCurrentUserProfile = user.id === mockData.users['SportySphereUser'].id;
  const isFollowing = followingList.has(user.id);

  // Get user's posts
  const userPosts = mockData.posts.filter(post => post.user === user.user);
  const userMediaPosts = userPosts.filter(post => post.image);
  const userReplies: Post[] = []; // Would be populated with actual replies
  const userLikes: Post[] = []; // Would be populated with liked posts

  const handleFollow = () => {
    onFollowToggle(user.id);
    showToast(isFollowing ? `Unfollowed ${user.user}` : `Following ${user.user}!`);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out ${user.user} on SportSphere`,
          text: user.bio,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Profile link copied to clipboard!');
      }
    } catch (err) {
      showToast('Could not share profile', 'error');
    }
  };

  const ProfileStats: React.FC<{ label: string; value: string; onClick?: () => void }> = ({ 
    label, 
    value, 
    onClick 
  }) => (
    <button
      onClick={onClick}
      className="text-center hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
    >
      <div className="font-bold text-lg text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </button>
  );

  const TabButton: React.FC<{ 
    tab: string; 
    label: string; 
    icon: React.ReactNode; 
    count?: number 
  }> = ({ tab, label, icon, count }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex items-center space-x-2 px-4 py-3 font-semibold transition-colors ${
        activeTab === tab
          ? 'text-blue-500 border-b-2 border-blue-500'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      }`}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && <span className="text-xs">({count})</span>}
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return userPosts.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
            {userPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onUserClick={onUserClick}
                showToast={showToast}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No posts yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {isCurrentUserProfile ? "Share your first post!" : `${user.user} hasn't posted anything yet.`}
            </p>
          </div>
        );

      case 'replies':
        return userReplies.length > 0 ? (
          <div className="space-y-4">
            {userReplies.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onUserClick={onUserClick}
                showToast={showToast}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No replies yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Replies will appear here</p>
          </div>
        );

      case 'media':
        return userMediaPosts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {userMediaPosts.map(post => (
              <div key={post.id} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img
                  src={post.image}
                  alt="Media post"
                  className="w-full h-full object-cover"
                  onClick={() => showToast('Media viewer coming soon!')}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No media yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Photos and videos will appear here</p>
          </div>
        );

      case 'likes':
        return userLikes.length > 0 ? (
          <div className="space-y-4">
            {userLikes.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onUserClick={onUserClick}
                showToast={showToast}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No likes yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Liked posts will appear here</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-black z-40 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center space-x-1">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">{user.user}</h2>
              <VerifiedBadge tier={user.verificationTier} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.stats.posts} Posts</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <MoreHorizontal size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            
            {showMoreOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                {!isCurrentUserProfile && (
                  <>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                      <Bell size={16} />
                      <span>Turn on notifications</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                      <Flag size={16} />
                      <span>Report</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-500">
                      <Block size={16} />
                      <span>Block</span>
                    </button>
                  </>
                )}
                {isCurrentUserProfile && (
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {user.cover && (
          <img
            src={user.cover}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {isCurrentUserProfile && (
          <button className="absolute bottom-4 right-4 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-colors">
            <Camera size={20} className="text-white" />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-4 -mt-16 relative">
        <div className="flex justify-between items-end mb-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.user}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-black object-cover"
            />
            {isCurrentUserProfile && (
              <button className="absolute bottom-2 right-2 p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors">
                <Camera size={16} className="text-white" />
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            {isCurrentUserProfile ? (
              <button 
                onClick={() => showToast('Edit profile coming soon!')}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => showToast('Message feature coming soon!')}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Message
                </button>
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors flex items-center space-x-2 ${
                    isFollowing
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.user}</h1>
            <VerifiedBadge tier={user.verificationTier} />
          </div>

          <p className="text-gray-900 dark:text-white leading-relaxed">{user.bio}</p>

          <div className="flex flex-wrap gap-4 text-gray-500 dark:text-gray-400 text-sm">
            {user.location && (
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center space-x-1">
                <LinkIcon size={14} />
                <a 
                  href={`https://${user.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {user.website}
                </a>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>Joined {user.joined}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-6">
            <ProfileStats
              label="Following"
              value={user.stats.following}
              onClick={() => setShowFollowing(true)}
            />
            <ProfileStats
              label="Followers"
              value={user.stats.followers}
              onClick={() => setShowFollowers(true)}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 sticky top-16 bg-white dark:bg-black z-10">
        <div className="flex justify-between items-center px-4">
          <div className="flex overflow-x-auto">
            <TabButton
              tab="posts"
              label="Posts"
              icon={<MessageCircle size={16} />}
              count={userPosts.length}
            />
            <TabButton
              tab="replies"
              label="Replies"
              icon={<MessageCircle size={16} />}
              count={userReplies.length}
            />
            <TabButton
              tab="media"
              label="Media"
              icon={<ImageIcon size={16} />}
              count={userMediaPosts.length}
            />
            <TabButton
              tab="likes"
              label="Likes"
              icon={<Heart size={16} />}
              count={userLikes.length}
            />
          </div>

          {activeTab === 'posts' && (
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Grid size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {renderTabContent()}
      </div>

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md m-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Followers</h3>
              <button
                onClick={() => setShowFollowers(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            <div className="p-4 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-4" />
              <p>Followers list coming soon!</p>
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md m-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Following</h3>
              <button
                onClick={() => setShowFollowing(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            <div className="p-4 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-4" />
              <p>Following list coming soon!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};