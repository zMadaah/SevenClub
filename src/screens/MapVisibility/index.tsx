import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { MapVisibility as MapVisibilityValue } from '../../types/privacySettings';
import { colors } from '../../theme/colors';
import { styles } from './styles';

const OPTIONS: { value: MapVisibilityValue; label: string; description: string }[] = [
  {
    value: 'everyone',
    label: 'Todos',
    description: 'Qualquer pessoa pode ver seu território dominado no mapa',
  },
  {
    value: 'crew',
    label: 'Somente meu crew',
    description: 'Só quem está no seu crew vê o território que você domina',
  },
  {
    value: 'nobody',
    label: 'Ninguém',
    description: 'Seu território aparece no mapa sem identificar você',
  },
];

export default function MapVisibility() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<MapVisibilityValue>('everyone');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VISIBILIDADE DO MAPA</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Escolha quem pode ver que você é dono de um território no mapa.
        </Text>

        {OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.optionRow, isSelected && styles.optionRowActive]}
              onPress={() => setSelected(option.value)}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>

              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
