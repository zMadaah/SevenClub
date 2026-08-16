import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ActivityCard from './components/ActivityCard';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
import { ActivitySummary } from '../../types/activity';
import { ActivityType } from '../../types/lobby';
import { colors } from '../../theme/colors';
import { styles } from './styles';

type FilterKey = 'all' | ActivityType;

export default function ViewActivities() {
  const navigation = useNavigation();
  const { authFetch } = useAuth();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [activities, setActivities] = useState<ActivitySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .listActivities(authFetch)
      .then(setActivities)
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : 'Não foi possível carregar suas atividades.';
        Alert.alert('Ops', message);
      })
      .finally(() => setLoading(false));
  }, [authFetch]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return activities;
    return activities.filter((item) => item.activityType === filter);
  }, [activities, filter]);

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
        </View>
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.textPrimary} />
        </View>
      ) : filteredItems.length === 0 ? (
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
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => <ActivityCard item={item} />}
        />
      )}
    </View>
  );
}
