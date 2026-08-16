import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './styles';

import RivalCard from '../../components/RivalCard';
import BadgeCard from './components/BadgeCard';
import BadgeDetailModal from './components/BadgeDetailModal';
import { BADGE_CATALOG } from '../../services/mock/badges';
import { BadgeWithStatus } from '../../types/badge';
import { useFeaturedBadge } from '../../contexts/FeaturedBadgeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  authApi,
  ApiError,
  ProgressSummary,
  BadgeStatus,
  ChallengeStatus,
  RivalEntryApi,
} from '../../services/api';
import { ActivityType } from '../../types/lobby';

const TABS = ['Progresso', 'Atividades'];
const YOUR_COLOR = '#BCFF00';

const CHALLENGE_META: Record<string, { title: string; icon: 'watch' | 'friend' | 'profile' }> = {
  c1: { title: 'Conectar relógio Garmin', icon: 'watch' },
  c2: { title: 'Seguir um amigo', icon: 'friend' },
  c3: { title: 'Adicionar foto de perfil', icon: 'profile' },
};

function formatUnlockedAt(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Progress() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState('Progresso');
  const [activityType, setActivityType] = useState<ActivityType>('run');
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithStatus | null>(null);
  const { featuredBadgeId, setFeaturedBadgeId } = useFeaturedBadge();

  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [badgeStatuses, setBadgeStatuses] = useState<BadgeStatus[]>([]);
  const [challengeStatuses, setChallengeStatuses] = useState<ChallengeStatus[]>([]);
  const [rivals, setRivals] = useState<RivalEntryApi[]>([]);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const loadAll = useCallback(
    async (type: ActivityType) => {
      try {
        const [summaryResult, badgesResult, challengesResult, rivalsResult] = await Promise.all([
          authApi.getProgressSummary(authFetch, type),
          authApi.getBadgeStatuses(authFetch),
          authApi.getChallengeStatuses(authFetch),
          authApi.getRivals(authFetch, type),
        ]);
        setSummary(summaryResult);
        setBadgeStatuses(badgesResult);
        setChallengeStatuses(challengesResult);
        setRivals(rivalsResult);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Não foi possível carregar seu progresso.';
        Alert.alert('Ops', message);
      }
    },
    [authFetch]
  );

  useEffect(() => {
    loadAll(activityType);
  }, [activityType, loadAll]);

  async function handleClaimChallenge(challengeId: string) {
    if (claimingId) return;
    setClaimingId(challengeId);
    try {
      await authApi.claimChallenge(authFetch, challengeId);
      // recarrega status + resumo (o XP resgatado pode ter subido de nível)
      const [challengesResult, summaryResult] = await Promise.all([
        authApi.getChallengeStatuses(authFetch),
        authApi.getProgressSummary(authFetch, activityType),
      ]);
      setChallengeStatuses(challengesResult);
      setSummary(summaryResult);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível resgatar esse desafio.';
      Alert.alert('Ops', message);
    } finally {
      setClaimingId(null);
    }
  }

  const level = summary?.level ?? 0;
  const exp = summary?.exp ?? 0;
  const expTarget = summary?.expTarget ?? 100;
  const territoryM2 = summary?.territoryM2 ?? 0;
  const territoryBestM2 = summary?.territoryBestM2 ?? 0;
  const rivalsCount = summary?.rivalsCount ?? 0;
  const rivalsBeating = summary?.rivalsBeating ?? 0;
  const expProgress = Math.min(exp / expTarget, 1) * 100;

  const badges: BadgeWithStatus[] = BADGE_CATALOG.map((badge) => {
    const status = badgeStatuses.find((s) => s.id === badge.id);
    return {
      ...badge,
      unlocked: status?.unlocked ?? false,
      unlockedAtLabel: status?.unlockedAt ? formatUnlockedAt(status.unlockedAt) : undefined,
    };
  });

  return (
    <View style={styles.container}>
      {/* Barra de abas + atividade */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: 'https://i.pravatar.cc/200?img=10' }} style={styles.avatar} />
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabPill, active && styles.tabPillActive]}
                onPress={() => {
                  if (tab === 'Atividades') {
                    navigation.navigate('ViewActivities');
                    return;
                  }
                  setActiveTab(tab);
                }}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.activityDropdown}
          onPress={() => setActivityType((prev) => (prev === 'run' ? 'ride' : 'run'))}
        >
          <Ionicons name={activityType === 'ride' ? 'bicycle' : 'walk'} size={14} color="#111" />
          <Text style={styles.activityDropdownText}>{activityType === 'ride' ? 'Pedal' : 'Corrida'}</Text>
          <Ionicons name="chevron-down" size={12} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card de nível */}
        <View style={styles.levelCard}>
          <View style={styles.levelCardTop}>
            <View>
              <Text style={styles.levelLabel}>NÍVEL</Text>
              <Text style={styles.levelValue}>{level}</Text>
            </View>

            <View style={styles.levelStatsRight}>
              <View style={styles.levelStatRow}>
                <MaterialCommunityIcons name="flag-variant-outline" size={16} color="#BCFF00" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.levelStatTitle}>Território</Text>
                  <Text style={styles.levelStatValue}>
                    {territoryM2.toFixed(0)}m²{' '}
                    <Text style={styles.levelStatSub}>MELHOR: {territoryBestM2.toFixed(0)}M²</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.levelStatRow}>
                <MaterialCommunityIcons name="sword-cross" size={16} color="#BCFF00" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.levelStatTitle}>Rivais</Text>
                  <Text style={styles.levelStatValue}>
                    {rivalsCount} <Text style={styles.levelStatSub}>VENCENDO: {rivalsBeating}</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.expBarTrack}>
            <View style={[styles.expBarFill, { width: `${expProgress}%` }]} />
            <Text style={styles.expBarText}>
              EXP {exp} / {expTarget}
            </Text>
          </View>
        </View>

        {/* Seção clara */}
        <View style={styles.whiteSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medal-outline" size={22} color="#111" />
            <Text style={styles.sectionTitle}>Desafios</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Ganhe experiência para subir de nível.</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.challengesRow}
          >
            {challengeStatuses.map((challenge) => {
              const meta = CHALLENGE_META[challenge.id];
              if (!meta) return null;
              return (
                <View key={challenge.id} style={styles.challengeCard}>
                  <View style={styles.claimBadge}>
                    <Text style={styles.claimBadgeText}>GANHE {challenge.xp}XP</Text>
                  </View>

                  <View style={styles.challengeIconCircle}>
                    <Ionicons
                      name={
                        meta.icon === 'watch'
                          ? 'watch-outline'
                          : meta.icon === 'friend'
                          ? 'person-add-outline'
                          : 'camera-outline'
                      }
                      size={24}
                      color="#fff"
                    />
                  </View>

                  <Text style={styles.challengeTitle}>{meta.title}</Text>

                  <TouchableOpacity
                    style={styles.claimButton}
                    onPress={() => handleClaimChallenge(challenge.id)}
                    disabled={challenge.claimed || !challenge.completed || claimingId === challenge.id}
                  >
                    <Text style={styles.claimButtonText}>
                      {challenge.claimed
                        ? 'RESGATADO'
                        : !challenge.completed
                        ? 'AINDA NÃO CONCLUÍDO'
                        : claimingId === challenge.id
                        ? 'RESGATANDO...'
                        : 'TOQUE PARA RESGATAR'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => navigation.navigate('Rivals')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="sword-cross" size={16} color="#061414" />
            <Text style={styles.sectionTitle}>TOP Rivais</Text>
            <View style={{ flex: 1 }} />
            {rivals.length > 0 && <Ionicons name="chevron-forward" size={18} color="#999" />}
          </TouchableOpacity>

          {rivals.length === 0 ? (
            <>
              <Text style={styles.sectionSubtitle}>
                Suas batalhas obrigatórias. Recupere território ou amplie sua vantagem.
              </Text>
              <Text style={styles.sectionSubtitleLast}>
                Ainda não são rivais, mas assim que você roubar o território de alguém ou eles roubarem o seu, isso aparecerá aqui
              </Text>
            </>
          ) : (
            <View style={{ marginBottom: 8 }}>
              {rivals.slice(0, 2).map((rival) => (
                <RivalCard key={rival.id} rival={rival} yourColor={YOUR_COLOR} compact />
              ))}
            </View>
          )}

          <View style={styles.sectionHeader}>
            <Ionicons name="medal-outline" size={22} color="#111" />
            <Text style={styles.sectionTitle}>Insígnias</Text>
            <View style={{ flex: 1 }} />
            <View style={styles.seasonPill}>
              <Text style={styles.seasonPillText}>{summary?.season?.name ?? '—'}</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>
            Cada desafio concluído desbloqueia uma conquista.
          </Text>
          <Text style={styles.sectionSubtitleLast}>
            Toque numa insígnia desbloqueada pra usá-la como capa do seu perfil — a conquista reinicia a cada nova temporada.
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.competitionsRow}
          >
            {badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} onPress={() => setSelectedBadge(badge)} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <BadgeDetailModal
        visible={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        badge={selectedBadge}
        isFeatured={!!selectedBadge && selectedBadge.id === featuredBadgeId}
        onSetFeatured={() => {
          if (!selectedBadge) return;
          setFeaturedBadgeId(featuredBadgeId === selectedBadge.id ? null : selectedBadge.id);
        }}
      />
    </View>
  );
}
