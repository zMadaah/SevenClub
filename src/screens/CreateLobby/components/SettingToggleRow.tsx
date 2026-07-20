import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './SettingToggleRow.styles';

interface SettingToggleRowProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function SettingToggleRow({
  title,
  description,
  value,
  onValueChange,
}: SettingToggleRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <TouchableOpacity
        style={[styles.toggle, value && styles.toggleOn]}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.8}
      >
        <View style={[styles.thumb, value && styles.thumbOn]} />
      </TouchableOpacity>
    </View>
  );
}