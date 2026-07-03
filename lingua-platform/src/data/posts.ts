import type { Post, Comment } from '../types';

export const mockPosts: Post[] = [
  {
    id: 'p1',
    userId: 'user-1',
    userName: '学习达人',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20avatar%20portrait%20cartoon%20style&image_size=square',
    content: '今天完成了第100个单词！🎉 坚持每天学习真的很有成就感。大家一起加油！💪',
    likes: 128,
    createdAt: '2024-07-01 10:30',
    comments: [
      { id: 'c1', userId: 'user-2', userName: '日语学习者', content: '恭喜！我也要加油！', createdAt: '2024-07-01 11:00' },
      { id: 'c2', userId: 'user-3', userName: '韩语爱好者', content: '太棒了！坚持就是胜利', createdAt: '2024-07-01 11:30' },
    ],
  },
  {
    id: 'p2',
    userId: 'user-2',
    userName: '日语学习者',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20avatar%20portrait&image_size=square',
    content: '分享一个学习日语的小技巧：把手机语言设置成日语，强迫自己用日语操作，进步很快！📱',
    likes: 89,
    createdAt: '2024-07-01 09:15',
    comments: [
      { id: 'c3', userId: 'user-1', userName: '学习达人', content: '这个方法不错，试试看！', createdAt: '2024-07-01 09:30' },
    ],
  },
  {
    id: 'p3',
    userId: 'user-3',
    userName: '韩语爱好者',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=korean%20style%20avatar%20portrait%20cute&image_size=square',
    content: '终于通过了韩语TOPIK初级考试！🎊 感谢这个平台的课程帮助！',
    likes: 256,
    createdAt: '2024-06-30 20:00',
    comments: [
      { id: 'c4', userId: 'user-1', userName: '学习达人', content: '太厉害了！恭喜恭喜！', createdAt: '2024-06-30 20:15' },
      { id: 'c5', userId: 'user-2', userName: '日语学习者', content: '羡慕！我也要努力！', createdAt: '2024-06-30 20:30' },
      { id: 'c6', userId: 'user-4', userName: '英语初学者', content: '请问有什么学习心得分享吗？', createdAt: '2024-06-30 21:00' },
    ],
  },
  {
    id: 'p4',
    userId: 'user-4',
    userName: '英语初学者',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20student%20avatar%20portrait&image_size=square',
    content: '有没有一起练习英语口语的小伙伴？可以互相纠正发音！🗣️',
    likes: 67,
    createdAt: '2024-06-30 18:00',
    comments: [
      { id: 'c7', userId: 'user-1', userName: '学习达人', content: '我可以！加个好友吧', createdAt: '2024-06-30 18:30' },
    ],
  },
  {
    id: 'p5',
    userId: 'user-1',
    userName: '学习达人',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20avatar%20portrait%20cartoon%20style&image_size=square',
    content: '学习打卡第7天！🔥 连续一周每天学习30分钟以上，感觉进步很大！',
    likes: 156,
    createdAt: '2024-06-29 21:00',
    comments: [
      { id: 'c8', userId: 'user-2', userName: '日语学习者', content: '连续7天！太厉害了！', createdAt: '2024-06-29 21:15' },
    ],
  },
];

export const addPost = (content: string, userName: string, userAvatar: string, userId: string): Post => {
  const newPost: Post = {
    id: `p-${Date.now()}`,
    userId,
    userName,
    userAvatar,
    content,
    likes: 0,
    comments: [],
    createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
  };
  mockPosts.unshift(newPost);
  return newPost;
};

export const addComment = (postId: string, content: string, userName: string, userId: string): Comment | null => {
  const post = mockPosts.find(p => p.id === postId);
  if (!post) return null;
  
  const newComment: Comment = {
    id: `c-${Date.now()}`,
    userId,
    userName,
    content,
    createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
  };
  post.comments.push(newComment);
  return newComment;
};

export const likePost = (postId: string): void => {
  const post = mockPosts.find(p => p.id === postId);
  if (post) {
    post.likes++;
  }
};
