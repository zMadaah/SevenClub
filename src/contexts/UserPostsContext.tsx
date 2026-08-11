import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FeedPost } from '../types/post';
import { ActivityType } from '../types/lobby';
import {
  CURRENT_USER_ID,
  CURRENT_USER_NAME,
  CURRENT_USER_AVATAR,
} from '../constants/currentUser';

interface NewPostInput {
  photoUri: string;
  caption: string;
}

interface UserPostsContextValue {
  userPosts: FeedPost[];
  addPost: (input: NewPostInput) => void;
}

const UserPostsContext = createContext<UserPostsContextValue | undefined>(undefined);

export function UserPostsProvider({ children }: { children: ReactNode }) {
  const [userPosts, setUserPosts] = useState<FeedPost[]>([]);

  function addPost({ photoUri, caption }: NewPostInput) {
    // TODO: antes de salvar de verdade, subir `photoUri` pro Storage
    // (Firebase, no backend que já criamos) e usar a URL pública
    // devolvida — hoje o post só existe na sessão local do device.
    const newPost: FeedPost = {
      id: `local-${Date.now()}`,
      runner: {
        id: CURRENT_USER_ID,
        name: CURRENT_USER_NAME,
        avatarUrl: CURRENT_USER_AVATAR,
        level: 0,
        location: 'Brasília, Brasil',
        countryFlag: '🇧🇷',
      },
      createdAt: 'agora',
      caption: caption.length > 0 ? caption : undefined,
      photos: [photoUri],
      likes: 0,
      comments: 0,
      activityType: 'run' as ActivityType,
      isGroup: false,
      isFollowing: true,
    };
    setUserPosts((prev) => [newPost, ...prev]);
  }

  return (
    <UserPostsContext.Provider value={{ userPosts, addPost }}>
      {children}
    </UserPostsContext.Provider>
  );
}

export function useUserPosts() {
  const context = useContext(UserPostsContext);
  if (!context) {
    throw new Error('useUserPosts precisa estar dentro de um UserPostsProvider');
  }
  return context;
}
