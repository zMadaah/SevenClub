import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { ActivityType } from '../../types/lobby';
import { ActivityStats } from '../../types/stats';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './styles';

const EMPTY_STATS: ActivityStats = {
  currentTerritoryM2: 0,
  globalRank: null,
  totalSteals: 0,
  countryRank: null,
};

export default function MyStats() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { authFetch } = useAuth();
  const [activityType, setActivityType] = useState<ActivityType>('run');
  const [stats, setStats] = useState<ActivityStats>(EMPTY_STATS);
  const [activitiesCount, setActivitiesCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // Total de atividades não depende do toggle corrida/pedal (fica acima
  // dele na tela), então busca uma vez só, à parte.
  useEffect(() => {
    authApi
      .listActivities(authFetch)
      .then((activities) => setActivitiesCount(activities.length))
      .catch(() => {
        // não é grave o bastante pra interromper a tela com um alerta —
        // o contador só fica em 0 se isso falhar
      });
  }, [authFetch]);

  const loadStats = useCallback(
    async (type: ActivityType) => {
      setLoadingStats(true);
      try {
        const result = await authApi.myStats(authFetch, type);
        setStats(result);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Não foi possível carregar suas estatísticas.';
        Alert.alert('Ops', message);
      } finally {
        setLoadingStats(false);
      }
    },
    [authFetch]
  );

  useEffect(() => {
    loadStats(activityType);
  }, [activityType, loadStats]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={colors.ceilingWhite} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Image
          source={{ uri: 'https://i.pravatar.cc/200?img=10' }}
          style={styles.avatar}
        />

        <Text style={styles.name}>João Cruz</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Seguindo</Text>
            <Text style={styles.summaryValue}>0</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Seguidores</Text>
            <Text style={styles.summaryValue}>0</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Atividades</Text>
            <Text style={styles.summaryValue}>{activitiesCount}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.sheet} showsVerticalScrollIndicator={false}>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.togglePill, activityType === 'run' && styles.togglePillActive]}
            onPress={() => setActivityType('run')}
          >
            <MaterialCommunityIcons
              name="run"
              size={16}
              color={activityType === 'run' ? colors.richBlack : colors.textSecondary}
            />
            <Text
              style={[styles.toggleText, activityType === 'run' && styles.toggleTextActive]}
            >
              Corrida
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.togglePill, activityType === 'ride' && styles.togglePillActive]}
            onPress={() => setActivityType('ride')}
          >
            <MaterialCommunityIcons
              name="bike"
              size={16}
              color={activityType === 'ride' ? colors.richBlack : colors.textSecondary}
            />
            <Text
              style={[styles.toggleText, activityType === 'ride' && styles.toggleTextActive]}
            >
              Pedal
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          {loadingStats ? (
            <View style={styles.statsLoading}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : (
            <>
              <View style={styles.statsRow}>
                <View style={styles.statBlock}>
                  <View style={styles.statLabelRow}>
                    <Ionicons name="flag" size={14} color={colors.accent} />
                    <Text style={styles.statLabel}>território atual</Text>
                  </View>
                  <Text style={styles.statValue}>
                    {stats.currentTerritoryM2.toFixed(1)}{' '}
                    <Text style={styles.statUnit}>m²</Text>
                  </Text>
                </View>

                <View style={styles.statBlockRight}>
                  <Text style={styles.statLabel}>global</Text>
                  <Text style={styles.statValueSmall}>{stats.globalRank ?? 'N/D'}</Text>
                </View>
              </View>

              <View style={styles.statsDivider} />

              <View style={styles.statsRow}>
                <View style={styles.statBlock}>
                  <Text style={styles.statLabel}>total de roubos</Text>
                  <Text style={styles.statValue}>{stats.totalSteals}</Text>
                </View>

                <View style={styles.statBlockRight}>
                  <Text style={styles.statLabel}>país</Text>
                  <Text style={styles.statValueSmall}>{stats.countryRank ?? 'N/D'}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ViewActivities')}>
            <View style={styles.menuLeft}>
              <Ionicons name="list-outline" size={22} color={colors.textPrimary} />
              <Text style={styles.menuText}>Ver atividades</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ViewHistory')}>
            <View style={styles.menuLeft}>
              <Ionicons name="time-outline" size={22} color={colors.textPrimary} />
              <Text style={styles.menuText}>Ver histórico</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ViewTerritories')}>
            <View style={styles.menuLeft}>
              <Ionicons name="location-outline" size={22} color={colors.textPrimary} />
              <Text style={styles.menuText}>Ver territórios</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}