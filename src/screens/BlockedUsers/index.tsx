import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './styles';

interface BlockedUser {
  id: string;
  name: string;
  avatarUrl: string;
}

export default function BlockedUsers() {
  const navigation = useNavigation();
  const { authFetch } = useAuth();
  const [blocked, setBlocked] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .listBlockedUsers(authFetch)
      .then(setBlocked)
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : 'Não foi possível carregar a lista.';
        Alert.alert('Ops', message);
      })
      .finally(() => setLoading(false));
  }, [authFetch]);

  async function handleUnblock(id: string) {
    const previous = blocked;
    setBlocked((prev) => prev.filter((user) => user.id !== id));
    try {
      await authApi.unblockUser(authFetch, id);
    } catch (err) {
      setBlocked(previous);
      const message = err instanceof ApiError ? err.message : 'Não foi possível desbloquear.';
      Alert.alert('Ops', message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>USUÁRIOS BLOQUEADOS</Text>
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.textPrimary} />
        </View>
      ) : blocked.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="person-remove-outline" size={28} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum usuário bloqueado</Text>
          <Text style={styles.emptyText}>
            Pessoas que você bloquear aparecem aqui, e podem ser desbloqueadas a qualquer momento.
          </Text>
        </View>
      ) : (
        <FlatList
          data={blocked}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
              <Text style={styles.name}>{item.name}</Text>

              <TouchableOpacity
                style={styles.unblockButton}
                onPress={() => handleUnblock(item.id)}
              >
                <Text style={styles.unblockButtonText}>DESBLOQUEAR</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
