import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Map, Camera, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { Feature, LineString, Polygon as GeoJSONPolygon } from 'geojson';

import { RootStackParamList } from '../../navigation/types';
import { MAP_STYLE_URL_DARK } from '../../config/mapStyle';
import { SavedRoute } from '../../types/route';
import { useSavedRoutes } from '../../contexts/SavedRoutesContext';
import { ApiError } from '../../services/api';
import { isLoopClosed } from '../../utils/geo';
import MyRoutesModal from '../RoutePlan/components/MyRoutesModal';
import { colors } from '../../theme/colors';
import { styles } from './styles';

// "Territórios" aqui = histórico das rotas criadas no RoutePlan (não
// atividades executadas — essas ficam em ViewActivities). Por isso os
// campos de velocidade/elevação/ranking/curtidas que essa tela tinha antes
// saíram: uma rota planejada e ainda não corrida não tem esse dado. O que
// ela tem de valioso é o próprio desenho + a ação de "usar esta rota" pra
// já ir direto pro ActivityStart com ela pré-carregada.
export default function ViewTerritories() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { savedRoutes, loading, refreshRoutes, removeRoute } = useSavedRoutes();

  const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    refreshRoutes().catch((err) => {
      const message = err instanceof ApiError ? err.message : 'Não foi possível carregar suas rotas.';
      Alert.alert('Ops', message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Seleciona a rota mais recente automaticamente (a API já devolve
  // ordenado por created_at desc) assim que a lista chega, ou se a que
  // estava selecionada tiver sido removida.
  useEffect(() => {
    if (savedRoutes.length === 0) {
      setSelectedRoute(null);
      return;
    }
    if (!selectedRoute || !savedRoutes.some((r) => r.id === selectedRoute.id)) {
      setSelectedRoute(savedRoutes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedRoutes]);

  function handleSelectRoute(route: SavedRoute) {
    setSelectedRoute(route);
    setPickerVisible(false);
  }

  async function handleDeleteRoute(id: string) {
    try {
      await removeRoute(id);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível remover a rota.';
      Alert.alert('Ops', message);
    }
  }

  function handleUseRoute() {
    if (!selectedRoute) return;
    navigation.navigate('ActivityStart', { presetRouteId: selectedRoute.id });
  }

  const loopClosed = selectedRoute ? isLoopClosed(selectedRoute.points) : false;

  const captureLabel = selectedRoute
    ? selectedRoute.captureM2 >= 10000
      ? (selectedRoute.captureM2 / 1_000_000).toFixed(2)
      : Math.round(selectedRoute.captureM2).toString()
    : '';
  const captureUnit = selectedRoute && selectedRoute.captureM2 >= 10000 ? 'km²' : 'm²';

  const createdAtLabel = selectedRoute
    ? new Date(selectedRoute.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

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

        <TouchableOpacity style={styles.activityPill} onPress={() => setPickerVisible(true)}>
          <Ionicons name="trail-sign-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.activityPillText} numberOfLines={1}>
            {selectedRoute ? selectedRoute.name : 'Minhas rotas'}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapArea}>
        {selectedRoute ? (
          <Map style={styles.map} mapStyle={MAP_STYLE_URL_DARK}>
            <Camera
              initialViewState={{
                center: [selectedRoute.points[0].longitude, selectedRoute.points[0].latitude],
                zoom: 15,
              }}
            />

            <GeoJSONSource
              id="selected-route"
              data={
                {
                  type: 'Feature',
                  properties: {},
                  geometry: loopClosed
                    ? {
                        type: 'Polygon',
                        coordinates: [
                          selectedRoute.points.map((p) => [p.longitude, p.latitude] as [number, number]),
                        ],
                      }
                    : {
                        type: 'LineString',
                        coordinates: selectedRoute.points.map((p) => [p.longitude, p.latitude] as [number, number]),
                      },
                } as Feature<GeoJSONPolygon | LineString>
              }
            >
              {loopClosed ? (
                <>
                  <Layer id="selected-route-fill" type="fill" style={{ fillColor: 'rgba(188, 255, 0, 0.3)' }} />
                  <Layer id="selected-route-stroke" type="line" style={{ lineColor: colors.accent, lineWidth: 2 }} />
                </>
              ) : (
                <Layer id="selected-route-line" type="line" style={{ lineColor: colors.accent, lineWidth: 3 }} />
              )}
            </GeoJSONSource>
          </Map>
        ) : (
          <View style={styles.emptyMap}>
            <Ionicons name="location-outline" size={28} color={colors.laurelLeaf} />
            <Text style={styles.emptyMapText}>
              {loading ? 'Carregando suas rotas...' : 'Nenhuma rota salva ainda'}
            </Text>
          </View>
        )}
      </View>

      {selectedRoute && (
        <View style={styles.detailSheet}>
          <Text style={styles.routeTitle}>{selectedRoute.name}</Text>
          <Text style={styles.routeMeta}>Criada em {createdAtLabel}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>distância</Text>
              <Text style={styles.statValue}>
                {(selectedRoute.distanceMeters / 1000).toFixed(2)} <Text style={styles.statUnit}>km</Text>
              </Text>
            </View>

            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>captura estimada</Text>
              <Text style={styles.statValue}>
                {captureLabel} <Text style={styles.statUnit}>{captureUnit}</Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.useRouteButton} onPress={handleUseRoute}>
            <Ionicons name="play" size={16} color={colors.richBlack} />
            <Text style={styles.useRouteButtonText}>USAR ESTA ROTA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteRoute(selectedRoute.id)}
          >
            <Ionicons name="trash-outline" size={16} color={colors.laurelLeaf} />
            <Text style={styles.deleteButtonText}>Remover rota</Text>
          </TouchableOpacity>
        </View>
      )}

      <MyRoutesModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        routes={savedRoutes}
        loading={loading}
        onEditRoute={handleSelectRoute}
        onDeleteRoute={handleDeleteRoute}
        onStartRoute={(route) => {
          setPickerVisible(false);
          navigation.navigate('ActivityStart', { presetRouteId: route.id });
        }}
      />
    </View>
  );
}
