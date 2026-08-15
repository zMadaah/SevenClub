import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
import { styles } from './styles';

interface SupportMessage {
  id: string;
  ticketId: string;
  sender: 'user' | 'admin';
  text: string;
  createdAt: string;
}

const WELCOME_MESSAGE: SupportMessage = {
  id: 'welcome',
  ticketId: '',
  sender: 'admin',
  text:
    'Oi! Conta pra gente o que está acontecendo — quanto mais detalhes (o que você estava fazendo, o que esperava que acontecesse), mais rápido conseguimos ajudar.',
  createdAt: new Date().toISOString(),
};

export default function SupportChat() {
  const navigation = useNavigation();
  const { authFetch } = useAuth();
  const listRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<SupportMessage[]>([WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    authApi
      .listSupportMessages(authFetch)
      .then((existing) => {
        if (existing.length > 0) setMessages([WELCOME_MESSAGE, ...existing]);
      })
      .catch(() => {
        // sem ticket ainda é normal (primeira vez que a pessoa abre o chat)
      })
      .finally(() => setLoading(false));
  }, [authFetch]);

  async function handleSend() {
    const text = input.trim();
    if (text.length === 0 || sending) return;

    setInput('');
    setSending(true);
    try {
      const sent = await authApi.sendSupportMessage(authFetch, text);
      setMessages((prev) => [...prev, sent]);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível enviar sua mensagem.';
      Alert.alert('Ops', message);
      setInput(text); // devolve o texto pro campo pra não perder o que a pessoa escreveu
    } finally {
      setSending(false);
    }
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

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#111" />
        </View>
      ) : (
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
      )}

      {sending && (
        <View style={styles.typingRow}>
          <Text style={styles.typingText}>Enviando...</Text>
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
          disabled={input.trim().length === 0 || sending}
        >
          <Ionicons name="arrow-up" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
