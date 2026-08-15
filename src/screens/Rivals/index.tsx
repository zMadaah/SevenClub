import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import RivalCard from '../../components/RivalCard';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError, RivalEntryApi } from '../../services/api';
import { ActivityType } from '../../types/lobby';
import { colors } from '../../theme/colors';
import { styles } from './styles';

const YOUR_COLOR = '#BCFF00';

export default function Rivals() {
  const navigation = useNavigation();
  const { authFetch } = useAuth();
  const [activityType, setActivityType] = useState<ActivityType>('run');
  const [rivals, setRivals] = useState<RivalEntryApi[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRivals = useCallback(
    (type: ActivityType) => {
      setLoading(true);
      authApi
        .getRivals(authFetch, type)
        .then(setRivals)
        .catch((err) => {
          const message = err instanceof ApiError ? err.message : 'Não foi possível carregar os rivais.';
          Alert.alert('Ops', message);
        })
        .finally(() => setLoading(false));
    },
    [authFetch]
  );

  useEffect(() => {
    loadRivals(activityType);
  }, [activityType, loadRivals]);

  function toggleActivityType() {
    setActivityType((prev) => (prev === 'run' ? 'ride' : 'run'));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>RIVAIS</Text>

        <TouchableOpacity style={styles.activityPill} onPress={toggleActivityType}>
          <MaterialCommunityIcons
            name={activityType === 'ride' ? 'bike' : 'run'}
            size={14}
            color={colors.textPrimary}
          />
          <Text style={styles.activityPillText}>
            {activityType === 'ride' ? 'Pedal' : 'Corrida'}
          </Text>
          <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.textPrimary} />
        </View>
      ) : rivals.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="sword-cross" size={28} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Ainda não é rival de ninguém</Text>
          <Text style={styles.emptyText}>
            Assim que você roubar território de alguém, ou alguém roubar o seu, essa disputa aparece aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={rivals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <RivalCard rival={item} yourColor={YOUR_COLOR} />}
        />
      )}
    </View>
  );
}
