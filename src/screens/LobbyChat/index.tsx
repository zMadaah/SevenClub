import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useActiveLobby } from '../../contexts/ActiveLobbyContext';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError, LobbyChatMessageApi } from '../../services/api';
import { styles } from './styles';

// Não é WebSocket — buscar de novo a cada poucos segundos já dá a
// sensação de "chegou na hora" sem precisar de infraestrutura de tempo
// real. Mesmo padrão usado no chat de suporte.
const POLL_INTERVAL_MS = 3000;

export default function LobbyChat() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const { activeLobby } = useActiveLobby();
  const { authFetch, userId } = useAuth();

  const [messages, setMessages] = useState<LobbyChatMessageApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(() => {
    if (!activeLobby) return Promise.resolve();
    return authApi
      .getLobbyMessages(authFetch, activeLobby.id)
      .then(setMessages)
      .catch(() => {
        // poll silencioso — não interrompe a conversa por uma falha passageira
      });
  }, [authFetch, activeLobby]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchMessages().finally(() => setLoading(false));
    }, [fetchMessages])
  );

  useEffect(() => {
    const interval = setInterval(fetchMessages, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  async function handleSend() {
    const text = input.trim();
    if (text.length === 0 || !activeLobby || sending) return;

    setSending(true);
    setInput('');
    try {
      const sent = await authApi.sendLobbyMessage(authFetch, activeLobby.id, text);
      setMessages((prev) => [...prev, sent]);
    } catch (err) {
      setInput(text);
      const message = err instanceof ApiError ? err.message : 'Não foi possível enviar.';
      Alert.alert('Ops', message);
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back"
              size={22}
              color="#111"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {activeLobby?.name ?? 'Chat do lobby'}
          </Text>

          <View style={{ width: 22 }} />
        </View>

        {!loading && messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="chatbubbles-outline"
              size={28}
              color="#999"
            />

            <Text style={styles.emptyText}>
              Nenhuma mensagem ainda — comece a conversa
            </Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({
                animated: true,
              })
            }
            renderItem={({ item }) => {
              const isOwn = item.senderId === userId;

              return (
                <View
                  style={[
                    styles.messageRow,
                    isOwn && styles.messageRowOwn,
                  ]}
                >
                  {!isOwn && (
                    <Image
                      source={{
                        uri: item.senderAvatarUrl,
                      }}
                      style={styles.avatar}
                    />
                  )}

                  <View style={styles.messageContent}>
                    {!isOwn && (
                      <Text style={styles.senderName}>
                        {item.senderName}
                      </Text>
                    )}

                    <View
                      style={[
                        styles.bubble,
                        isOwn
                          ? styles.bubbleOwn
                          : styles.bubbleOther,
                      ]}
                    >
                      <Text
                        style={[
                          styles.bubbleText,
                          isOwn
                            ? styles.bubbleTextOwn
                            : styles.bubbleTextOther,
                        ]}
                      >
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
            textAlignVertical="center"
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (input.trim().length === 0 || sending) &&
              styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={
              input.trim().length === 0 || sending
            }
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
