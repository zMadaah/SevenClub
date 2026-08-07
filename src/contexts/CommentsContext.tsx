import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Comment } from '../types/comment';
import { CURRENT_USER_ID, CURRENT_USER_NAME, CURRENT_USER_AVATAR } from '../constants/currentUser';

interface CommentsContextValue {
  getComments: (postId: string) => Comment[];
  addComment: (postId: string, text: string, parentCommentId?: string) => void;
  deleteComment: (commentId: string) => void;
}

const CommentsContext = createContext<CommentsContextValue | undefined>(undefined);

// TODO: trocar por chamada real em services/api.ts assim que existir.
// Alguns comentários de exemplo, pra tela não nascer vazia nos posts mock.
const SEED_COMMENTS: Comment[] = [
  {
    id: 'cm1',
    postId: '1',
    userId: 'r1',
    userName: 'Marina Alves',
    userAvatarUrl: 'https://i.pravatar.cc/200?img=32',
    text: 'Que vista incrível! 🔥',
    createdAtLabel: '1 h',
  },
  {
    id: 'cm2',
    postId: '1',
    userId: 'r2',
    userName: 'Lucas Ferreira',
    userAvatarUrl: 'https://i.pravatar.cc/200?img=12',
    text: 'Bora repetir essa rota juntos',
    createdAtLabel: '45 min',
    parentCommentId: 'cm1',
  },
  {
    id: 'cm3',
    postId: '2',
    userId: 'r3',
    userName: 'Julia Prado',
    userAvatarUrl: 'https://i.pravatar.cc/200?img=47',
    text: 'Que pedal! Qual foi a distância total?',
    createdAtLabel: '3 h',
  },
];

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS);

  function getComments(postId: string) {
    return comments.filter((c) => c.postId === postId);
  }

  function addComment(postId: string, text: string, parentCommentId?: string) {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      userId: CURRENT_USER_ID,
      userName: CURRENT_USER_NAME,
      userAvatarUrl: CURRENT_USER_AVATAR,
      text,
      createdAtLabel: 'agora',
      parentCommentId,
    };
    setComments((prev) => [...prev, newComment]);
  }

  function deleteComment(commentId: string) {
    // Apaga o comentário e qualquer resposta direta a ele — evita deixar
    // respostas "órfãs" apontando pra um parentCommentId que não existe mais
    setComments((prev) =>
      prev.filter((c) => c.id !== commentId && c.parentCommentId !== commentId)
    );
  }

  return (
    <CommentsContext.Provider value={{ getComments, addComment, deleteComment }}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments precisa estar dentro de um CommentsProvider');
  }
  return context;
}
