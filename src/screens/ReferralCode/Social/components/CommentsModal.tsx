import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../../contexts/AuthContext';
import { authApi, ApiError } from '../../../services/api';
import { Comment } from '../../../types/comment';
import { styles } from './CommentsModal.styles';

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  onCommentAdded?: () => void;
}

export default function CommentsModal({ visible, onClose, postId, onCommentAdded }: CommentsModalProps) {
  const { authFetch, userId } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    authApi
      .listComments(authFetch, postId)
      .then(setComments)
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : 'Não foi possível carregar os comentários.';
        Alert.alert('Ops', message);
      })
      .finally(() => setLoading(false));
  }, [visible, postId, authFetch]);

  const topLevel = comments.filter((c) => !c.parentCommentId);

  function repliesTo(commentId: string) {
    return comments.filter((c) => c.parentCommentId === commentId);
  }

  async function handleSend() {
    if (text.trim().length === 0 || sending) return;
    setSending(true);
    try {
      const comment = await authApi.addComment(authFetch, postId, text.trim(), replyingTo?.id);
      setComments((prev) => [...prev, comment]);
      onCommentAdded?.();
      setText('');
      setReplyingTo(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível enviar o comentário.';
      Alert.alert('Ops', message);
    } finally {
      setSending(false);
    }
  }

  function handleReport(_comment: Comment) {
    Alert.alert(
      'Denunciar comentário',
      'Nossa equipe vai revisar esse comentário. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Denunciar',
          style: 'destructive',
          // TODO: endpoint de denúncia ainda não existe no backend —
          // moderação de conteúdo fica pra uma rodada futura.
          onPress: () => {},
        },
      ]
    );
  }

  function handleDelete(comment: Comment) {
    Alert.alert('Apagar comentário', 'Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          try {
            await authApi.deleteComment(authFetch, postId, comment.id);
            // apaga o comentário e qualquer resposta direta a ele — o
            // backend já faz isso em cascata, só espelha aqui na tela
            setComments((prev) =>
              prev.filter((c) => c.id !== comment.id && c.parentCommentId !== comment.id)
            );
          } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Não foi possível apagar o comentário.';
            Alert.alert('Ops', message);
          }
        },
      },
    ]);
  }

  function renderComment(comment: Comment, isReply = false) {
    const isOwn = comment.userId === userId;

    return (
      <View key={comment.id}>
        <View style={[styles.commentRow, isReply && styles.replyRow]}>
          <Image source={{ uri: comment.userAvatarUrl }} style={styles.commentAvatar} />

          <View style={{ flex: 1 }}>
            <Text style={styles.commentName}>{comment.userName}</Text>
            <Text style={styles.commentText}>{comment.text}</Text>

            <View style={styles.commentActionsRow}>
              <Text style={styles.commentTime}>{comment.createdAtLabel}</Text>

              <TouchableOpacity onPress={() => setReplyingTo(comment)}>
                <Text style={styles.commentActionText}>Responder</Text>
              </TouchableOpacity>

              {isOwn ? (
                <TouchableOpacity onPress={() => handleDelete(comment)}>
                  <Text style={styles.commentActionTextDanger}>Apagar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleReport(comment)}>
                  <Text style={styles.commentActionText}>Denunciar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {repliesTo(comment.id).map((reply) => renderComment(reply, true))}
      </View>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Comentários</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color="#111" />
            </View>
          ) : topLevel.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-outline" size={26} color="#999" />
              <Text style={styles.emptyText}>Seja o primeiro a comentar</Text>
            </View>
          ) : (
            <FlatList
              data={topLevel}
              keyExtractor={(item) => item.id}
              style={styles.list}
              renderItem={({ item }) => renderComment(item)}
            />
          )}

          {replyingTo && (
            <View style={styles.replyingBar}>
              <Text style={styles.replyingText}>Respondendo a {replyingTo.userName}</Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Ionicons name="close-circle" size={16} color="#999" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Adicionar um comentário..."
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, (text.trim().length === 0 || sending) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={text.trim().length === 0 || sending}
            >
              <Ionicons name="arrow-up" size={16} color="#061414" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
