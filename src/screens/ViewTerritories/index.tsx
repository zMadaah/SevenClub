import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Polygon } from 'react-native-maps';


import TerritoryDetailSheet from './components/TerritoryDetailSheet';
import RecapModal from './components/RecapModal';
import { MOCK_TERRITORIES, MOCK_USER_TERRITORY_COLOR } from '../../services/mock/territories';
import { darkMapStyle } from '../../Map/darkMapStyle';
import { ActivityType } from '../../types/lobby';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function ViewTerritories() {
  const navigation = useNavigation();
  const [activityType, setActivityType] = useState<ActivityType>('ride');
  const [liked, setLiked] = useState(false);
  const [recapVisible, setRecapVisible] = useState(false);

  const territory = useMemo(() => MOCK_TERRITORIES[activityType][0] ?? null, [activityType]);

  function toggleActivityType() {
    setActivityType((prev) => (prev === 'run' ? 'ride' : 'run'));
  }

  function handleFlagRide() {
    Alert.alert('Sinalizar corrida', 'Deseja marcar essa corrida para revisão da equipe?');
  }

  function handleViewRecap() {
    setRecapVisible(true);
  }

  const captureLabel =
    territory && territory.captureM2 >= 10000
      ? `${(territory.captureM2 / 1000000).toFixed(1)}`
      : territory
      ? `${Math.round(territory.captureM2)}`
      : '';
  const captureUnit = territory && territory.captureM2 >= 10000 ? 'km²' : 'm²';

  const xAxisLabels = territory
    ? ['0.0 KM', '0.5 KM', '1.0 KM', '1.5 KM', `${territory.distanceKm.toFixed(1)} KM`]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.activityPill} onPress={toggleActivityType}>
          <MaterialCommunityIcons
            name={activityType === 'ride' ? 'bike' : 'run'}
            size={16}
            color={colors.textPrimary}
          />
          <Text style={styles.activityPillText}>
            {activityType === 'ride' ? 'Pedal' : 'Corrida'}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapArea}>
        {territory ? (
          <MapView
            style={styles.map}
            customMapStyle={darkMapStyle}
            initialRegion={{
              latitude: territory.points[0].latitude,
              longitude: territory.points[0].longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Polygon
              coordinates={territory.points}
              fillColor={`${MOCK_USER_TERRITORY_COLOR}99`}
              strokeColor={MOCK_USER_TERRITORY_COLOR}
              strokeWidth={2}
            />
          </MapView>
        ) : (
          <View style={styles.emptyMap}>
            <Ionicons name="location-outline" size={28} color={colors.laurelLeaf} />
            <Text style={styles.emptyMapText}>
              Nenhum território de {activityType === 'ride' ? 'pedal' : 'corrida'} ainda
            </Text>
          </View>
        )}

        {territory && (
          <View style={[styles.rankBadge, { borderColor: MOCK_USER_TERRITORY_COLOR }]}>
            <View style={[styles.rankNumber, { backgroundColor: MOCK_USER_TERRITORY_COLOR }]}>
              <Text style={styles.rankNumberText}>#{territory.rankInGroup}</Text>
            </View>

            <View>
              <Text style={styles.rankBadgeTitle}>{territory.activityName}</Text>
              <View style={styles.rankBadgeCaptureRow}>
                <Ionicons name="flag" size={12} color={MOCK_USER_TERRITORY_COLOR} />
                <Text style={styles.rankBadgeCapture}>
                  {captureLabel} {captureUnit}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {territory && (
        <TerritoryDetailSheet
          territory={territory}
          xAxisLabels={xAxisLabels}
          liked={liked}
          onToggleLike={() => setLiked((prev) => !prev)}
          onFlagRide={handleFlagRide}
          onViewRecap={handleViewRecap}
        />
      )}

      {territory && (
        <RecapModal
          visible={recapVisible}
          onClose={() => setRecapVisible(false)}
          territory={territory}
        />
      )}
    </View>
  );
}