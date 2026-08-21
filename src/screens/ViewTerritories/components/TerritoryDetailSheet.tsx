import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Map, Camera, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { Feature, Polygon as GeoJSONPolygon } from 'geojson';

import DraggableLineChart from '../../../components/DraggleLineChart';
import { MAP_STYLE_URL_DARK } from '../../../config/mapStyle';
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
          <Image
            source={{ uri: `https://flagcdn.com/w160/${territory.countryCode}.png` }}
            style={styles.rankFlag}
          />

          <View style={styles.rankContent}>
            <View style={styles.rankCardBlock}>
              <Text style={styles.rankCardValue}>
                <Text style={styles.rankCardHash}>#</Text>
                {territory.countryRank.toLocaleString('pt-BR')}
              </Text>
              <Text style={styles.rankCardLabel}>País</Text>
            </View>

            <Text style={styles.rankCardCenterLabel}>RANK</Text>

            <View style={styles.rankCardRightGroup}>
              <View style={styles.rankCardBlock}>
                <Text style={styles.rankCardValue}>
                  <Text style={styles.rankCardHash}>#</Text>
                  {territory.globalRank.toLocaleString('pt-BR')}
                </Text>
                <Text style={styles.rankCardLabel}>Global</Text>
              </View>

              <Ionicons name="earth" size={20} color={colors.accent} style={styles.rankGlobeIcon} />
            </View>
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

          {/* <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="create-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity> */}
        </View>

        <View style={styles.routeMapCard}>
          <Map
            style={styles.routeMap}
            mapStyle={MAP_STYLE_URL_DARK}
            dragPan={false}
            touchZoom={false}
            touchRotate={false}
            touchPitch={false}
          >
            <Camera
              initialViewState={{
                center: [territory.points[0].longitude, territory.points[0].latitude],
                zoom: 15,
              }}
            />

            <GeoJSONSource
              id="territory-detail-outline"
              data={
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Polygon',
                    coordinates: [territory.points.map((p) => [p.longitude, p.latitude] as [number, number])],
                  },
                } as Feature<GeoJSONPolygon>
              }
            >
              <Layer id="territory-detail-outline-line" type="line" style={{ lineColor: colors.accent, lineWidth: 3 }} />
            </GeoJSONSource>
          </Map>
        </View>

        {/* <View style={styles.socialRow}>
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
        </View> */}

        <TouchableOpacity style={styles.recapButton} onPress={onViewRecap}>
          <Ionicons name="play" size={16} color={colors.richBlack} />
          <Text style={styles.recapButtonText}>VER RECAP</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Velocidade média</Text>
          {/* <TouchableOpacity style={styles.flagButton} onPress={onFlagRide}>
            <Ionicons name="flag-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.flagButtonText}>SINALIZAR</Text>
          </TouchableOpacity> */}
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