import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import DraggableLineChart from '../../components/DraggleLineChart';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
import { ActivityHistory } from '../../types/history';
import { ActivityType } from '../../types/lobby';
import { colors } from '../../theme/colors';
import { styles } from './styles';

function formatMemberSince(iso: string): string {
  const date = new Date(iso);
  const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// Pega só o primeiro, o do meio e o último rótulo — evita lotar o eixo X
// com todas as semanas/meses quando a série tem muitos pontos.
function sampleAxisLabels(labels: string[]): string[] {
  if (labels.length === 0) return [];
  if (labels.length <= 3) return labels;
  const mid = Math.floor(labels.length / 2);
  return [labels[0], labels[mid], labels[labels.length - 1]];
}

export default function ViewHistory() {
  const navigation = useNavigation();
  const { authFetch } = useAuth();
  const [activityType, setActivityType] = useState<ActivityType>('run');
  const [history, setHistory] = useState<ActivityHistory | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(
    async (type: ActivityType) => {
      setLoading(true);
      try {
        const result = await authApi.myHistory(authFetch, type);
        setHistory(result);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Não foi possível carregar seu histórico.';
        Alert.alert('Ops', message);
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  useEffect(() => {
    loadHistory(activityType);
  }, [activityType, loadHistory]);

  const weeklyChartData = history?.weeklyDistance.map((w) => ({ label: w.label, value: w.distanceKm })) ?? [];
  const weeklyAxisLabels = sampleAxisLabels(history?.weeklyDistance.map((w) => w.label) ?? []);

  const territoryChartData =
    history?.territoryOverTime.map((t) => ({ label: t.month, value: t.territoryM2 / 1_000_000 })) ?? [];
  const territoryAxisLabels = sampleAxisLabels(history?.territoryOverTime.map((t) => t.month) ?? []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
            <Text style={[styles.toggleText, activityType === 'run' && styles.toggleTextActive]}>
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
            <Text style={[styles.toggleText, activityType === 'ride' && styles.toggleTextActive]}>
              Pedal
            </Text>
          </TouchableOpacity>
        </View>

        {loading && !history ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator color={colors.textPrimary} />
          </View>
        ) : (
          <>
            <View style={styles.memberRow}>
              <Text style={styles.memberLabel}>Membro desde</Text>
              <Text style={styles.memberValue}>
                {history ? formatMemberSince(history.memberSince) : '—'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Território ao longo do tempo</Text>
              <View style={styles.unitBadge}>
                <Text style={styles.unitBadgeText}>KM²</Text>
              </View>
            </View>

            {territoryChartData.every((d) => d.value === 0) ? (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyChartText}>Dados insuficientes ainda</Text>
              </View>
            ) : (
              <DraggableLineChart data={territoryChartData} xAxisLabels={territoryAxisLabels} />
            )}

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Distância semanal</Text>
              <View style={styles.unitBadge}>
                <Text style={styles.unitBadgeText}>KM</Text>
              </View>
            </View>

            {weeklyChartData.every((d) => d.value === 0) ? (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyChartText}>Dados insuficientes ainda</Text>
              </View>
            ) : (
              <DraggableLineChart data={weeklyChartData} xAxisLabels={weeklyAxisLabels} />
            )}

            <View style={styles.divider} />

            <Text style={styles.statSectionTitle}>Distância total</Text>
            <Text style={styles.statBig}>
              {(history?.totals.totalDistanceKm ?? 0).toFixed(0)} <Text style={styles.statBigUnit}>KM</Text>
            </Text>

            <Text style={styles.statSectionTitle}>
              Total de {activityType === 'ride' ? 'pedais' : 'corridas'}
            </Text>
            <Text style={styles.statBig}>{history?.totals.totalActivities ?? 0}</Text>

            <Text style={styles.statSectionTitle}>Distância capturada</Text>
            <Text style={styles.statBig}>
              {((history?.totals.totalCapturedM2 ?? 0) / 1_000_000).toFixed(3)}{' '}
              <Text style={styles.statBigUnit}>KM²</Text>
            </Text>

            <Text style={styles.statSectionTitle}>Domínios</Text>
            <Text style={styles.statBig}>{history?.totals.cellsOwned ?? 0}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}
