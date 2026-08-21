import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View, Text, PanResponder, NativeSyntheticEvent } from 'react-native';
import {
  Map,
  Camera,
  GeoJSONSource,
  Layer,
  Marker,
  MapRef,
  CameraRef,
  ViewStateChangeEvent,
} from '@maplibre/maplibre-react-native';
import type { Feature, FeatureCollection, LineString, Polygon as GeoJSONPolygon } from 'geojson';

import { styles } from './styles';
import { useLocation } from '../hooks/useLocation';
import { isLoopClosed, LatLng } from '../utils/geo';
import { useAuth } from '../contexts/AuthContext';
import { authApi, TerritoryCellView } from '../services/api';
import { MAP_STYLE_URL } from '../config/mapStyle';

import FloatingControls from './components/FloatingControls';
import MapControls from './components/MapControls';

export interface MapHandle {
  centerOnUser: () => void;
}

interface MapProps {
  drawable?: boolean;
  points?: LatLng[];
  // Rota salva selecionada como guia — desenhada tracejada, por baixo do
  // trajeto ao vivo (`points`), pra servir de referência sem se confundir
  // com o que já foi percorrido de verdade.
  referenceRoute?: LatLng[];
  onMapPress?: (coordinate: LatLng) => void;
  showFloatingControls?: boolean;
  territory?: string;
  // Qual grid H3 mostrar (corrida e pedal são grids independentes — ver
  // migration 008). "Território de todo mundo" só faz sentido pedir um
  // tipo de cada vez, igual o resto do app já faz (leaderboard, ranking).
  activityType?: 'run' | 'ride';
  // Desliga a camada de território — útil pra telas onde ver hexágono de
  // todo mundo não faz sentido (ex: escolher uma foto, tela de perfil).
  showTerritory?: boolean;
}

// distância mínima em pixels entre amostras do arrasto — evita gerar
// pontos demais (e travar) enquanto o dedo desliza pelo mapa
const SAMPLE_MIN_DISTANCE_PX = 6;

// MapLibre usa coordenadas [longitude, latitude] (array, padrão GeoJSON)
// — o resto do app inteiro usa {latitude, longitude} (era o padrão do
// react-native-maps). Em vez de espalhar esse detalhe por todo lugar,
// só esse arquivo (que fala com a lib de mapa diretamente) faz a
// conversão nas duas pontas.
function toLngLat(p: LatLng): [number, number] {
  return [p.longitude, p.latitude];
}

function toLngLatList(points: LatLng[]): [number, number][] {
  return points.map(toLngLat);
}

