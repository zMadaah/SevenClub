import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../navigation/types';
import {
  MOCK_CREW_LEADERBOARD,
  MOCK_MY_CREW_RANK,
} from '../../services/mock/leaderboard';
import { LeaderboardEntry, MyRankEntry, Scope } from '../../types/leaderboard';
import { ActivityType } from '../../types/lobby';
import { useActiveCrew } from '../../contexts/ActiveCrewContext';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './styles';

import PodiumSpot from './components/PodiumSpot';
import LeaderboardRow from './components/LeaderboardRow';
import MyRankRow from './components/MyRankRow';

const FALLBACK_CREW_PICTURE =
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=200';

export default function Leaderboard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { activeCrew } = useActiveCrew();
  const { authFetch } = useAuth();
  const [activityType, setActivityType] = useState<ActivityType>('run');
  const [scope, setScope] = useState<Scope>('country');

  // Crew ainda não existe de verdade no backend — continua mockado até
  // esse subsistema ser construído (tem chat, entrada/saída de membros
  // etc., é uma frente própria).
  const crewList = MOCK_CREW_LEADERBOARD[activityType];

  const [remoteEntries, setRemoteEntries] = useState<LeaderboardEntry[]>([]);
  const [remoteMyRank, setRemoteMyRank] = useState<MyRankEntry | null>(null);
  const [loading, setLoading] = useState(false);

  const loadLeaderboard = useCallback(
    async (currentScope: Scope, type: ActivityType) => {
      if (currentScope === 'crew') return;
      setLoading(true);
      try {
        const result = await authApi.getLeaderboard(authFetch, currentScope, type);
        setRemoteEntries(result.entries);
        setRemoteMyRank(result.myRank);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Não foi possível carregar o ranking.';
        Alert.alert('Ops', message);
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  useEffect(() => {
    loadLeaderboard(scope, activityType);
  }, [scope, activityType, loadLeaderboard]);

  const visibleList = useMemo(() => {
    if (scope === 'crew') return crewList;
    return remoteEntries;
  }, [scope, crewList, remoteEntries]);

  const topThree = visibleList.slice(0, 3);
  const rest = visibleList.slice(3);
  const maxValue = topThree[0]?.territoryKm2 ?? 1;

  // "Seu crew" usa nome/foto do crew real (ActiveCrewContext) — só o
  // número de posição é mock. Se o usuário não estiver em nenhum crew,
  // não existe rank pra mostrar (vira um convite pra criar/entrar).
  const myCrewRank: MyRankEntry | null = useMemo(() => {
    if (!activeCrew) return null;
    return {
      rank: MOCK_MY_CREW_RANK[activityType],
      name: activeCrew.name,
      avatarUrl: activeCrew.pictureUri ?? FALLBACK_CREW_PICTURE,
      countryFlag: '🇧🇷',
      territoryKm2: 0,
    };
  }, [activeCrew, activityType]);

  let myRank: MyRankEntry | null = null;
  if (scope === 'crew') {
    myRank = myCrewRank;
  } else {
    myRank = remoteMyRank;
  }

  function toggleActivityType() {
    setActivityType((prev) => (prev === 'run' ? 'ride' : 'run'));
  }

  const SCOPE_TABS: { value: Scope; label: string }[] = [
    { value: 'area', label: 'Área' },
    { value: 'country', label: 'País' },
    { value: 'crew', label: 'Crew' },
    { value: 'friends', label: 'Amigos' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Ranking</Text>

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

      <View style={styles.scopeRow}>
        {SCOPE_TABS.map((tab) => {
          const active = tab.value === scope;
          return (
            <TouchableOpacity
              key={tab.value}
              style={[styles.scopePill, active && styles.scopePillActive]}
              onPress={() => setScope(tab.value)}
            >
              <Text style={[styles.scopeText, active && styles.scopeTextActive]} numberOfLines={1}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.textPrimary} />
        </View>
      ) : scope === 'friends' && visibleList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={28} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Você ainda não segue ninguém</Text>
          <Text style={styles.emptyText}>
            Siga corredores para ver o ranking entre vocês aqui.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddFriend')}
          >
            <Text style={styles.emptyButtonText}>ADICIONAR AMIGOS</Text>
          </TouchableOpacity>
        </View>
      ) : (scope === 'country' || scope === 'area') && visibleList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="location-outline" size={28} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Ninguém por aqui ainda</Text>
          <Text style={styles.emptyText}>
            {scope === 'country'
              ? 'Complete seu país no perfil para entrar nesse ranking.'
              : 'Complete sua localização no perfil para entrar nesse ranking.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        >
          {topThree.length === 3 && (
            <View style={styles.podiumRow}>
              <PodiumSpot entry={topThree[1]} place={2} maxValue={maxValue} />
              <PodiumSpot entry={topThree[0]} place={1} maxValue={maxValue} />
              <PodiumSpot entry={topThree[2]} place={3} maxValue={maxValue} />
            </View>
          )}

          <View style={styles.listCard}>
            {topThree.map((entry) => (
              <LeaderboardRow key={entry.id} entry={entry} />
            ))}

            {rest.length > 0 && (
              <View style={styles.blurWrapper}>
                <View pointerEvents="none">
                  {rest.map((entry) => (
                    <LeaderboardRow key={entry.id} entry={entry} />
                  ))}
                </View>

                {/* Camada sólida — não depende de nenhum módulo nativo, sempre funciona */}
                <View style={styles.blurScrim} pointerEvents="none" />

                <View style={styles.blurLabel} pointerEvents="none">
                  <Ionicons name="lock-closed" size={18} color={colors.textPrimary} />
                  <Text style={styles.blurText}>Assine o Pro para ver o ranking completo</Text>
                </View>
              </View>
            )}
          </View>

           {myRank && <MyRankRow myRank={myRank} />}
        </ScrollView>
      )}
    </View>
  );
}