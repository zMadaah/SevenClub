import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


import FollowSuggestionCard from './components/FollowSuggestionsCard';
import { MOCK_FOLLOW_SUGGESTIONS } from '../../services/mock/followSuggestions';
import { MOCK_FRIENDS } from '../../services/mock/friends';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function AddFriend() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  const searchResults = useMemo(() => {
    if (query.trim().length === 0) return [];
    return MOCK_FRIENDS.filter((friend) =>
      friend.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [query]);

  function toggleFollow(id: string) {
    setFollowedIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  const isSearching = query.trim().length > 0;

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
        searchResults.length === 0 ? (
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
            renderItem={({ item }) => {
              const isFollowing = followedIds.includes(item.id);
              return (
                <View style={styles.resultRow}>
                  <Image source={{ uri: item.avatarUrl }} style={styles.resultAvatar} />
                  <Text style={styles.resultName}>{item.name}</Text>

                  <TouchableOpacity
                    style={[styles.followButtonSmall, isFollowing && styles.followingButtonSmall]}
                    onPress={() => toggleFollow(item.id)}
                  >
                    <Text
                      style={[
                        styles.followButtonSmallText,
                        isFollowing && styles.followingButtonSmallText,
                      ]}
                    >
                      {isFollowing ? 'SEGUINDO' : 'SEGUIR'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
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
                following={followedIds.includes(person.id)}
                onToggleFollow={() => toggleFollow(person.id)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}