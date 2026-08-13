import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { View, Text, PanResponder } from 'react-native';
import MapView, { Polyline, Polygon, Marker, LatLng } from 'react-native-maps';

import { styles } from './styles';
import { useLocation } from '../hooks/useLocation';
import { isLoopClosed } from '../utils/geo';

import UserLocation from './components/UserLocation';
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
}

// distância mínima em pixels entre amostras do arrasto — evita gerar
// pontos demais (e travar) enquanto o dedo desliza pelo mapa
const SAMPLE_MIN_DISTANCE_PX = 6;

function MapComponent(
  {
    drawable = false,
    points = [],
    referenceRoute,
    onMapPress,
    showFloatingControls = true,
    territory = '0,00 km²',
  }: MapProps,
  ref: React.Ref<MapHandle>
) {
  const mapRef = useRef<MapView>(null);
  const { location, permission } = useLocation();

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
      const coordinate = await mapRef.current?.coordinateForPoint({ x, y });
      if (coordinate) onMapPressRef.current?.(coordinate);
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
    mapRef.current?.animateCamera(
      {
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 17,
      },
      { duration: 500 }
    );
  };

  useImperativeHandle(ref, () => ({ centerOnUser: handleCenterMap }));

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

  const loopClosed = isLoopClosed(points);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        scrollEnabled={!drawable}
        zoomEnabled={!drawable}
        rotateEnabled={!drawable}
        pitchEnabled={!drawable}
      >
        <UserLocation
          latitude={location.coords.latitude}
          longitude={location.coords.longitude}
        />

        {referenceRoute && referenceRoute.length > 1 && (
          <Polyline
            coordinates={referenceRoute}
            strokeColor="rgba(188, 255, 0, 0.45)"
            strokeWidth={4}
            lineDashPattern={[8, 6]}
          />
        )}

        {points.length > 0 && loopClosed && (
          <Polygon
            coordinates={points}
            fillColor="rgba(188, 255, 0, 0.25)"
            strokeColor="#BCFF00"
            strokeWidth={3}
          />
        )}

        {points.length > 0 && !loopClosed && (
          <Polyline coordinates={points} strokeColor="#BCFF00" strokeWidth={4} />
        )}
      </MapView>

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

const Map = forwardRef(MapComponent);
export default Map;