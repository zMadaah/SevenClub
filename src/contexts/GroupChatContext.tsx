import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LobbyChatMessage } from '../types/lobbyChat';
import { CURRENT_USER_ID, CURRENT_USER_NAME, CURRENT_USER_AVATAR } from '../constants/currentUser';
import { MOCK_GROUP_MESSAGES } from '../services/mock/lobbyChat';

interface GroupChatContextValue {
  getMessages: (groupId: string) => LobbyChatMessage[];
  addMessage: (groupId: string, text: string) => void;
}

const GroupChatContext = createContext<GroupChatContextValue | undefined>(undefined);

// Serve tanto pro chat de lobby privado quanto pro chat de crew — os
// dois têm exatamente a mesma forma (grupo com id + lista de mensagens),
// só muda de onde vem o "groupId" (activeLobby.id ou activeCrew.id).
export function GroupChatProvider({ children }: { children: ReactNode }) {
  const [messagesByGroup, setMessagesByGroup] =
    useState<Record<string, LobbyChatMessage[]>>(MOCK_GROUP_MESSAGES);

  function getMessages(groupId: string) {
    return messagesByGroup[groupId] ?? [];
  }

  function addMessage(groupId: string, text: string) {
    // TODO: trocar por chamada real em services/api.ts (+ canal
    // realtime) assim que existir
    const newMessage: LobbyChatMessage = {
      id: Date.now().toString(),
      senderId: CURRENT_USER_ID,
      senderName: CURRENT_USER_NAME,
      senderAvatarUrl: CURRENT_USER_AVATAR,
      text,
      createdAt: Date.now(),
    };

    setMessagesByGroup((prev) => ({
      ...prev,
      [groupId]: [...(prev[groupId] ?? []), newMessage],
    }));
  }

  return (
    <GroupChatContext.Provider value={{ getMessages, addMessage }}>
      {children}
    </GroupChatContext.Provider>
  );
}

export function useGroupChat() {
  const context = useContext(GroupChatContext);
  if (!context) {
    throw new Error('useGroupChat precisa estar dentro de um GroupChatProvider');
  }
  return context;
}
