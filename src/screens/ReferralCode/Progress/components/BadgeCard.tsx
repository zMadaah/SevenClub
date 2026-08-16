import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { BadgeWithStatus } from '../../../types/badge';
import { colors } from '../../../theme/colors';
import { styles } from './BadgeCard.styles';

interface BadgeCardProps {
  badge: BadgeWithStatus;
  onPress: () => void;
}

export default function BadgeCard({ badge, onPress }: BadgeCardProps) {
  const IconComponent = badge.iconLib === 'mci' ? MaterialCommunityIcons : Ionicons;

  return (
    <TouchableOpacity
      style={[styles.card, !badge.unlocked && styles.cardLocked]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.iconCircle, !badge.unlocked && styles.iconCircleLocked]}>
        <IconComponent
          name={badge.icon as any}
          size={26}
          color={badge.unlocked ? colors.richBlack : colors.ceilingWhite}
        />
      </View>

      {!badge.unlocked && (
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={10} color={colors.ceilingWhite} />
        </View>
      )}

      <Text style={styles.name} numberOfLines={2}>
        {badge.name}
      </Text>
    </TouchableOpacity>
  );
}
