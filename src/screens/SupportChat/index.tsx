import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ChatMessage } from '../../types/chat';
import { styles } from './styles';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'initial',
  text:
    'Oi! Conta pra gente o que está acontecendo — quanto mais detalhes (o que você estava fazendo, o que esperava que acontecesse), mais rápido conseguimos ajudar.',
  sender: 'support',
  createdAt: Date.now(),
};

export default function SupportChat() {
  const navigation = useNavigation();
  const listRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  function handleSend() {
    const text = input.trim();
    if (text.length === 0 || sending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);

    // TODO: trocar por chamada real em services/api.ts — abrir ticket de
    // verdade e notificar a equipe, em vez dessa resposta automática mockada
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Recebemos seu relato! Nossa equipe vai analisar e te responder por aqui em breve.',
        sender: 'support',
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, autoReply]);
      setSending(false);
    }, 900);
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
        <Text style={styles.headerTitle}>Suporte</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.sender === 'user' ? styles.bubbleUser : styles.bubbleSupport,
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                item.sender === 'user' ? styles.bubbleTextUser : styles.bubbleTextSupport,
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      {sending && (
        <View style={styles.typingRow}>
          <Text style={styles.typingText}>Equipe de suporte está digitando...</Text>
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Descreva o problema..."
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