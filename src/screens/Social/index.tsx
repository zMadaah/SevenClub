import React , { useMemo, useState }from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import PostCard from './components/PostCard';
import FilterModal from './components/FilterModal';
import { MOCK_FEED } from '../../services/mock/feed';
import { styles } from './styles';
import { FeedPost } from '../../types/post';

type ExploreScope = 'explore' | 'groups' | 'following';
type ActivityFilter = 'all' | 'run' | 'ride';

const EXPLORE_OPTIONS = [
  { value: 'explore', label: 'Explorar' },
  { value: 'groups', label: 'Grupos' },
  { value: 'following', label: 'Seguindo' },
];

const ACTIVITY_OPTIONS = [
  { value: 'all', label: 'Todas atividades' },
  { value: 'run', label: 'Corrida/caminhada' },
  { value: 'ride', label: 'Ciclismo' },
];

export default function Social() {
  const [exploreScope, setExploreScope] = useState<ExploreScope>('explore');
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');
  const [exploreModalVisible, setExploreModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);

  const explorePillLabel =
    EXPLORE_OPTIONS.find((o) => o.value === exploreScope)?.label ?? 'Explorar';

  const activityPillLabel =
    activityFilter === 'all'
      ? 'Todos'
      : ACTIVITY_OPTIONS.find((o) => o.value === activityFilter)?.label ?? 'Todos';

  const filteredFeed = useMemo(() => {
    return MOCK_FEED.filter((post) => {
      if (exploreScope === 'groups' && !post.isGroup) return false;
      if (exploreScope === 'following' && !post.isFollowing) return false;
      if (activityFilter !== 'all' && post.activityType !== activityFilter) return false;
      return true;
    });
  }, [exploreScope, activityFilter]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={{ uri: 'https://i.pravatar.cc/200?img=10' }} style={styles.avatar} />

        <View style={styles.filters}>
          <TouchableOpacity style={styles.filterPill} onPress={() => setExploreModalVisible(true)}>
            <Text style={styles.filterText}>{explorePillLabel}</Text>
            <Ionicons name="chevron-down" size={14} color="#111" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterPill} onPress={() => setActivityModalVisible(true)}>
            <Text style={styles.filterText}>{activityPillLabel}</Text>
            <Ionicons name="chevron-down" size={14} color="#111" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search" size={20} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      {filteredFeed.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={28} color="#999" />
          <Text style={styles.emptyText}>Nenhuma atividade com esse filtro ainda</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFeed}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item }) => <PostCard post={item} />}
        />
      )}

      <FilterModal
        visible={exploreModalVisible}
        onClose={() => setExploreModalVisible(false)}
        title="Ver atividades de"
        options={EXPLORE_OPTIONS}
        selected={exploreScope}
        onSelect={(value) => setExploreScope(value as ExploreScope)}
      />

      <FilterModal
        visible={activityModalVisible}
        onClose={() => setActivityModalVisible(false)}
        title="Tipo de atividade"
        options={ACTIVITY_OPTIONS}
        selected={activityFilter}
        onSelect={(value) => setActivityFilter(value as ActivityFilter)}
      />
    </View>
  );
}

