import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { 
  Heart, Bell, Search, Plus, MessageSquare, Share2, MoreHorizontal, 
  Menu, Shield, Trophy, Users, Bookmark, X, ChevronLeft, ChevronRight, 
  Radio, BarChart3, Star, Mic, UserCheck, Flag, Clipboard, ArrowLeft, 
  ThumbsUp, ThumbsDown, Ticket, History, CreditCard, Smartphone, 
  Banknote, Gamepad2, CheckCircle, ShoppingCart, Tag, Settings, 
  Calendar as CalendarIcon, Link as LinkIcon, MapPin, Home, Play, 
  MessageCircle, TrendingUp, Video, AlertCircle, Zap, Camera, Send
} from 'lucide-react';
import { mockData, verificationTiers, currentUser } from './data/mockData';
import { useToast } from './hooks/useToast';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import { MobileHeader } from './components/MobileHeader';
import { MobileNavigation } from './components/MobileNavigation';
import { StoriesTray } from './components/StoriesTray';
import { PostCard } from './components/PostCard';
import { VideoCard } from './components/VideoCard';
import { LiveGameCard } from './components/LiveGameCard';
import { ProfilePage } from './components/ProfilePage';
import { StoryViewer } from './components/StoryViewer';
import { BettingCart } from './components/BettingCart';
import { ShopPage } from './components/ShopPage';
import { TeamsPlayersPage } from './components/TeamsPlayersPage';
import { LivePolls } from './components/LivePolls';
import { ChatPage } from './components/ChatPage';
import { SettingsPage } from './components/SettingsPage';
import { CreatePostModal } from './components/CreatePostModal';
import type { User, Post, Video as VideoType, LiveGame, Bet } from './types';

// Memoized components for better performance
const MemoizedPostCard = memo(PostCard);
const MemoizedVideoCard = memo(VideoCard);
const MemoizedLiveGameCard = memo(LiveGameCard);

