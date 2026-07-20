import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { styles } from './FloatingControls.styles';

interface FloatingControlsProps {
  territory: string;
  onLocationPress: () => void;
}

export default function FloatingControls({
  territory,
  onLocationPress,
}: FloatingControlsProps) {
  return (
    <View style={styles.floatingContainer}>
      <View style={styles.territoryBadge}>
        <MaterialIcons name="hexagon" size={14} color="#bcff00"/>
        <Text style={styles.territoryText}>
          {territory}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={onLocationPress}
      >
        <Ionicons name="locate" size={20} color="#E9EBE6"/>
      </TouchableOpacity>
    </View>
  );
}