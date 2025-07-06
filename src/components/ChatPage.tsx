import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Send, Phone, Video, MoreVertical, Smile, Paperclip, 
  Camera, Mic, ArrowLeft, Users, Settings, Star, Archive,
  CheckCheck, Check, Clock, Image as ImageIcon, Play
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { mockData } from '../data/mockData';

interface Message {
  id: number;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isOwn: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  verificationTier?: string;
  isGroup: boolean;
  participants?: string[];
}

interface ChatPageProps {
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  onUserClick?: (userName: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ 
  showToast = () => {}, 
  onUserClick = () => {} 
}) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock chats data
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'ESPN',
      avatar: mockData.users['ESPN'].avatar,
      lastMessage: 'Breaking: Major trade announcement coming soon!',
      lastMessageTime: '2m',
      unreadCount: 3,
      isOnline: true,
      verificationTier: 'reporter',
      isGroup: false
    },
    {
      id: '2',
      name: 'LeBron James',
      avatar: mockData.users['LeBron James'].avatar,
      lastMessage: 'Thanks for the support! 🙏',
      lastMessageTime: '15m',
      unreadCount: 0,
      isOnline: true,
      verificationTier: 'player',
      isGroup: false
    },
    {
      id: '3',
      name: 'Lakers Fans',
      avatar: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
      lastMessage: 'Who\'s watching the game tonight?',
      lastMessageTime: '1h',
      unreadCount: 12,
      isOnline: false,
      isGroup: true,
      participants: ['You', 'Mike', 'Sarah', '+47 others']
    },
    {
      id: '4',
      name: 'Cristiano Ronaldo',
      avatar: mockData.users['Cristiano Ronaldo'].avatar,
      lastMessage: 'Siuuuu! ⚽',
      lastMessageTime: '2h',
      unreadCount: 1,
      isOnline: false,
      verificationTier: 'player',
      isGroup: false
    },
    {
      id: '5',
      name: 'NBA Updates',
      avatar: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
      lastMessage: 'Game highlights from last night',
      lastMessageTime: '3h',
      unreadCount: 0,
      isOnline: true,
      isGroup: true,
      participants: ['You', 'Admin', '+1.2M others']
    }
  ]);

  // Mock messages for selected chat
  const loadMessages = (chatId: string) => {
    const mockMessages: Message[] = [
      {
        id: 1,
        senderId: chatId,
        senderName: chats.find(c => c.id === chatId)?.name || '',
        senderAvatar: chats.find(c => c.id === chatId)?.avatar || '',
        content: 'Hey! How are you doing?',
        timestamp: '10:30 AM',
        type: 'text',
        status: 'read',
        isOwn: false
      },
      {
        id: 2,
        senderId: 'me',
        senderName: 'You',
        senderAvatar: mockData.users['SportySphereUser'].avatar,
        content: 'I\'m good! Just watching the game highlights.',
        timestamp: '10:32 AM',
        type: 'text',
        status: 'read',
        isOwn: true
      },
      {
        id: 3,
        senderId: chatId,
        senderName: chats.find(c => c.id === chatId)?.name || '',
        senderAvatar: chats.find(c => c.id === chatId)?.avatar || '',
        content: 'That last play was incredible! 🔥',
        timestamp: '10:35 AM',
        type: 'text',
        status: 'read',
        isOwn: false
      }
    ];
    setMessages(mockMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now(),
      senderId: 'me',
      senderName: 'You',
      senderAvatar: mockData.users['SportySphereUser'].avatar,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'sending',
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, status: 'sent' } : m
      ));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, status: 'delivered' } : m
      ));
    }, 1000);

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: Date.now() + 1,
        senderId: selectedChat.id,
        senderName: selectedChat.name,
        senderAvatar: selectedChat.avatar,
        content: 'Thanks for sharing! 👍',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        status: 'read',
        isOwn: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedChat) {
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'text';
      
      const message: Message = {
        id: Date.now(),
        senderId: 'me',
        senderName: 'You',
        senderAvatar: mockData.users['SportySphereUser'].avatar,
        content: fileType === 'text' ? file.name : '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: fileType as 'text' | 'image' | 'video',
        mediaUrl: URL.createObjectURL(file),
        status: 'sending',
        isOwn: true
      };

      setMessages(prev => [...prev, message]);
      showToast(`${fileType} uploaded successfully!`);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MessageStatus: React.FC<{ status: Message['status'] }> = ({ status }) => {
    switch (status) {
      case 'sending':
        return <Clock size={12} className="text-gray-400" />;
      case 'sent':
        return <Check size={12} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={12} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={12} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => (
    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      {!message.isOwn && (
        <img
          src={message.senderAvatar}
          alt={message.senderName}
          className="w-8 h-8 rounded-full mr-2 cursor-pointer"
          onClick={() => onUserClick(message.senderName)}
        />
      )}
      <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-1' : 'order-2'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            message.isOwn
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
          }`}
        >
          {message.type === 'text' && <p>{message.content}</p>}
          {message.type === 'image' && (
            <div>
              <img src={message.mediaUrl} alt="Shared image" className="rounded-lg max-w-full" />
              {message.content && <p className="mt-2">{message.content}</p>}
            </div>
          )}
          {message.type === 'video' && (
            <div className="relative">
              <video src={message.mediaUrl} className="rounded-lg max-w-full" controls />
              {message.content && <p className="mt-2">{message.content}</p>}
            </div>
          )}
        </div>
        <div className={`flex items-center mt-1 space-x-1 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500">{message.timestamp}</span>
          {message.isOwn && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );

  if (!selectedChat) {
    return (
      <div className="h-full bg-gray-50 dark:bg-black">
        <div className="max-w-6xl mx-auto h-full flex">
          {/* Chat List */}
          <div className="w-full md:w-1/3 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h1>
              
              {/* Search */}
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto h-full">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat);
                    loadMessages(chat.id);
                  }}
                  className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800"
                >
                  <div className="relative">
                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full" />
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{chat.name}</h3>
                        {chat.verificationTier && <VerifiedBadge tier={chat.verificationTier} />}
                        {chat.isGroup && <Users size={14} className="text-gray-400" />}
                      </div>
                      <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </span>
                      )}
                    </div>
                    
                    {chat.isGroup && chat.participants && (
                      <p className="text-xs text-gray-400 mt-1">{chat.participants.join(', ')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a conversation</h3>
              <p className="text-gray-600 dark:text-gray-400">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-black">
      <div className="max-w-6xl mx-auto h-full flex">
        {/* Chat List - Hidden on mobile when chat is selected */}
        <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-1/3 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h1>
            
            {/* Search */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="overflow-y-auto h-full">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  loadMessages(chat.id);
                }}
                className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 ${
                  selectedChat?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="relative">
                  <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full" />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  )}
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{chat.name}</h3>
                      {chat.verificationTier && <VerifiedBadge tier={chat.verificationTier} />}
                      {chat.isGroup && <Users size={14} className="text-gray-400" />}
                    </div>
                    <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  {chat.isGroup && chat.participants && (
                    <p className="text-xs text-gray-400 mt-1">{chat.participants.join(', ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="relative">
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={() => onUserClick(selectedChat.name)}
                />
                {selectedChat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-1">
                  <h3 
                    className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-500"
                    onClick={() => onUserClick(selectedChat.name)}
                  >
                    {selectedChat.name}
                  </h3>
                  {selectedChat.verificationTier && <VerifiedBadge tier={selectedChat.verificationTier} />}
                  {selectedChat.isGroup && <Users size={14} className="text-gray-400" />}
                </div>
                <p className="text-sm text-gray-500">
                  {selectedChat.isOnline ? 'Online' : 'Last seen recently'}
                  {isTyping && ' • typing...'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <Phone size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <Video size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <img src={selectedChat.avatar} alt={selectedChat.name} className="w-8 h-8 rounded-full" />
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <Paperclip size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <Camera size={20} className="text-gray-600 dark:text-gray-400" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full border-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                  <Smile size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <Mic size={20} className="text-gray-600 dark:text-gray-400" />
              </button>

              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-colors"
              >
                <Send size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};