function MapComponent(
  {
    drawable = false,
    points = [],
    referenceRoute,
    onMapPress,
    showFloatingControls = true,
    territory = '0,00 km²',
    activityType = 'run',
    showTerritory = true,
  }: MapProps,
  ref: React.Ref<MapHandle>
) {
  const mapRef = useRef<MapRef>(null);
  const cameraRef = useRef<CameraRef>(null);
  const { location, permission } = useLocation();
  const { authFetch, userId } = useAuth();

  const [territoryCells, setTerritoryCells] = useState<TerritoryCellView[]>([]);
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // refs pra evitar closures desatualizadas dentro do PanResponder
  // (que é criado uma única vez via useRef)
  const drawableRef = useRef(drawable);
  const onMapPressRef = useRef(onMapPress);
  const lastSampledPoint = useRef<{ x: number; y: number } | null>(null);
  const isConverting = useRef(false);

  useEffect(() => {
    drawableRef.current = drawable;
  }, [drawable]);

  useEffect(() => {
    onMapPressRef.current = onMapPress;
  }, [onMapPress]);

  async function handleDragSample(x: number, y: number) {
    if (!drawableRef.current || !onMapPressRef.current) return;

    const last = lastSampledPoint.current;
    if (last) {
      const dx = x - last.x;
      const dy = y - last.y;
      if (dx * dx + dy * dy < SAMPLE_MIN_DISTANCE_PX ** 2) return;
    }
    lastSampledPoint.current = { x, y };

    if (isConverting.current) return; // já tem uma conversão em andamento, descarta essa amostra
    isConverting.current = true;
    try {
      // unproject devolve [longitude, latitude] direto
      const coordinate = await mapRef.current?.unproject([x, y]);
      if (coordinate) onMapPressRef.current?.({ longitude: coordinate[0], latitude: coordinate[1] });
    } finally {
      isConverting.current = false;
    }
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => drawableRef.current,
      onMoveShouldSetPanResponder: () => drawableRef.current,
      onPanResponderGrant: (evt) => {
        lastSampledPoint.current = null;
        handleDragSample(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
      onPanResponderMove: (evt) => {
        handleDragSample(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
      onPanResponderRelease: () => {
        lastSampledPoint.current = null;
      },
    })
  ).current;

  const handleCenterMap = () => {
    if (!location) return;
    cameraRef.current?.easeTo({
      center: [location.coords.longitude, location.coords.latitude],
      zoom: 17,
      duration: 500,
    });
  };

  useImperativeHandle(ref, () => ({ centerOnUser: handleCenterMap }));

  // Busca o território (mina + de todo mundo) da região visível, com
  // debounce — sem isso, cada pixel de arrasto do mapa dispararia uma
  // chamada nova. Só busca com zoom "de perto o bastante pra hexágono
  // fazer sentido" — muito afastado, LIMIT 3000 do backend cortaria os
  // dados de qualquer jeito e a tela ficaria poluída.
  const fetchTerritoryForBounds = useCallback(
    (bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }) => {
      if (!showTerritory) return;
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

      const latSpan = bounds.maxLat - bounds.minLat;
      if (latSpan > 0.05) {
        setTerritoryCells([]);
        return;
      }

      fetchTimeoutRef.current = setTimeout(() => {
        authApi
          .getTerritoryCells(authFetch, activityType, bounds)
          .then(setTerritoryCells)
          .catch(() => {
            // território é uma camada visual — uma falha aqui não deveria
            // travar o mapa nem mostrar alerta
          });
      }, 400);
    },
    [authFetch, activityType, showTerritory]
  );

  // onRegionDidChange já traz os limites visíveis dentro do próprio
  // evento (event.bounds = [west, south, east, north]) — não precisa de
  // uma segunda chamada assíncrona pra buscar isso à parte.
  const handleRegionDidChange = useCallback(
    (event: NativeSyntheticEvent<ViewStateChangeEvent>) => {
      const [west, south, east, north] = event.nativeEvent.bounds;
      fetchTerritoryForBounds({ minLat: south, maxLat: north, minLng: west, maxLng: east });
    },
    [fetchTerritoryForBounds]
  );

  // Busca inicial assim que a localização carrega — onRegionDidChange só
  // dispara depois que o mapa já está pronto e o usuário interage (ou
  // no fim do carregamento inicial), então isso cobre o primeiro frame.
  useEffect(() => {
    if (!location) return;
    const d = 0.0025; // metade do "latitudeDelta" que já usávamos (0.005)
    fetchTerritoryForBounds({
      minLat: location.coords.latitude - d,
      maxLat: location.coords.latitude + d,
      minLng: location.coords.longitude - d,
      maxLng: location.coords.longitude + d,
    });
  }, [location, fetchTerritoryForBounds]);

  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, []);

  // Um único GeoJSONSource com TODAS as células de território como
  // features — MUITO mais leve que criar uma fonte nativa por hexágono
  // (que pode ser centenas). A cor de cada uma vem de uma propriedade
  // lida pela camada via expressão ['get', ...], não de um source por
  // célula.
  const territoryFeatureCollection = useMemo<FeatureCollection<GeoJSONPolygon>>(
    () => ({
      type: 'FeatureCollection',
      features: territoryCells.map((cell) => ({
        type: 'Feature',
        properties: {
          fillColor: cell.isMine ? 'rgba(188, 255, 0, 0.35)' : `${cell.ownerColor}59`,
          strokeColor: cell.isMine ? '#BCFF00' : cell.ownerColor,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [toLngLatList(cell.boundary)],
        },
      })),
    }),
    [territoryCells]
  );

  const loopClosed = isLoopClosed(points);

  const referenceRouteFeature = useMemo<Feature<LineString> | null>(() => {
    if (!referenceRoute || referenceRoute.length < 2) return null;
    return {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: toLngLatList(referenceRoute) },
    };
  }, [referenceRoute]);

  const liveTrackFeature = useMemo<Feature<GeoJSONPolygon | LineString> | null>(() => {
    if (points.length === 0) return null;
    if (loopClosed) {
      return {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [toLngLatList(points)] },
      };
    }
    return {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: toLngLatList(points) },
    };
  }, [points, loopClosed]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Permissão de localização necessária</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <Text>Buscando localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Map
        ref={mapRef}
        style={styles.map}
        mapStyle={MAP_STYLE_URL}
        dragPan={!drawable}
        touchZoom={!drawable}
        touchRotate={!drawable}
        touchPitch={!drawable}
        onRegionDidChange={handleRegionDidChange}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: [location.coords.longitude, location.coords.latitude],
            zoom: 17,
          }}
        />

        <Marker lngLat={[location.coords.longitude, location.coords.latitude]}>
          <View style={styles.userDot} />
        </Marker>

        {territoryCells.length > 0 && (
          <GeoJSONSource id="territory-cells" data={territoryFeatureCollection}>
            <Layer id="territory-fill" type="fill" style={{ fillColor: ['get', 'fillColor'] }} />
            <Layer
              id="territory-stroke"
              type="line"
              style={{ lineColor: ['get', 'strokeColor'], lineWidth: 1 }}
            />
          </GeoJSONSource>
        )}

        {referenceRouteFeature && (
          <GeoJSONSource id="reference-route" data={referenceRouteFeature}>
            <Layer
              id="reference-route-line"
              type="line"
              style={{
                lineColor: 'rgba(188, 255, 0, 0.45)',
                lineWidth: 4,
                lineDasharray: [2, 1.5],
              }}
            />
          </GeoJSONSource>
        )}

        {liveTrackFeature && liveTrackFeature.geometry.type === 'Polygon' && (
          <GeoJSONSource id="live-track" data={liveTrackFeature}>
            <Layer
              id="live-track-fill"
              type="fill"
              style={{ fillColor: 'rgba(188, 255, 0, 0.25)' }}
            />
            <Layer id="live-track-stroke" type="line" style={{ lineColor: '#BCFF00', lineWidth: 3 }} />
          </GeoJSONSource>
        )}

        {liveTrackFeature && liveTrackFeature.geometry.type === 'LineString' && (
          <GeoJSONSource id="live-track" data={liveTrackFeature}>
            <Layer id="live-track-line" type="line" style={{ lineColor: '#BCFF00', lineWidth: 4 }} />
          </GeoJSONSource>
        )}
      </Map>

      {/* camada transparente que captura o arrastar-dedo; só "escuta"
          toque quando drawable=true, senão deixa passar pro mapa normal */}
      <View
        style={styles.drawLayer}
        pointerEvents={drawable ? 'auto' : 'none'}
        {...panResponder.panHandlers}
      />

      {showFloatingControls && (
        <FloatingControls territory={territory} onLocationPress={handleCenterMap} />
      )}

      <MapControls />
    </View>
  );
}

const MapComponentWithRef = forwardRef(MapComponent);
export default MapComponentWithRef;
