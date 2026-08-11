import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useActiveCrew } from '../../contexts/ActiveCrewContext';
import { useGroupChat } from '../../contexts/GroupChatContext';
import { CURRENT_USER_ID } from '../../constants/currentUser';
import { styles } from './styles';

export default function CrewChat() {
  const navigation = useNavigation();
  const listRef = useRef<FlatList>(null);
  const { activeCrew } = useActiveCrew();
  const { getMessages, addMessage } = useGroupChat();

  const messages = activeCrew ? getMessages(activeCrew.id) : [];
  const [input, setInput] = useState('');

  function handleSend() {
    const text = input.trim();
    if (text.length === 0 || !activeCrew) return;

    addMessage(activeCrew.id, text);
    setInput('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{activeCrew?.name ?? 'Chat do crew'}</Text>
        <View style={{ width: 22 }} />
      </View>

      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={28} color="#999" />
          <Text style={styles.emptyText}>Nenhuma mensagem ainda — comece a conversa</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isOwn = item.senderId === CURRENT_USER_ID;
            return (
              <View style={[styles.messageRow, isOwn && styles.messageRowOwn]}>
                {!isOwn && <Image source={{ uri: item.senderAvatarUrl }} style={styles.avatar} />}

                <View style={{ maxWidth: '75%' }}>
                  {!isOwn && <Text style={styles.senderName}>{item.senderName}</Text>}
                  <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
                    <Text style={[styles.bubbleText, isOwn ? styles.bubbleTextOwn : styles.bubbleTextOther]}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Escreva uma mensagem..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          multiline
        />

        <TouchableOpacity
          style={[styles.sendButton, input.trim().length === 0 && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={input.trim().length === 0}
        >
          <Ionicons name="arrow-up" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
