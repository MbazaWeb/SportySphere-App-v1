export interface User {
  id: string;
  user: string;
  avatar: string;
  verificationTier: string;
  cover?: string;
  bio: string;
  joined: string;
  location?: string;
  website?: string;
  stats: {
    posts: string;
    followers: string;
    following: string;
  };
  competition?: string;
  country?: string;
}

export interface Post {
  id: number;
  platform: string;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  verificationTier: string;
  image?: string;
  video?: string;
  handle?: string;
  commentsData?: Comment[];
  poll?: {
    question: string;
    options: Array<{
      text: string;
      votes: number;
      percentage: number;
    }>;
    totalVotes: number;
    hasVoted: boolean;
  };
}

export interface Video {
  id: number;
  platform: string;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  videoUrl: string;
  verificationTier: string;
}

export interface Story {
  id: number;
  user: string;
  avatar: string;
  imageUrl: string;
  viewed: boolean;
  verificationTier: string;
}

export interface LiveGame {
  id: number;
  sport: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  time: string;
  odds: {
    team1: number;
    team2: number;
    total?: number;
    draw?: number;
  };
}

export interface Bet {
  id: number;
  game: LiveGame;
  team: string;
  odds: number;
  type: string;
  wager: number;
  payout: number;
}

export interface Comment {
  user: string;
  text: string;
  avatar: string;
  verificationTier?: string;
  likes: number;
  dislikes: number;
}