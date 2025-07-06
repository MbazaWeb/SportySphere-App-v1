import React, { useState, useRef } from 'react';
import { X, Camera, Video, BarChart3, Image, Smile, MapPin, Tag, Users } from 'lucide-react';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (postData: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSubmit, showToast }) => {
  const [content, setContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollQuestion, setPollQuestion] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (file: File, type: 'image' | 'video') => {
    setSelectedMedia(file);
    setMediaType(type);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setMediaPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleMediaSelect(file, 'image');
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      handleMediaSelect(file, 'video');
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!content.trim() && !selectedMedia && !showPollCreator) {
      showToast('Please add some content to your post', 'error');
      return;
    }

    if (showPollCreator && (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim()))) {
      showToast('Please complete your poll question and options', 'error');
      return;
    }

    const postData: any = {
      content: content.trim(),
      image: mediaType === 'image' ? mediaPreview : null,
      video: mediaType === 'video' ? mediaPreview : null,
    };

    if (showPollCreator) {
      postData.poll = {
        question: pollQuestion,
        options: pollOptions.filter(opt => opt.trim()).map(option => ({
          text: option,
          votes: 0,
          percentage: 0
        })),
        totalVotes: 0,
        hasVoted: false
      };
    }

    onSubmit(postData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-gray-900 w-full sm:max-w-lg sm:mx-4 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <X size={20} />
          </button>
          <h2 className="text-lg font-semibold">Create Post</h2>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!content.trim() && !selectedMedia && !showPollCreator}
          >
            Post
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[calc(90vh-80px)] overflow-y-auto">
          {/* Text Input */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening in sports?"
            className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-none outline-none text-lg min-h-[120px]"
            maxLength={280}
          />

          {/* Character Count */}
          <div className="flex justify-end">
            <span className={`text-sm ${content.length > 250 ? 'text-red-400' : 'text-gray-400'}`}>
              {content.length}/280
            </span>
          </div>

          {/* Media Preview */}
          {mediaPreview && (
            <div className="relative">
              {mediaType === 'image' ? (
                <img src={mediaPreview} alt="Preview" className="w-full rounded-lg max-h-64 object-cover" />
              ) : (
                <video src={mediaPreview} className="w-full rounded-lg max-h-64" controls />
              )}
              <button
                onClick={() => {
                  setSelectedMedia(null);
                  setMediaPreview(null);
                  setMediaType(null);
                }}
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Poll Creator */}
          {showPollCreator && (
            <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="w-full bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-lg border-none outline-none"
              />
              
              {pollOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-lg border-none outline-none"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      onClick={() => removePollOption(index)}
                      className="p-2 text-red-400 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              
              {pollOptions.length < 4 && (
                <button
                  onClick={addPollOption}
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  + Add option
                </button>
              )}
              
              <button
                onClick={() => {
                  setShowPollCreator(false);
                  setPollOptions(['', '']);
                  setPollQuestion('');
                }}
                className="text-red-400 text-sm hover:text-red-300 transition-colors"
              >
                Remove poll
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-blue-400 hover:bg-gray-800 rounded-full transition-colors"
                disabled={!!selectedMedia}
              >
                <Camera size={20} />
              </button>

              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <button
                onClick={() => videoInputRef.current?.click()}
                className="p-2 text-blue-400 hover:bg-gray-800 rounded-full transition-colors"
                disabled={!!selectedMedia}
              >
                <Video size={20} />
              </button>

              <button
                onClick={() => setShowPollCreator(!showPollCreator)}
                className={`p-2 hover:bg-gray-800 rounded-full transition-colors ${
                  showPollCreator ? 'text-blue-400' : 'text-gray-400'
                }`}
              >
                <BarChart3 size={20} />
              </button>

              <button className="p-2 text-gray-400 hover:bg-gray-800 rounded-full transition-colors">
                <Smile size={20} />
              </button>

              <button className="p-2 text-gray-400 hover:bg-gray-800 rounded-full transition-colors">
                <MapPin size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:bg-gray-800 rounded-full transition-colors">
                <Tag size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:bg-gray-800 rounded-full transition-colors">
                <Users size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};