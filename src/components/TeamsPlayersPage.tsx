import React, { useState } from 'react';
import { Search, Filter, Users, Trophy, MapPin, Calendar, Star, Heart, MessageCircle, UserPlus, UserCheck } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { mockData } from '../data/mockData';
import type { User } from '../types';

interface TeamsPlayersPageProps {
  onUserClick?: (userName: string) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  followingList?: Set<string>;
  onFollowToggle?: (userId: string) => void;
}

export const TeamsPlayersPage: React.FC<TeamsPlayersPageProps> = ({
  onUserClick = () => {},
  showToast = () => {},
  followingList = new Set(),
  onFollowToggle = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'teams' | 'players'>('teams');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get teams and players from mock data
  const allUsers = Object.values(mockData.users);
  const teams = allUsers.filter(user => user.verificationTier === 'team');
  const players = allUsers.filter(user => user.verificationTier === 'player');

  // Get unique sports and countries
  const sports = ['All', ...new Set(allUsers.map(u => u.competition).filter(Boolean))];
  const countries = ['All', ...new Set(allUsers.map(u => u.country).filter(Boolean))];

  // Filter function
  const filterEntities = (entities: User[]) => {
    return entities.filter(entity => {
      const matchesSearch = entity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           entity.bio?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSport = selectedSport === 'All' || entity.competition === selectedSport;
      const matchesCountry = selectedCountry === 'All' || entity.country === selectedCountry;
      
      return matchesSearch && matchesSport && matchesCountry;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.user.localeCompare(b.user);
        case 'followers':
          return parseInt(b.stats.followers.replace(/[^\d]/g, '')) - parseInt(a.stats.followers.replace(/[^\d]/g, ''));
        case 'popularity':
        default:
          return parseInt(b.stats.followers.replace(/[^\d]/g, '')) - parseInt(a.stats.followers.replace(/[^\d]/g, ''));
      }
    });
  };

  const filteredTeams = filterEntities(teams);
  const filteredPlayers = filterEntities(players);

  const EntityCard: React.FC<{ entity: User; type: 'team' | 'player' }> = ({ entity, type }) => {
    const isFollowing = followingList.has(entity.id);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Cover Image */}
        <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          {entity.cover && (
            <img src={entity.cover} alt="Cover" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Profile Section */}
        <div className="p-4 -mt-8 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={entity.avatar}
                alt={entity.user}
                className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => onUserClick(entity.user)}
              />
              <div className="mt-8">
                <div 
                  className="flex items-center space-x-1 cursor-pointer hover:text-blue-500 transition-colors"
                  onClick={() => onUserClick(entity.user)}
                >
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{entity.user}</h3>
                  <VerifiedBadge tier={entity.verificationTier} />
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {entity.competition && (
                    <span className="flex items-center">
                      <Trophy size={14} className="mr-1" />
                      {entity.competition}
                    </span>
                  )}
                  {entity.country && (
                    <span className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {entity.country}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onFollowToggle(entity.id);
                showToast(isFollowing ? `Unfollowed ${entity.user}` : `Following ${entity.user}!`);
              }}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 flex items-center space-x-1 ${
                isFollowing
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
              <span>{isFollowing ? 'Following' : 'Follow'}</span>
            </button>
          </div>

          {/* Bio */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 line-clamp-2">
            {entity.bio}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">{entity.stats.posts}</div>
                <div className="text-gray-500 dark:text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">{entity.stats.followers}</div>
                <div className="text-gray-500 dark:text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">{entity.stats.following}</div>
                <div className="text-gray-500 dark:text-gray-400">Following</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button 
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                onClick={() => showToast('Added to favorites!')}
              >
                <Heart size={16} />
              </button>
              <button 
                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                onClick={() => showToast('Message feature coming soon!')}
              >
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EntityListItem: React.FC<{ entity: User; type: 'team' | 'player' }> = ({ entity, type }) => {
    const isFollowing = followingList.has(entity.id);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={entity.avatar}
              alt={entity.user}
              className="w-12 h-12 rounded-full cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onUserClick(entity.user)}
            />
            <div>
              <div 
                className="flex items-center space-x-1 cursor-pointer hover:text-blue-500 transition-colors"
                onClick={() => onUserClick(entity.user)}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">{entity.user}</h3>
                <VerifiedBadge tier={entity.verificationTier} />
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{entity.stats.followers} followers</span>
                {entity.competition && <span>• {entity.competition}</span>}
                {entity.country && <span>• {entity.country}</span>}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onFollowToggle(entity.id);
              showToast(isFollowing ? `Unfollowed ${entity.user}` : `Following ${entity.user}!`);
            }}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
              isFollowing
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>
    );
  };

  const currentEntities = activeTab === 'teams' ? filteredTeams : filteredPlayers;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Teams & Players</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover and follow your favorite teams and athletes</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams and players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {sports.map(sport => (
                  <option key={sport} value={sport}>{sport === 'All' ? 'All Sports' : sport}</option>
                ))}
              </select>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country === 'All' ? 'All Countries' : country}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="popularity">Most Popular</option>
                <option value="followers">Most Followers</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'teams'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Teams ({filteredTeams.length})
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'players'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Players ({filteredPlayers.length})
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Users size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Results */}
        {currentEntities.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {currentEntities.map(entity => (
              viewMode === 'grid' ? (
                <EntityCard key={entity.id} entity={entity} type={activeTab} />
              ) : (
                <EntityListItem key={entity.id} entity={entity} type={activeTab} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};