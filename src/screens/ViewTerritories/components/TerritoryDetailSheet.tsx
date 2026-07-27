import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Polygon } from 'react-native-maps';


import DraggableLineChart from '../../../components/DraggleLineChart';
import { darkMapStyle } from '../../../Map/darkMapStyle';
import { TerritoryEntry } from '../../../types/territory';
import { colors } from '../../../theme/colors';
import { styles } from './TerritoryDetailSheet.styles';

interface TerritoryDetailSheetProps {
  territory: TerritoryEntry;
  xAxisLabels: string[];
  liked: boolean;
  onToggleLike: () => void;
  onFlagRide: () => void;
  onViewRecap: () => void;
}

export default function TerritoryDetailSheet({
  territory,
  xAxisLabels,
  liked,
  onToggleLike,
  onFlagRide,
  onViewRecap,
}: TerritoryDetailSheetProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dragHandle} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileRow}>
          <Image source={{ uri: territory.runnerAvatarUrl }} style={styles.avatar} />
          <View>
            <Text style={styles.runnerName}>{territory.runnerName}</Text>
            <Text style={styles.runnerMeta}>{territory.capturedAtLabel}</Text>
            <Text style={styles.runnerLocation}>
              {territory.location} {territory.countryFlag}
            </Text>
          </View>
        </View>

        <View style={styles.rankCard}>
          <View style={styles.rankCardBlock}>
            <Text style={styles.rankCardFlag}>{territory.countryFlag}</Text>
            <Text style={styles.rankCardValue}>#{territory.countryRank}</Text>
            <Text style={styles.rankCardLabel}>País</Text>
          </View>

          <Text style={styles.rankCardCenterLabel}>RANK</Text>

          <View style={styles.rankCardBlock}>
            <Text style={styles.rankCardValue}>
              #{territory.globalRank.toLocaleString('pt-BR')}
            </Text>
            <Text style={styles.rankCardLabel}>Global</Text>
            <Ionicons name="earth" size={16} color={colors.accent} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBlockLeft}>
            <Text style={styles.statLabel}>distância</Text>
            <Text style={styles.statValue}>
              {territory.distanceKm.toFixed(2)} <Text style={styles.statUnit}>km</Text>
            </Text>
          </View>

          <View style={styles.statBlockLeft}>
            <Text style={styles.statLabel}>duração</Text>
            <Text style={styles.statValue}>{territory.durationLabel}</Text>
          </View>

          <View style={styles.statBlockLeft}>
            <Text style={styles.statLabel}>vel. média</Text>
            <Text style={styles.statValue}>
              {territory.avgSpeedKmh.toFixed(1)} <Text style={styles.statUnit}>km/h</Text>
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.activityTitle}>{territory.activityName}</Text>
            <Text style={styles.activityDescription}>{territory.activityDescription}</Text>
          </View>

          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="create-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.routeMapCard}>
          <MapView
            style={styles.routeMap}
            customMapStyle={darkMapStyle}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            initialRegion={{
              latitude: territory.points[0].latitude,
              longitude: territory.points[0].longitude,
              latitudeDelta: 0.012,
              longitudeDelta: 0.012,
            }}
          >
            <Polygon
              coordinates={territory.points}
              fillColor="transparent"
              strokeColor={colors.accent}
              strokeWidth={3}
            />
          </MapView>
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity onPress={onToggleLike} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={22}
              color={liked ? '#D85A30' : colors.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.recapButton} onPress={onViewRecap}>
          <Ionicons name="play" size={16} color={colors.richBlack} />
          <Text style={styles.recapButtonText}>VER RECAP</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Velocidade média</Text>
          <TouchableOpacity style={styles.flagButton} onPress={onFlagRide}>
            <Ionicons name="flag-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.flagButtonText}>SINALIZAR</Text>
          </TouchableOpacity>
        </View>

        <DraggableLineChart
          data={territory.speedSamples.map((s) => ({
            label: `${s.distanceKm.toFixed(2)} km`,
            value: s.value,
          }))}
          xAxisLabels={xAxisLabels}
        />

        <View style={styles.singleStatRow}>
          <Text style={styles.singleStatLabel}>velocidade máxima</Text>
          <Text style={styles.singleStatValue}>
            {territory.maxSpeedKmh.toFixed(1)} <Text style={styles.singleStatUnit}>km/h</Text>
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.chartTitle}>Elevação</Text>

        <DraggableLineChart
          data={territory.elevationSamples.map((s) => ({
            label: `${s.distanceKm.toFixed(2)} km`,
            value: s.value,
          }))}
          xAxisLabels={xAxisLabels}
        />

        <View style={styles.singleStatRow}>
          <Text style={styles.singleStatLabel}>ganho de elevação</Text>
          <Text style={styles.singleStatValue}>
            {territory.elevationGainM} <Text style={styles.singleStatUnit}>m</Text>
          </Text>
        </View>

        <View style={styles.singleStatRow}>
          <Text style={styles.singleStatLabel}>perda de elevação</Text>
          <Text style={styles.singleStatValue}>
            {territory.elevationLossM} <Text style={styles.singleStatUnit}>m</Text>
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}