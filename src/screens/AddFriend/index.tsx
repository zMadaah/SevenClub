import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import FollowSuggestionCard from './components/FollowSuggestionsCard';
import { MOCK_FOLLOW_SUGGESTIONS } from '../../services/mock/followSuggestions';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError, UserSearchResult } from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './styles';

const SEARCH_DEBOUNCE_MS = 350;

export default function AddFriend() {
  const navigation = useNavigation();
  const { authFetch } = useAuth();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  // Sugestões ("Não sabe quem seguir?") continuam mockadas de propósito —
  // pra virar real, precisa de um critério de recomendação (amigos em
  // comum, mesma região, etc.) que ainda não decidimos. O toggle aqui é
  // só visual, não chama a API.
  const [mockFollowedIds, setMockFollowedIds] = useState<string[]>([]);

  const isSearching = query.trim().length > 0;

  useEffect(() => {
    if (!isSearching) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      setSearching(true);
      authApi
        .searchUsers(authFetch, query.trim())
        .then(setSearchResults)
        .catch((err) => {
          const message = err instanceof ApiError ? err.message : 'Não foi possível buscar.';
          Alert.alert('Ops', message);
        })
        .finally(() => setSearching(false));
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query, isSearching, authFetch]);

  async function handleToggleFollow(user: UserSearchResult) {
    const wasFollowing = user.isFollowing;
    // atualização otimista na lista de resultados
    setSearchResults((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isFollowing: !wasFollowing } : u))
    );

    try {
      if (wasFollowing) {
        await authApi.unfollowUser(authFetch, user.id);
      } else {
        await authApi.followUser(authFetch, user.id);
      }
    } catch (err) {
      setSearchResults((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isFollowing: wasFollowing } : u))
      );
      const message = err instanceof ApiError ? err.message : 'Não foi possível atualizar.';
      Alert.alert('Ops', message);
    }
  }

  function toggleMockFollow(id: string) {
    setMockFollowedIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
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
        <Text style={styles.headerTitle}>ADICIONAR{'\n'}AMIGOS</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Digite o nome de usuário para buscar"
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={setQuery}
      />

      {isSearching ? (
        searching ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color={colors.textPrimary} />
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={26} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum resultado para "{query}"</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resultsList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <View style={styles.resultRow}>
                <Image source={{ uri: item.avatarUrl }} style={styles.resultAvatar} />
                <Text style={styles.resultName}>{item.name}</Text>

                <TouchableOpacity
                  style={[styles.followButtonSmall, item.isFollowing && styles.followingButtonSmall]}
                  onPress={() => handleToggleFollow(item)}
                >
                  <Text
                    style={[
                      styles.followButtonSmallText,
                      item.isFollowing && styles.followingButtonSmallText,
                    ]}
                  >
                    {item.isFollowing ? 'SEGUINDO' : 'SEGUIR'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )
      ) : (
        <View style={styles.suggestionsSection}>
          <Text style={styles.suggestionsTitle}>Não sabe quem seguir?</Text>
          <Text style={styles.suggestionsSubtitle}>Siga alguns perfis para começar</Text>

          <View style={styles.suggestionsRow}>
            {MOCK_FOLLOW_SUGGESTIONS.map((person) => (
              <FollowSuggestionCard
                key={person.id}
                person={person}
                following={mockFollowedIds.includes(person.id)}
                onToggleFollow={() => toggleMockFollow(person.id)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
