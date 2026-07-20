import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import DraggableLineChart from '../../components/DraggleLineChart';
import { MOCK_WEEKLY_DISTANCE, MOCK_TERRITORY_OVER_TIME } from '../../services/mock/history';
import { ActivityType } from '../../types/lobby';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function ViewHistory() {
  const navigation = useNavigation();
  const [activityType, setActivityType] = useState<ActivityType>('run');

  const totalDistanceKm = MOCK_WEEKLY_DISTANCE.reduce((sum, w) => sum + w.distanceKm, 0);
  const totalRuns = MOCK_WEEKLY_DISTANCE.filter((w) => w.distanceKm > 0).length;
  // no topo do componente, junto dos outros cálculos:
  const totalCapturedKm2 = 0; // TODO: vem de services/api.ts quando existir
  const mostDomains = 0; // TODO: idem

  const chartData = MOCK_WEEKLY_DISTANCE.map((w) => ({ label: w.label, value: w.distanceKm }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voltar</Text>
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

        <View style={styles.memberRow}>
          <Text style={styles.memberLabel}>Membro desde</Text>
          <Text style={styles.memberValue}>Julho 2026</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Território ao longo do tempo</Text>
          <View style={styles.unitBadge}>
            <Text style={styles.unitBadgeText}>KM²</Text>
          </View>
        </View>

        {MOCK_TERRITORY_OVER_TIME.length === 0 ? (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartText}>Dados insuficientes ainda</Text>
          </View>
        ) : (
          <DraggableLineChart
            data={MOCK_TERRITORY_OVER_TIME.map((t) => ({ label: t.month, value: t.territoryM2 }))}
            xAxisLabels={['JAN', 'ABR', 'JUL']}
          />
        )}

        <View style={styles.divider} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Distância semanal</Text>
          <View style={styles.unitBadge}>
            <Text style={styles.unitBadgeText}>KM</Text>
          </View>
        </View>

        <DraggableLineChart data={chartData} xAxisLabels={['JAN', 'ABR', 'JUL']} />

        <View style={styles.divider} />

        <Text style={styles.statSectionTitle}>Distância total</Text>
        <Text style={styles.statBig}>
          {totalDistanceKm.toFixed(0)} <Text style={styles.statBigUnit}>KM</Text>
        </Text>

        <Text style={styles.statSectionTitle}>Total de corridas</Text>
        <Text style={styles.statBig}>{totalRuns}</Text>

        <Text style={styles.statSectionTitle}>Distancia capturada</Text>
        <Text style={styles.statBig}>
          {totalCapturedKm2.toFixed(2)} <Text style={styles.statBigUnit}>KM²</Text>
        </Text>

        <Text style={styles.statSectionTitle}>Mais domínios</Text>
        <Text style={styles.statBig}>{mostDomains}</Text>
      </ScrollView>
    </View>
  );
}