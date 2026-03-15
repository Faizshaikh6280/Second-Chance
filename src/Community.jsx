import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Heart, MessageCircle, Share2, Plus, 
  Search, Shield, Star, MoreHorizontal, X, Send, Image as ImageIcon
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_POSTS = [
  {
    id: 1,
    author: 'Sarah M.',
    avatar: 'bg-orange-300',
    time: '2 hours ago',
    badge: '🏆 30 Days Sober',
    content: "I finally hit my 30-day mark! The cravings were intense during week 2, but the urge surfing technique really saved me. Thank you to everyone here for the constant support.",
    likes: 124,
    isLiked: false,
    commentsList: [
      { id: 101, author: 'Alex D.', avatar: 'bg-blue-300', text: "So incredibly proud of you! Week 2 is definitely the hardest.", time: '1 hr ago' },
      { id: 102, author: 'Priya K.', avatar: 'bg-teal-400', text: "Urge surfing is a game changer. Keep going!", time: '45 mins ago' }
    ]
  },
  {
    id: 2,
    author: 'Anonymous',
    avatar: 'bg-gray-300',
    time: '5 hours ago',
    badge: '🌿 Seeking Support',
    content: "Having a really tough evening. The stress from work is making me want to fall back into old habits. Just writing this out to keep myself accountable tonight.",
    likes: 89,
    isLiked: true,
    commentsList: [
      { id: 103, author: 'Marcus T.', avatar: 'bg-yellow-400', text: "I hear you. Try to splash some cold water on your face right now to reset your nervous system. You've got this.", time: '3 hrs ago' }
    ]
  },
  {
    id: 3,
    author: 'David K.',
    avatar: 'bg-blue-300',
    time: '1 day ago',
    badge: '✨ Milestone',
    content: "Deleted all my delivery apps. Taking control of my sugar addiction one step at a time. Meal prepping for the whole week today!",
    likes: 210,
    isLiked: false,
    commentsList: []
  }
];

const MOCK_GROUPS = [
  { id: 1, name: 'Alcohol Free Journey', members: '12.4k', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 2, name: 'Digital Detox', members: '8.2k', icon: Share2, color: 'text-purple-500', bg: 'bg-purple-100' },
  { id: 3, name: 'Sugar Craving Support', members: '5.1k', icon: Star, color: 'text-orange-500', bg: 'bg-orange-100' },
];

