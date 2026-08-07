import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useComments } from '../../../contexts/CommentsContext';
import { CURRENT_USER_ID } from '../../../constants/currentUser';
import { Comment } from '../../../types/comment';
import { styles } from './CommentsModal.styles';

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
}

export default function CommentsModal({ visible, onClose, postId }: CommentsModalProps) {
  const { getComments, addComment, deleteComment } = useComments();
  const [text, setText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

  const allComments = getComments(postId);
  const topLevel = allComments.filter((c) => !c.parentCommentId);

  function repliesTo(commentId: string) {
    return allComments.filter((c) => c.parentCommentId === commentId);
  }

  function handleSend() {
    if (text.trim().length === 0) return;
    // TODO: trocar por chamada real em services/api.ts assim que existir —
    // hoje addComment só grava em memória, via CommentsContext
    addComment(postId, text.trim(), replyingTo?.id);
    setText('');
    setReplyingTo(null);
  }

  function handleReport(comment: Comment) {
    Alert.alert(
      'Denunciar comentário',
      'Nossa equipe vai revisar esse comentário. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Denunciar',
          style: 'destructive',
          onPress: () => {
            // TODO: enviar denúncia real em services/api.ts assim que existir
          },
        },
      ]
    );
  }

  function handleDelete(comment: Comment) {
    Alert.alert('Apagar comentário', 'Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: () => deleteComment(comment.id) },
    ]);
  }

  function renderComment(comment: Comment, isReply = false) {
    const isOwn = comment.userId === CURRENT_USER_ID;

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

          {topLevel.length === 0 ? (
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
              style={[styles.sendButton, text.trim().length === 0 && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={text.trim().length === 0}
            >
              <Ionicons name="arrow-up" size={16} color="#061414" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
