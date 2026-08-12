import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../navigation/types';
import Map from '../../Map';

import { useActivityTracker } from '../../hooks/useActivityTracker';

import { formatDuration } from '../../utils/time';
import { isLoopClosed, polygonArea } from '../../utils/geo';

import { CompletedActivity } from '../../types/activity';
import { ActivityType } from '../../types/lobby';
import { SavedRoute } from '../../types/route';

import { useSavedRoutes } from '../../contexts/SavedRoutesContext';

import ActivityStatsModal from './components/ActivityStatsModal';
import ActivitySummaryModal from './components/ActivitySummaryModal';
import RouteSelectModal from './components/RouteSelectModal';
import ActivityTypeModal from './components/ActivityTypeModal';
import MapOptionsModal from './components/MapOptionsModal';

import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function ActivityStart() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const tracker = useActivityTracker();

  const [summaryVisible, setSummaryVisible] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [saving, setSaving] = useState(false);

  const { savedRoutes } = useSavedRoutes();

  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [activityTypeModalVisible, setActivityTypeModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const [activityType, setActivityType] = useState<ActivityType>('run');
  const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);
  const [showRoutesOverlay, setShowRoutesOverlay] = useState(false);

  const activityTypeLabel = activityType === 'run' ? 'Corrida' : 'Pedal';

  const loopClosed = useMemo(() => isLoopClosed(tracker.points), [tracker.points]);
  const captureM2 = useMemo(
    () => (loopClosed ? polygonArea(tracker.points) : 0),
    [tracker.points, loopClosed]
  );

  function handleSelectRoute(route: SavedRoute) {
    setSelectedRoute(route);
    setRouteModalVisible(false);
  }

  function handlePlanRoute() {
    setRouteModalVisible(false);
    navigation.navigate('RoutePlan');
  }

  function handleToggle() {
    if (!tracker.isRunning) {
      tracker.start();
    } else if (tracker.isPaused) {
      tracker.resume();
    } else {
      tracker.pause();
    }
  }

  function handleFinalize() {
    if (!tracker.isPaused) tracker.pause();
    setSummaryVisible(true);
  }

  function handleCloseSummary() {
    setSummaryVisible(false);
    tracker.resume(); // fechar sem salvar = "ainda não terminei"
  }

  async function handleSaveActivity() {
    if (activityName.trim().length === 0 || saving) return;
    setSaving(true);
    try {
      const completed: CompletedActivity = {
        id: Date.now().toString(),
        name: activityName.trim(),
        points: tracker.points,
        distanceMeters: tracker.distanceMeters,
        durationSeconds: tracker.elapsedSeconds,
        paceLabel: tracker.paceLabel,
        loopClosed,
        captureM2,
        createdAt: Date.now(),
      };

      // TODO: trocar por chamada real em services/api.ts assim que existir
      await new Promise((resolve) => setTimeout(resolve, 400));

      setSummaryVisible(false);
      setActivityName('');
      tracker.reset();
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }

  const buttonLabel = !tracker.isRunning ? 'INICIAR' : tracker.isPaused ? 'RETOMAR' : 'PAUSA';

  return (
    <View style={styles.container}>
      <Map showFloatingControls={false} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} colors={colors.overlay} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.pillsRow}>
          <TouchableOpacity style={styles.pill} onPress={() => setRouteModalVisible(true)}>
            <Ionicons name="git-network-outline" size={16} colors={colors.richBlack} />
            <Text style={styles.pillText}>Rotas</Text>
            <Ionicons name="chevron-down" size={14} colors={colors.overlay} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.pill} onPress={() => setActivityTypeModalVisible(true)}>
            <Ionicons name="walk-outline" size={16} colors={colors.richBlack} />
            <Text style={styles.pillText}>{activityTypeLabel}</Text>
            <Ionicons name="chevron-down" size={14} colors={colors.overlay} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.pill} onPress={() => setOptionsModalVisible(true)}>
            <Ionicons name="options-outline" size={16} colors={colors.richBlack} />
            <Text style={styles.pillText}>Opções</Text>
            <Ionicons name="chevron-down" size={14} colors={colors.overlay} />
          </TouchableOpacity>
        </View>
      </View>

      <ActivityStatsModal
        visible={tracker.isRunning && !summaryVisible}
        distanceMeters={tracker.distanceMeters}
        durationLabel={formatDuration(tracker.elapsedSeconds)}
        paceLabel={tracker.paceLabel}
        isPaused={tracker.isPaused}
      />

      {!tracker.isRunning ? (
        <TouchableOpacity style={styles.startButton} activeOpacity={0.85} onPress={handleToggle}>
          <Text style={styles.startText}>{buttonLabel}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.pauseButton} activeOpacity={0.85} onPress={handleToggle}>
            <Text style={styles.pauseButtonText}>{buttonLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.finalizeButton}
            activeOpacity={0.85}
            onPress={handleFinalize}
          >
            <Text style={styles.finalizeButtonText}>FINALIZAR</Text>
          </TouchableOpacity>
        </View>
      )}

      <ActivitySummaryModal
        visible={summaryVisible}
        onClose={handleCloseSummary}
        onSave={handleSaveActivity}
        points={tracker.points}
        distanceMeters={tracker.distanceMeters}
        durationLabel={formatDuration(tracker.elapsedSeconds)}
        paceLabel={tracker.paceLabel}
        loopClosed={loopClosed}
        captureM2={captureM2}
        activityName={activityName}
        onChangeActivityName={setActivityName}
        saving={saving}
      />

      <RouteSelectModal
        visible={routeModalVisible}
        onClose={() => setRouteModalVisible(false)}
        routes={savedRoutes}
        onSelectRoute={handleSelectRoute}
        onPlanRoute={handlePlanRoute}
      />

      <ActivityTypeModal
        visible={activityTypeModalVisible}
        onClose={() => setActivityTypeModalVisible(false)}
        value={activityType}
        onSelect={setActivityType}
      />

      <MapOptionsModal
        visible={optionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        showRoutesOverlay={showRoutesOverlay}
        onToggleRoutesOverlay={setShowRoutesOverlay}
      />
    </View>
  );
}