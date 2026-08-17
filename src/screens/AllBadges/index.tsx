import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import HexagonBadge from '../../components/HexagonBadge';
import BadgeDetailModal from '../Progress/components/BadgeDetailModal';
import { BADGE_CATALOG, IMPLEMENTED_BADGE_IDS } from '../../services/mock/badges';
import { BadgeWithStatus } from '../../types/badge';
import { useFeaturedBadge } from '../../contexts/FeaturedBadgeContext';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
import { styles } from './styles';

const HEX_SIZE = 92;

// Uma cor por insígnia, ciclando por uma paleta — dá pra ter mais
// insígnias no catálogo do que cores fixas sem repetir vizinha com
// vizinha na maioria dos casos.
const COLOR_CYCLE = [
  '#1D9E75', // teal
  '#378ADD', // blue
  '#D85A30', // coral
  '#7F77DD', // purple
  '#BA7517', // amber
  '#639922', // green
  '#D4537E', // pink
  '#E24B4A', // red
];

function colorForBadge(index: number): string {
  return COLOR_CYCLE[index % COLOR_CYCLE.length];
}

export default function AllBadges() {
  const navigation = useNavigation();
  const { authFetch } = useAuth();
  const { featuredBadgeId, setFeaturedBadgeId } = useFeaturedBadge();

  const [badges, setBadges] = useState<BadgeWithStatus[]>(
    BADGE_CATALOG.map((b) => ({ ...b, unlocked: false }))
  );
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithStatus | null>(null);

  useEffect(() => {
    authApi
      .getBadgeStatuses(authFetch)
      .then((statuses) => {
        setBadges(
          BADGE_CATALOG.map((badge) => {
            const status = statuses.find((s) => s.id === badge.id);
            return {
              ...badge,
              unlocked: status?.unlocked ?? false,
              unlockedAtLabel: status?.unlockedAt
                ? new Date(status.unlockedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : undefined,
            };
          })
        );
      })
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : 'Não foi possível carregar as insígnias.';
        Alert.alert('Ops', message);
      })
      .finally(() => setLoading(false));
  }, [authFetch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>INSÍGNIAS</Text>
        <View style={{ width: 20 }} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#fff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageSubtitle}>
            Toque numa insígnia conquistada pra usá-la como capa do seu perfil.
          </Text>

          <View style={styles.grid}>
            {badges.map((badge, index) => {
              const implemented = IMPLEMENTED_BADGE_IDS.includes(badge.id);
              const color = colorForBadge(index);
              const subtitle = !implemented
                ? 'Em breve'
                : badge.unlocked
                ? badge.unlockedAtLabel
                : 'Bloqueada';

              return (
                <TouchableOpacity
                  key={badge.id}
                  style={styles.tile}
                  onPress={() => implemented && setSelectedBadge(badge)}
                  activeOpacity={implemented ? 0.7 : 1}
                  disabled={!implemented}
                >
                  <HexagonBadge size={HEX_SIZE} color={color} locked={!implemented || !badge.unlocked}>
                    {badge.iconLib === 'mci' ? (
                      <MaterialCommunityIcons
                        name={badge.icon as any}
                        size={30}
                        color={!implemented || !badge.unlocked ? '#7A7A7A' : '#fff'}
                      />
                    ) : (
                      <Ionicons
                        name={badge.icon as any}
                        size={30}
                        color={!implemented || !badge.unlocked ? '#7A7A7A' : '#fff'}
                      />
                    )}
                  </HexagonBadge>
                  <Text style={styles.tileName} numberOfLines={2}>
                    {badge.name}
                  </Text>
                  <Text style={styles.tileSubtitle} numberOfLines={1}>
                    {subtitle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

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
