import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LatLng } from 'react-native-maps';

import Map, { MapHandle } from '../../Map';

import RoutePreviewModal from './components/RoutePreviewModal';
import MyRoutesModal from './components/MyRoutesModal';
import HelpModal from './components/HelpModal';

import { SavedRoute } from '../../types/route';

import { useSavedRoutes } from '../../contexts/SavedRoutesContext';

import { totalDistance, polygonArea, isLoopClosed } from '../../utils/geo';
import { styles } from './styles';

const FREE_USES_LIMIT = 3;

export default function RoutePlan() {
  const navigation = useNavigation();
  const mapRef = useRef<MapHandle>(null);

  const [points, setPoints] = useState<LatLng[]>([]);
  const [redoStack, setRedoStack] = useState<LatLng[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [territoriesOn, setTerritoriesOn] = useState(true);
  const [freeUsesLeft, setFreeUsesLeft] = useState(FREE_USES_LIMIT);
  const [saving, setSaving] = useState(false);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [routeName, setRouteName] = useState('');

  const { savedRoutes, addRoute, removeRoute } = useSavedRoutes();
  const [myRoutesVisible, setMyRoutesVisible] = useState(false)
  const [helpVisible, setHelpVisible] = useState(false);

  const distance = useMemo(() => totalDistance(points), [points]);
  const loopClosed = useMemo(() => isLoopClosed(points), [points]);
  const capture = useMemo(() => (loopClosed ? polygonArea(points) : 0), [points, loopClosed]);

  const hasRoute = points.length >= 2;
  const outOfFreeUses = freeUsesLeft <= 0;

  function handleMapPress(coordinate: LatLng) {
    setPoints((prev) => [...prev, coordinate]);
    setRedoStack([]);
  }

  function handleUndo() {
    setPoints((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setRedoStack((r) => [...r, last]);
      return prev.slice(0, -1);
    });
  }

  function handleRedo() {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const restored = prev[prev.length - 1];
      setPoints((p) => [...p, restored]);
      return prev.slice(0, -1);
    });
  }

  function handleErase() {
    setPoints([]);
    setRedoStack([]);
    setIsDrawing(false);
  }

  function handleToggleDrawing() {
    setIsDrawing((prev) => !prev);
  }

  function handleOpenPreview() {
    if (!hasRoute || outOfFreeUses) return;
    setIsDrawing(false);
    setPreviewVisible(true);
  }

  function handleMyRoutes() {
    setMyRoutesVisible(true);
  }

  function handleSelectRoute(route: SavedRoute) {
    setPoints(route.points);
    setIsDrawing(false);
    setMyRoutesVisible(false);
  }

  function handleDeleteRoute(id: string) {
    removeRoute(id);
  }

  async function handleConfirmSave() {
    if (!hasRoute || outOfFreeUses || saving || routeName.trim().length === 0) return;
    setSaving(true);
    try {
      // TODO: trocar por chamada real em services/api.ts
      await new Promise((resolve) => setTimeout(resolve, 400));

      const newRoute: SavedRoute = {
        id: Date.now().toString(),
        name: routeName.trim(),
        points,
        distanceMeters: distance,
        captureM2: capture,
        createdAt: Date.now(),
      };
      addRoute(newRoute);

      setFreeUsesLeft((prev) => prev - 1);
      setPreviewVisible(false);
      setRouteName('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Map
        ref={mapRef}
        drawable={isDrawing}
        points={points}
        onMapPress={handleMapPress}
        showFloatingControls={false}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerStats}>
          <View style={styles.statInline}>
            <Ionicons name="resize-outline" size={14} color="#BCFF00" />
            <Text style={styles.statInlineText}>distância {Math.round(distance)}m</Text>
          </View>

          <View style={styles.statInline}>
            <MaterialCommunityIcons name="flag-checkered" size={14} color="#BCFF00" />
            <Text style={styles.statInlineText}>capturado {Math.round(capture)}m²</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setHelpVisible(true)}>
          <Ionicons name="help-circle-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.floatingRow}>
        <TouchableOpacity style={styles.routesPill} onPress={handleMyRoutes}>
          <Text style={styles.routesPillText}>Minhas rotas</Text>
          <Ionicons name="chevron-down" size={14} color="#111" />
        </TouchableOpacity>

        <View style={styles.rightButtons}> 
          <TouchableOpacity
            style={styles.locateButton}
            onPress={() => mapRef.current?.centerOnUser()}
          >
            <Ionicons name="locate" size={18} color="#e9ebe6" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.toolsRow}>
          <View style={styles.toolsLeft}>
            <TouchableOpacity style={styles.toolButton} onPress={handleUndo} disabled={points.length === 0}>
              <Ionicons name="arrow-undo-outline" size={18} color={points.length === 0 ? '#ccc' : '#333'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolButton} onPress={handleRedo} disabled={redoStack.length === 0}>
              <Ionicons name="arrow-redo-outline" size={18} color={redoStack.length === 0 ? '#ccc' : '#333'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolButton} onPress={handleErase} disabled={points.length === 0}>
              <MaterialCommunityIcons name="eraser" size={18} color={points.length === 0 ? '#ccc' : '#333'} />
            </TouchableOpacity>
          </View>

          <View style={styles.territoriesRow}>
            <Text style={styles.territoriesLabel}>Territórios</Text>
            <TouchableOpacity
              style={[styles.toggle, territoriesOn && styles.toggleOn]}
              onPress={() => setTerritoriesOn(!territoriesOn)}
            >
              <View style={[styles.toggleThumb, territoriesOn && styles.toggleThumbOn]} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.drawButton} activeOpacity={0.85} onPress={handleToggleDrawing}>
            <Ionicons name="pencil" size={16} color="#fff" />
            <Text style={styles.drawButtonText}>{isDrawing ? 'Parar' : 'Desenhar'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.freeUsesText}>
          {outOfFreeUses ? 'sem usos gratuitos — assine o Pro para continuar' : `${freeUsesLeft} usos gratuitos restantes`}
        </Text>

        <TouchableOpacity
          style={[styles.saveButton, (!hasRoute || outOfFreeUses) && styles.saveButtonDisabled]}
          disabled={!hasRoute || outOfFreeUses}
          onPress={handleOpenPreview}
        >
          <Text style={[styles.saveText, (!hasRoute || outOfFreeUses) && styles.saveTextDisabled]}>
            SALVAR
          </Text>
        </TouchableOpacity>
      </View>

      <RoutePreviewModal
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        points={points}
        distanceMeters={distance}
        captureM2={capture}
        loopClosed={loopClosed}
        routeName={routeName}
        onChangeRouteName={setRouteName}
        onSave={handleConfirmSave}
        saving={saving}
      />

      <MyRoutesModal
        visible={myRoutesVisible}
        onClose={() => setMyRoutesVisible(false)}
        routes={savedRoutes}
        onSelectRoute={handleSelectRoute}
        onDeleteRoute={handleDeleteRoute}
      />

      <HelpModal visible={helpVisible} onClose={() => setHelpVisible(false)} />
    </View>
  );
}