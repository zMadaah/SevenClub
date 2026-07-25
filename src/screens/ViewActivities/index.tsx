import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ActivityCard from './components/ActivityCard';
import { MOCK_ACTIVITY_FEED } from '../../services/mock/activityFeed';
import { ActivityType } from '../../types/lobby';
import { colors } from '../../theme/colors';
import { styles } from './styles';

type FilterKey = 'all' | ActivityType;

export default function ViewActivities() {
  const navigation = useNavigation();
  const [filter, setFilter] = useState<FilterKey>('all');

  const filteredItems = useMemo(() => {
    if (filter === 'all') return MOCK_ACTIVITY_FEED;
    return MOCK_ACTIVITY_FEED.filter((item) => item.activityType === filter);
  }, [filter]);

  function cycleFilter() {
    setFilter((prev) => (prev === 'all' ? 'run' : prev === 'run' ? 'ride' : 'all'));
  }

  const filterLabel = filter === 'all' ? 'Todos' : filter === 'run' ? 'Corrida' : 'Pedal';
  const filterIcon = filter === 'run' ? 'run' : filter === 'ride' ? 'bike' : 'apps';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.filterPill} onPress={cycleFilter}>
            {filter === 'all' ? (
              <Ionicons name="apps-outline" size={14} color={colors.textPrimary} />
            ) : (
              <MaterialCommunityIcons name={filterIcon as any} size={14} color={colors.textPrimary} />
            )}
            <Text style={styles.filterPillText}>{filterLabel}</Text>
            <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="map-outline" size={28} color={colors.textMuted} />
          <Text style={styles.emptyText}>Nenhuma atividade registrada ainda</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item }) => <ActivityCard item={item} />}
        />
      )}
    </View>
  );
}