export default function Community() {
  const [activeTab, setActiveTab] = useState('feed'); 
  const [posts, setPosts] = useState(INITIAL_POSTS);

  // Compose Post State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  // Commenting State
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  // --- ACTIONS ---

  const handleLike = (id) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost = {
      id: Date.now(),
      author: 'You',
      avatar: 'bg-[#7D9C6D]',
      time: 'Just now',
      badge: '💬 General Update',
      content: newPostContent,
      likes: 0,
      isLiked: false,
      commentsList: []
    };

    setPosts([newPost, ...posts]); // Add to top of feed array
    setNewPostContent('');
    setIsComposeOpen(false); // Close the modal
  };

  const handleToggleComments = (id) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  const handleAddComment = (postId) => {
    if (!newCommentText.trim()) return;

    setPosts(posts.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: Date.now(),
          author: 'You',
          avatar: 'bg-[#7D9C6D]',
          text: newCommentText,
          time: 'Just now'
        };
        return { ...p, commentsList: [...p.commentsList, newComment] };
      }
      return p;
    }));
    setNewCommentText('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex-1 bg-[#FAFAFA] relative flex flex-col h-full overflow-hidden font-sans"
    >
      {/* --- HEADER --- */}
      <div className="pt-12 px-6 pb-4 bg-white rounded-b-[40px] shadow-sm z-20 shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <Users className="text-[#7D9C6D]" /> Safe Space
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1">You are never alone in this.</p>
          </div>
          <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
            <Search size={20} />
          </button>
        </div>

        {/* Custom Tabs */}
        <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
          {['feed', 'groups', 'my safe circle'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.split(' ')[0])}
              className={`flex-1 py-2 text-sm font-bold rounded-xl capitalize transition-all ${
                activeTab === tab.split(' ')[0] ? 'bg-white text-[#7D9C6D] shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto p-6 pb-32 hide-scrollbar">
        <AnimatePresence mode="popLayout">
          
          {/* FEED VIEW */}
          {activeTab === 'feed' && (
            <motion.div key="feed" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              
              {/* --- NEW: PROMINENT COMPOSE BOX --- */}
              <div className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100 mb-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#7D9C6D] shrink-0 border-2 border-[#D9ECA2] flex items-center justify-center text-white font-bold">You</div>
                  <button 
                    onClick={() => setIsComposeOpen(true)}
                    className="flex-1 bg-gray-50 text-left text-gray-500 px-5 py-3.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    Share your experience or ask for support...
                  </button>
                </div>
                <div className="flex justify-end px-2">
                   <button 
                     onClick={() => setIsComposeOpen(true)}
                     className="text-[#7D9C6D] text-sm font-bold flex items-center gap-1 hover:text-[#6b865d]"
                   >
                     <ImageIcon size={16} /> Add Photo
                   </button>
                </div>
              </div>

              {/* POSTS LIST */}
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-100 mb-5 overflow-hidden">
                  
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${post.avatar} border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs`}>
                        {post.author === 'You' ? 'You' : ''}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{post.author}</h4>
                        <p className="text-xs text-gray-400 font-medium">{post.time}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                  </div>

                  {/* Badge & Content */}
                  <div className="inline-block px-3 py-1 bg-[#D9ECA2]/40 text-[#7D9C6D] rounded-lg text-xs font-bold mb-3">
                    {post.badge}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Action Bar */}
                  <div className="flex items-center gap-6 border-t border-gray-50 pt-4">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition-colors ${post.isLiked ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} className={post.isLiked ? "animate-[ping_0.3s_ease-out]" : ""} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button 
                      onClick={() => handleToggleComments(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition-colors ${expandedPostId === post.id ? 'text-[#7D9C6D]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <MessageCircle size={20} />
                      <span className="text-sm">{post.commentsList.length}</span>
                    </button>
                  </div>

                  {/* Expandable Comments Section */}
                  <AnimatePresence>
                    {expandedPostId === post.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-4 pt-4 border-t border-gray-50"
                      >
                        <div className="space-y-4 mb-4">
                          {post.commentsList.map(comment => (
                            <div key={comment.id} className="flex gap-3">
                              <div className={`w-8 h-8 rounded-full ${comment.avatar} shrink-0 flex items-center justify-center text-white text-[10px] font-bold`}>
                                {comment.author === 'You' ? 'You' : ''}
                              </div>
                              <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none flex-1 border border-gray-100">
                                <div className="flex items-baseline justify-between mb-1">
                                  <span className="font-bold text-gray-800 text-xs">{comment.author}</span>
                                  <span className="text-[10px] font-bold text-gray-400">{comment.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-snug">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                          {post.commentsList.length === 0 && (
                            <p className="text-xs text-center font-bold text-gray-400 py-2">Be the first to share support.</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={newCommentText} 
                            onChange={(e) => setNewCommentText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            placeholder="Add a supportive comment..." 
                            className="flex-1 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#7D9C6D]"
                          />
                          <button 
                            onClick={() => handleAddComment(post.id)}
                            className="w-10 h-10 bg-[#7D9C6D] text-white rounded-full flex items-center justify-center hover:bg-[#6b865d] transition-colors shrink-0"
                          >
                            <Send size={16} className="ml-0.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              ))}
            </motion.div>
          )}

          {/* GROUPS VIEW */}
          {activeTab === 'groups' && (
            <motion.div key="groups" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="font-extrabold text-gray-800 text-lg mb-2">Suggested for you</h2>
              {MOCK_GROUPS.map(group => (
                <div key={group.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${group.bg} ${group.color} flex items-center justify-center`}>
                      <group.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{group.name}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{group.members} members</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-50 text-[#7D9C6D] font-bold text-sm rounded-xl border border-gray-100 hover:bg-[#D9ECA2] hover:border-[#D9ECA2] transition-colors">
                    Join
                  </button>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- COMPOSE NEW POST MODAL --- */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsComposeOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-[390px] rounded-t-[40px] sm:rounded-[40px] p-6 pb-12 relative z-10 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-gray-800">Share Experience</h2>
                <button onClick={() => setIsComposeOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200">
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex gap-3 mb-4">
                 <div className="w-10 h-10 rounded-full bg-[#7D9C6D] shrink-0 flex items-center justify-center text-white text-xs font-bold">You</div>
                 <textarea 
                   autoFocus
                   value={newPostContent}
                   onChange={(e) => setNewPostContent(e.target.value)}
                   placeholder="What's on your mind? How are you feeling today?"
                   className="flex-1 min-h-[120px] bg-transparent resize-none focus:outline-none text-gray-700 placeholder:text-gray-400 text-lg leading-relaxed"
                 />
              </div>

              <button 
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="w-full py-4 rounded-2xl font-bold text-lg text-white bg-[#7D9C6D] hover:bg-[#6b865d] disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-md mt-4"
              >
                Post to Community
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
}