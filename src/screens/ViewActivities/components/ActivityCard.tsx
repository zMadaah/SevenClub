import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Polygon, Polyline } from 'react-native-maps';

import { darkMapStyle } from '../../../Map/darkMapStyle';
import { ActivityFeedItem } from '../../../types/activityFeed';
import { colors } from '../../../theme/colors';
import { styles } from './ActivityCard.styles';

interface ActivityCardProps {
  item: ActivityFeedItem;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HORIZONTAL_PADDING = 16 * 2;
const MAP_WIDTH = SCREEN_WIDTH - CARD_HORIZONTAL_PADDING;

export default function ActivityCard({ item }: ActivityCardProps) {
  const [activeFrame, setActiveFrame] = useState(0);
  const [liked, setLiked] = useState(false);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / MAP_WIDTH);
    setActiveFrame(index);
  }

  function handleEdit() {
    // TODO: abrir edição real de título/descrição quando existir
    Alert.alert('Editar', 'Edição de título e descrição ainda não está conectada.');
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: item.runnerAvatarUrl }} style={styles.avatar} />
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{item.levelBadge}</Text>
          </View>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.runnerName}>{item.runnerName}</Text>
          <View style={styles.runnerMetaRow}>
            <Text style={styles.runnerMeta}>{item.createdAtLabel}</Text>
            <MaterialCommunityIcons
              name={item.activityType === 'ride' ? 'bike' : 'run'}
              size={13}
              color={colors.textSecondary}
            />
          </View>
          <Text style={styles.runnerMeta}>
            {item.location} {item.countryFlag}
          </Text>
        </View>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={handleEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="create-outline" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {item.description ? <Text style={styles.description}>{item.description}</Text> : null}

      <View style={styles.mapWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {item.routeFrames.map((frame, i) => (
            <MapView
              key={i}
              style={{ width: MAP_WIDTH, height: 220 }}
              customMapStyle={darkMapStyle}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              initialRegion={{
                latitude: frame[0].latitude,
                longitude: frame[0].longitude,
                latitudeDelta: 0.012,
                longitudeDelta: 0.012,
              }}
            >
              {item.loopClosed ? (
                <Polygon
                  coordinates={frame}
                  fillColor="transparent"
                  strokeColor={colors.accent}
                  strokeWidth={3}
                />
              ) : (
                <Polyline coordinates={frame} strokeColor={colors.accent} strokeWidth={3} />
              )}
            </MapView>
          ))}
        </ScrollView>

        {item.routeFrames.length > 1 && (
          <View style={styles.dotsRow}>
            {item.routeFrames.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeFrame && styles.dotActive]} />
            ))}
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>distância</Text>
          <Text style={styles.statValue}>
            {item.distanceKm.toFixed(2)} <Text style={styles.statUnit}>km</Text>
          </Text>
        </View>

        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>duração</Text>
          <Text style={styles.statValue}>{item.durationLabel}</Text>
        </View>

        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>vel. média</Text>
          <Text style={styles.statValue}>
            {item.avgSpeedKmh.toFixed(1)} <Text style={styles.statUnit}>km/h</Text>
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setLiked((prev) => !prev)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? '#D85A30' : colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}