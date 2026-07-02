import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'test@example.com',
    password: '123456',
    nickname: '学习达人',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20avatar%20portrait%20cartoon%20style&image_size=square',
    preferredLanguage: 'english',
    streakDays: 7,
    totalLearningTime: 1250,
    completedCourses: 3,
    masteredWords: 156,
    createdAt: '2024-01-15',
  },
  {
    id: 'user-2',
    email: 'japanese@example.com',
    password: '123456',
    nickname: '日语学习者',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20avatar%20portrait&image_size=square',
    preferredLanguage: 'japanese',
    streakDays: 15,
    totalLearningTime: 2300,
    completedCourses: 5,
    masteredWords: 280,
    createdAt: '2024-02-20',
  },
];

export const login = (req: LoginRequest): AuthResponse | null => {
  const user = mockUsers.find(u => u.email === req.email && u.password === req.password);
  if (!user) return null;
  
  return {
    token: `token-${user.id}-${Date.now()}`,
    user,
  };
};

export const register = (req: RegisterRequest): AuthResponse | null => {
  const exists = mockUsers.find(u => u.email === req.email);
  if (exists) return null;
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: req.email,
    password: req.password,
    nickname: req.nickname,
    avatar: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=avatar%20portrait%20${encodeURIComponent(req.nickname)}&image_size=square`,
    preferredLanguage: 'english',
    streakDays: 0,
    totalLearningTime: 0,
    completedCourses: 0,
    masteredWords: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  
  mockUsers.push(newUser);
  
  return {
    token: `token-${newUser.id}-${Date.now()}`,
    user: newUser,
  };
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(u => u.id === id);
};