function App() {
  // State management
  const [activeTab, setActiveTab] = useState('Feed');
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [storyViewerState, setStoryViewerState] = useState({ isOpen: false, activeIndex: null as number | null });
  const [betSlip, setBetSlip] = useState<Bet[]>([]);
  const [isBetSlipVisible, setIsBetSlipVisible] = useState(false);
  const [followingList, setFollowingList] = useState(new Set<string>());
  const [cart, setCart] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [posts, setPosts] = useState(mockData.posts);
  
  const { showToast, ToastContainer } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Memoized data to prevent unnecessary re-renders
  const memoizedPosts = useMemo(() => posts, [posts]);
  const memoizedVideos = useMemo(() => mockData.videos, []);
  const memoizedLiveGames = useMemo(() => mockData.liveGames, []);
  const memoizedStories = useMemo(() => mockData.stories, []);
  
  // Pull to refresh functionality with debouncing
  const debouncedRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    // Simulate refresh with shorter delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
    showToast('Feed refreshed!');
  }, [refreshing, showToast]);

  const { pullDistance, isPulling } = usePullToRefresh(contentRef, debouncedRefresh);

  // Optimized event handlers with useCallback
  const handleUserClick = useCallback((userName: string) => {
    const user = mockData.users[userName];
    if (user) {
      setViewingProfile(user);
    }
  }, []);

  const handleStoryClick = useCallback((storyId: number) => {
    setStoryViewerState({ isOpen: true, activeIndex: storyId });
  }, []);

  const handleAddBet = useCallback((bet: Omit<Bet, 'id' | 'wager' | 'payout'>) => {
    const newBet: Bet = {
      ...bet,
      id: Date.now(),
      wager: 10,
      payout: 20 // Calculate based on odds
    };
    setBetSlip(prev => [...prev, newBet]);
    setIsBetSlipVisible(true);
    showToast('Bet added to slip!');
  }, [showToast]);

  const handleAddToCart = useCallback((product: any) => {
    setCart(prev => [...prev, { ...product, quantity: 1 }]);
    showToast(`${product.name} added to cart!`);
  }, [showToast]);

  const handleCreatePost = useCallback((postData: any) => {
    const newPost: Post = {
      id: Date.now(),
      platform: 'SportSphere',
      user: currentUser.user,
      avatar: currentUser.avatar,
      content: postData.content,
      image: postData.image,
      likes: 0,
      comments: 0,
      time: 'now',
      verificationTier: currentUser.verificationTier,
      commentsData: []
    };
    
    setPosts(prev => [newPost, ...prev]);
    setIsCreatePostOpen(false);
    showToast('Post created successfully!');
  }, [showToast]);

  const handleFollowToggle = useCallback((userId: string) => {
    setFollowingList(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  // Memoized tab components
  const FeedTab = memo(() => (
    <div className="space-y-0">
      <StoriesTray 
        stories={memoizedStories} 
        onStoryClick={handleStoryClick}
        showToast={showToast}
      />
      <div className="space-y-4 px-4 py-4">
        {memoizedPosts.map(post => (
          <MemoizedPostCard 
            key={post.id} 
            post={post} 
            onUserClick={handleUserClick}
            showToast={showToast}
          />
        ))}
      </div>
    </div>
  ));

  const HighlightsTab = memo(() => (
    <div className="h-full overflow-hidden">
      <div className="h-full snap-y snap-mandatory overflow-y-auto no-scrollbar">
        {memoizedVideos.map(video => (
          <div key={video.id} className="h-full snap-center">
            <MemoizedVideoCard 
              video={video} 
              onUserClick={handleUserClick}
              showToast={showToast}
            />
          </div>
        ))}
      </div>
    </div>
  ));

  const LiveTab = memo(() => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Now</h2>
        <div className="flex items-center space-x-2 text-red-500">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">LIVE</span>
        </div>
      </div>
      {memoizedLiveGames.map(game => (
        <MemoizedLiveGameCard 
          key={game.id} 
          game={game} 
          onBetClick={handleAddBet}
          onGameClick={() => showToast('Game details coming soon!')}
        />
      ))}
    </div>
  ));

  // Tab content renderer with memoization
  const renderTabContent = useMemo(() => {
    if (viewingProfile) {
      return (
        <ProfilePage 
          user={viewingProfile} 
          onClose={() => setViewingProfile(null)}
          onUserClick={handleUserClick}
          showToast={showToast}
          followingList={followingList}
          onFollowToggle={handleFollowToggle}
        />
      );
    }

    const tabContent = {
      Feed: <FeedTab />,
      Highlights: <HighlightsTab />,
      Live: <LiveTab />,
      Shop: <ShopPage data={mockData.shop} onAddToCart={handleAddToCart} showToast={showToast} />,
      Teams: <TeamsPlayersPage 
        onUserClick={handleUserClick}
        showToast={showToast}
        followingList={followingList}
        onFollowToggle={handleFollowToggle}
      />,
      Polls: <LivePolls />,
      Chat: <ChatPage showToast={showToast} onUserClick={handleUserClick} />,
      Settings: <SettingsPage />
    };

    return tabContent[activeTab as keyof typeof tabContent] || tabContent.Feed;
  }, [activeTab, viewingProfile, followingList, handleUserClick, handleAddToCart, handleFollowToggle, showToast, FeedTab, HighlightsTab, LiveTab]);

  return (
    <div className="mobile-container bg-black text-white">
      <ToastContainer />
      
      {/* Story Viewer */}
      {storyViewerState.isOpen && (
        <StoryViewer 
          stories={memoizedStories}
          activeIndex={storyViewerState.activeIndex}
          onClose={() => setStoryViewerState({ isOpen: false, activeIndex: null })}
          onNext={() => {/* Handle next story */}}
          onPrev={() => {/* Handle prev story */}}
          onUserClick={handleUserClick}
        />
      )}

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <CreatePostModal
          onClose={() => setIsCreatePostOpen(false)}
          onSubmit={handleCreatePost}
          showToast={showToast}
        />
      )}

      {/* Betting Cart */}
      <BettingCart 
        bets={betSlip}
        isVisible={isBetSlipVisible}
        onClose={() => setIsBetSlipVisible(false)}
        onClear={() => setBetSlip([])}
        onRemove={(betId) => setBetSlip(prev => prev.filter(b => b.id !== betId))}
        onPlaceBet={() => showToast('Bet placed successfully!')}
      />

      {/* Floating Create Post Button */}
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 active:scale-95"
      >
        <Plus size={24} className="text-white" />
      </button>

      {/* Header */}
      <MobileHeader 
        activeTab={activeTab}
        onUserClick={handleUserClick}
        cartCount={cart.length}
        onCartClick={() => showToast('Cart opened!')}
      />

      {/* Main Content */}
      <div 
        ref={contentRef}
        className="content-area smooth-scroll"
        style={{ 
          transform: isPulling ? `translateY(${Math.min(pullDistance * 0.5, 60)}px)` : 'translateY(0)',
          transition: isPulling ? 'none' : 'transform 0.3s ease'
        }}
      >
        {/* Pull to Refresh Indicator */}
        {isPulling && (
          <div className="flex items-center justify-center py-4 text-blue-400">
            <div className="animate-spin mr-2">
              <ArrowLeft className="transform rotate-90" size={20} />
            </div>
            <span className="text-sm">Pull to refresh</span>
          </div>
        )}
        
        {refreshing && (
          <div className="flex items-center justify-center py-4 text-blue-400">
            <div className="animate-spin mr-2">
              <ArrowLeft className="transform rotate-90" size={20} />
            </div>
            <span className="text-sm">Refreshing...</span>
          </div>
        )}

        {renderTabContent}
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        betSlipCount={betSlip.length}
        onBetSlipClick={() => setIsBetSlipVisible(true)}
        onUserClick={() => handleUserClick(currentUser.user)}
      />
    </div>
  );
}

export default App;