import type { User, Post, Video, Story, LiveGame } from '../types';

export const verificationTiers = {
  player: { label: 'Verified Player', color: 'bg-blue-500' },
  team: { label: 'Official Team', color: 'bg-red-600' },
  sponsor: { label: 'Official Sponsor', color: 'bg-yellow-500' },
  reporter: { label: 'Verified Reporter', color: 'bg-purple-600' },
  fan: { label: 'Verified Fan', color: 'bg-pink-500' },
  coach: { label: 'Verified Coach', color: 'bg-green-600' },
  manager: { label: 'Team Manager', color: 'bg-indigo-600' },
  analyst: { label: 'Sports Analyst', color: 'bg-teal-500' },
};

export const currentUser: User = {
  id: 'sportysphereuser',
  user: 'SportySphereUser',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
  verificationTier: 'fan',
  cover: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1',
  bio: 'Just a passionate sports fan! 🏈⚽🏀',
  joined: 'July 2024',
  location: 'Planet Earth',
  website: 'mysports.blog',
  stats: { posts: '12', followers: '150', following: '280' }
};

const users: Record<string, User> = {
  'ESPN': {
    id: 'espn',
    user: 'ESPN',
    avatar: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
    verificationTier: 'reporter',
    country: 'USA',
    cover: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1',
    bio: 'The Worldwide Leader in Sports.',
    joined: 'June 2009',
    location: 'Bristol, CT',
    website: 'espn.com',
    stats: { posts: '1.2M', followers: '45.1M', following: '512' }
  },
  'LeBron James': {
    id: 'kingjames',
    user: 'LeBron James',
    avatar: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
    verificationTier: 'player',
    competition: 'NBA',
    country: 'USA',
    cover: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1',
    bio: 'Strive for Greatness | Husband, Father, Philanthropist',
    joined: 'July 2010',
    location: 'Akron, OH',
    website: 'lebronjames.com',
    stats: { posts: '2,541', followers: '158M', following: '389' }
  },
  'Cristiano Ronaldo': {
    id: 'cr7',
    user: 'Cristiano Ronaldo',
    avatar: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
    verificationTier: 'player',
    competition: 'Saudi Pro League',
    country: 'Portugal',
    cover: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1',
    bio: 'Living the dream. 🏆',
    joined: 'May 2012',
    location: 'Riyadh, Saudi Arabia',
    website: 'cristianoronaldo.com',
    stats: { posts: '3,450', followers: '615M', following: '50' }
  },
  'SportySphereUser': currentUser
};

const posts: Post[] = [
  {
    id: 1,
    platform: 'Twitter',
    user: 'ESPN',
    avatar: users['ESPN'].avatar,
    content: 'BREAKING: Major trade shakes up the NBA! 🏀⚡',
    likes: 98000,
    comments: 12300,
    time: '2m ago',
    verificationTier: 'reporter',
    commentsData: []
  },
  {
    id: 2,
    platform: 'Instagram',
    user: 'Cristiano Ronaldo',
    avatar: users['Cristiano Ronaldo'].avatar,
    content: 'Another win! Great team effort. On to the next one. 💪',
    likes: 4500000,
    comments: 88000,
    time: '1h ago',
    image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=600&h=750&dpr=1',
    verificationTier: 'player',
    commentsData: []
  },
  {
    id: 3,
    platform: 'Instagram',
    user: 'LeBron James',
    avatar: users['LeBron James'].avatar,
    content: 'Taco Tuesday 🌮🌮🌮',
    likes: 2300000,
    comments: 54000,
    time: '1d ago',
    image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1',
    verificationTier: 'player',
    commentsData: []
  }
];

const videos: Video[] = [
  {
    id: 1,
    platform: 'TikTok',
    user: 'LeBron James',
    avatar: users['LeBron James'].avatar,
    content: 'Workout motivation! 💪',
    likes: 1200000,
    comments: 25000,
    shares: 80000,
    videoUrl: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=338&h=600&dpr=1',
    verificationTier: 'player'
  },
  {
    id: 2,
    platform: 'TikTok',
    user: 'Cristiano Ronaldo',
    avatar: users['Cristiano Ronaldo'].avatar,
    content: 'Skills training session! ⚽',
    likes: 2100000,
    comments: 45000,
    shares: 120000,
    videoUrl: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=338&h=600&dpr=1',
    verificationTier: 'player'
  }
];

const stories: Story[] = [
  {
    id: 1,
    user: 'ESPN',
    avatar: users['ESPN'].avatar,
    imageUrl: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&dpr=1',
    viewed: false,
    verificationTier: 'reporter'
  },
  {
    id: 2,
    user: 'LeBron James',
    avatar: users['LeBron James'].avatar,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&dpr=1',
    viewed: false,
    verificationTier: 'player'
  },
  {
    id: 3,
    user: 'Cristiano Ronaldo',
    avatar: users['Cristiano Ronaldo'].avatar,
    imageUrl: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&dpr=1',
    viewed: true,
    verificationTier: 'player'
  }
];

const liveGames: LiveGame[] = [
  {
    id: 1,
    sport: 'NBA',
    team1: 'Lakers',
    team2: 'Celtics',
    score1: 88,
    score2: 85,
    time: "4Q 2:12",
    odds: { team1: -150, team2: +130, total: 210.5 }
  },
  {
    id: 2,
    sport: 'Premier League',
    team1: 'Man Utd',
    team2: 'Liverpool',
    score1: 1,
    score2: 1,
    time: "HT",
    odds: { team1: +250, team2: +110, draw: +220 }
  },
  {
    id: 3,
    sport: 'NFL',
    team1: 'Chiefs',
    team2: 'Bills',
    score1: 21,
    score2: 17,
    time: "3Q 5:30",
    odds: { team1: -180, team2: +160, total: 55.5 }
  }
];

const shop = {
  merchandise: [
    {
      id: 1,
      name: 'Lakers Jersey - LeBron James',
      price: 120.00,
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
    },
    {
      id: 2,
      name: 'Official NBA Game Ball',
      price: 199.99,
      image: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
    }
  ],
  memberships: [
    {
      id: 3,
      name: 'Lakers "Lakeshow" Insider Pass',
      price: 50.00,
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      description: 'Exclusive content, pre-sale ticket opportunities, and more.'
    }
  ],
  tickets: [
    {
      id: 4,
      name: 'Lakers vs Celtics - Lower Bowl',
      price: 350.00,
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      date: '2024-12-25',
      location: 'Crypto.com Arena'
    }
  ],
  promos: [
    {
      id: 5,
      name: 'Summer Sale: 20% Off All Jerseys',
      image: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1',
      description: 'Limited time offer on all official player and team jerseys.'
    }
  ]
};

export const mockData = {
  users,
  posts,
  videos,
  stories,
  liveGames,
  shop
};