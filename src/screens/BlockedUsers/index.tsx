import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { MOCK_BLOCKED_USERS } from '../../services/mock/blockedUsers';
import { BlockedUser } from '../../types/privacySettings';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function BlockedUsers() {
  const navigation = useNavigation();
  const [blocked, setBlocked] = useState<BlockedUser[]>(MOCK_BLOCKED_USERS);

  function handleUnblock(id: string) {
    // TODO: trocar por chamada real em services/api.ts assim que existir
    setBlocked((prev) => prev.filter((user) => user.id !== id));
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

      {blocked.length === 0 ? (
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
