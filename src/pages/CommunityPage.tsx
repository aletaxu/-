import { useState } from 'react';
import { Send, Heart, MessageCircle, Share2, UserPlus, CalendarCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockPosts, addPost, addComment, likePost } from '../data/posts';
import type { Post } from '../types';

export const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});

  const handleSubmitPost = () => {
    if (!newPostContent.trim() || !user) return;
    
    const newPost = addPost(newPostContent, user.nickname, user.avatar, user.id);
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleLike = (postId: string) => {
    likePost(postId);
    setPosts([...posts]);
  };

  const handleSubmitComment = (postId: string) => {
    if (!commentContent[postId]?.trim() || !user) return;
    
    addComment(postId, commentContent[postId], user.nickname, user.id);
    setCommentContent(prev => ({ ...prev, [postId]: '' }));
    setPosts([...posts]);
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">社区交流</h1>
        <p className="text-gray-500">与其他学习者分享心得，互相鼓励进步</p>
      </section>

      <section className="card-gradient p-6">
        <div className="flex gap-4">
          <img
            src={user?.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=avatar%20portrait&image_size=square'}
            alt={user?.nickname || 'User'}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              placeholder="分享你的学习心得..."
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors resize-none h-24"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmitPost}
                disabled={!newPostContent.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  newPostContent.trim()
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>发布</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {posts.map(post => (
            <div key={post.id} className="card-gradient p-6">
              <div className="flex items-start gap-4">
                <img
                  src={post.userAvatar}
                  alt={post.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">{post.userName}</h4>
                    <span className="text-xs text-gray-400">{post.createdAt}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{post.content}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>{post.likes}</span>
                </button>
                <button
                  onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments.length}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>分享</span>
                </button>
              </div>

              {expandedPostId === post.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="space-y-4">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
                          {comment.userName[0]}
                        </div>
                        <div className="bg-gray-100 rounded-xl p-3">
                          <span className="font-medium text-gray-800 text-sm">{comment.userName}</span>
                          <p className="text-gray-600 text-sm mt-1">{comment.content}</p>
                          <span className="text-xs text-gray-400 mt-1 block">{comment.createdAt}</span>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-3">
                      <img
                        src={user?.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=avatar%20portrait&image_size=square'}
                        alt={user?.nickname || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={commentContent[post.id] || ''}
                          onChange={e => setCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="写下你的评论..."
                          className="flex-1 px-4 py-2 rounded-full border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                        />
                        <button
                          onClick={() => handleSubmitComment(post.id)}
                          className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <section className="card-gradient p-6">
            <h3 className="font-semibold text-gray-800 mb-4">学习打卡</h3>
            <div className="p-4 bg-gradient-to-r from-accent-50 to-warning-50 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">今日打卡</h4>
                  <p className="text-sm text-gray-500">连续 {user?.streakDays || 0} 天</p>
                </div>
              </div>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-400 to-accent-500 text-white font-semibold hover:shadow-lg transition-all">
                立即打卡
              </button>
            </div>
          </section>

          <section className="card-gradient p-6">
            <h3 className="font-semibold text-gray-800 mb-4">学习小组</h3>
            <div className="space-y-3">
              {[
                { name: '英语学习群', members: 1280, active: true },
                { name: '日语爱好者', members: 890, active: true },
                { name: '韩语交流组', members: 650, active: false },
                { name: '备考雅思', members: 420, active: true },
              ].map((group, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">{group.name}</p>
                    <p className="text-xs text-gray-500">{group.members} 名成员</p>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors">
                    <UserPlus className="w-4 h-4" />
                    <span>加入</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="card-gradient p-6">
            <h3 className="font-semibold text-gray-800 mb-4">热门话题</h3>
            <div className="space-y-2">
              {[
                '#英语学习', '#日语入门', '#韩语TOPIK', '#雅思备考', '#口语练习',
              ].map((topic, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
                >
                  {topic}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
