import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, BottomTabsParamList } from '../../navigation/types';
import { styles } from './styles';
import * as StoreReview from 'expo-store-review';

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
  MyProfile,
  ProgressSummary,
  BadgeStatus,
  ChallengeStatus,
  RivalEntryApi,
} from '../../services/api';
import { ActivityType } from '../../types/lobby';

const TABS = ['Progresso', 'Atividades'];
const YOUR_COLOR = '#BCFF00';

// TODO: trocar pelo @ de verdade do Seven Club assim que a conta oficial existir
const INSTAGRAM_URL = 'https://instagram.com/sevenclub.lab';

type ChallengeIcon = 'watch' | 'friend' | 'profile' | 'instagram' | 'run' | 'star' | 'image';
type ChallengeKind = 'navigate' | 'external' | 'progress' | 'review';

const CHALLENGE_META: Record<
  string,
  { title: string; icon: ChallengeIcon; kind: ChallengeKind; screen?: keyof RootStackParamList | keyof BottomTabsParamList }
> = {
  c1: { title: 'Conectar relógio Garmin', icon: 'watch', kind: 'navigate' }, // sem tela — integração ainda não existe
  c2: { title: 'Seguir um amigo', icon: 'friend', kind: 'navigate', screen: 'AddFriend' },
  c3: { title: 'Adicionar foto de perfil', icon: 'profile', kind: 'navigate', screen: 'EditProfile' },
  c4: { title: 'Seguir no Instagram', icon: 'instagram', kind: 'external' },
  c5: { title: 'Correr 5 vezes', icon: 'run', kind: 'progress' },
  c6: { title: 'Avaliar o app', icon: 'star', kind: 'review' },
  c7: { title: 'Postar uma foto no feed', icon: 'image', kind: 'navigate', screen: 'Social' },
};

function challengeIconName(icon: ChallengeIcon) {
  switch (icon) {
    case 'watch':
      return 'watch-outline';
    case 'friend':
      return 'person-add-outline';
    case 'profile':
      return 'camera-outline';
    case 'instagram':
      return 'logo-instagram';
    case 'run':
      return 'walk-outline';
    case 'star':
      return 'star-outline';
    case 'image':
      return 'image-outline';
  }
}

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
  const [profile, setProfile] = useState<MyProfile | null>(null);

  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [badgeStatuses, setBadgeStatuses] = useState<BadgeStatus[]>([]);
  const [challengeStatuses, setChallengeStatuses] = useState<ChallengeStatus[]>([]);
  const [rivals, setRivals] = useState<RivalEntryApi[]>([]);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [instagramOpened, setInstagramOpened] = useState<Record<string, boolean>>({});

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

  // useFocusEffect (não useEffect): sem isso, voltar do AddFriend/
  // EditProfile depois de completar um desafio não atualizava o status
  // — a tela continuava mostrando "ainda não concluído" até fechar e
  // reabrir o app inteiro.
  useFocusEffect(
    useCallback(() => {
      loadAll(activityType);
      authApi.me(authFetch).then(setProfile).catch(() => {
        // cabeçalho funciona com o avatar genérico se isso falhar
      });
    }, [activityType, loadAll, authFetch])
  );

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

  // c4 (Instagram) e c6 (avaliação) são "honor system" — o backend não
  // tem como confirmar de fora, então a confiança fica no próprio fluxo:
  // primeiro toque abre o link/prompt nativo, só o segundo toque resgata.
  async function handleChallengePress(challenge: ChallengeStatus, meta: (typeof CHALLENGE_META)[string]) {
    if (challenge.claimed || claimingId) return;

    if (meta.kind === 'external') {
      if (!instagramOpened[challenge.id]) {
        try {
          const supported = await Linking.canOpenURL(INSTAGRAM_URL);
          if (supported) await Linking.openURL(INSTAGRAM_URL);
        } catch {
          // segue o fluxo mesmo se o link falhar — não trava o resgate
        }
        setInstagramOpened((prev) => ({ ...prev, [challenge.id]: true }));
        return;
      }
      handleClaimChallenge(challenge.id);
      return;
    }

    if (meta.kind === 'review') {
      try {
        const available = await StoreReview.isAvailableAsync();
        if (available) {
          await StoreReview.requestReview();
        } else {
          Alert.alert('Ops', 'A avaliação não está disponível nesse dispositivo agora.');
          return;
        }
      } catch {
        // segue o fluxo mesmo se o prompt falhar — não trava o resgate
      }
      handleClaimChallenge(challenge.id);
      return;
    }

    // kind === 'navigate' (c1, c2, c3, c7)
    if (!challenge.completed) {
      if (meta.screen) {
        navigation.navigate(meta.screen as any);
      } else {
        Alert.alert(
          'Ainda não disponível',
          'A integração com relógios ainda não está pronta — assim que estiver, esse desafio libera sozinho.'
        );
      }
      return;
    }

    handleClaimChallenge(challenge.id);
  }

  function challengeButtonLabel(challenge: ChallengeStatus, meta: (typeof CHALLENGE_META)[string]): string {
    if (challenge.claimed) return 'RESGATADO';
    if (claimingId === challenge.id) return 'RESGATANDO...';

    if (meta.kind === 'external') {
      return instagramOpened[challenge.id] ? 'JÁ SEGUI — RESGATAR' : 'SEGUIR NO INSTAGRAM';
    }
    if (meta.kind === 'review') {
      return 'AVALIAR NA LOJA';
    }
    if (!challenge.completed) {
      return meta.screen ? 'TOQUE PARA RESOLVER' : 'AINDA NÃO DISPONÍVEL';
    }
    return 'TOQUE PARA RESGATAR';
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
          <Image source={{ uri: profile?.avatarUrl || 'https://i.pravatar.cc/200?img=10' }} style={styles.avatar} />
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

              const showProgressBar = meta.kind === 'progress' && !challenge.completed;
              const progressPct = showProgressBar
                ? Math.min(((challenge.progress ?? 0) / (challenge.target ?? 1)) * 100, 100)
                : 0;

              return (
                <View key={challenge.id} style={styles.challengeCard}>
                  <View style={styles.claimBadge}>
                    <Text style={styles.claimBadgeText}>GANHE {challenge.xp}XP</Text>
                  </View>

                  <View style={styles.challengeIconCircle}>
                    <Ionicons name={challengeIconName(meta.icon) as any} size={24} color="#fff" />
                  </View>

                  <Text style={styles.challengeTitle}>{meta.title}</Text>

                  {showProgressBar ? (
                    <View style={styles.progressBox}>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
                      </View>
                      <Text style={styles.progressText}>
                        {challenge.progress ?? 0}/{challenge.target ?? 0} atividades
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.claimButton}
                      onPress={() => handleChallengePress(challenge, meta)}
                      disabled={challenge.claimed || claimingId === challenge.id}
                    >
                      <Text style={styles.claimButtonText}>{challengeButtonLabel(challenge, meta)}</Text>
                    </TouchableOpacity>
                  )}
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

          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => navigation.navigate('AllBadges')}
            activeOpacity={0.7}
          >
            <Ionicons name="medal-outline" size={22} color="#111" />
            <Text style={styles.sectionTitle}>Insígnias</Text>
            <View style={{ flex: 1 }} />
            <View style={styles.seasonPill}>
              <Text style={styles.seasonPillText}>{summary?.season?.name ?? '—'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
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
