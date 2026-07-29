import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ProfileVisibility as ProfileVisibilityValue } from '../../types/privacySettings';
import { colors } from '../../theme/colors';
import { styles } from './styles';

const OPTIONS: { value: ProfileVisibilityValue; label: string; description: string }[] = [
  {
    value: 'public',
    label: 'Público',
    description: 'Qualquer pessoa pode ver seu perfil, atividades e territórios',
  },
  {
    value: 'followers',
    label: 'Somente seguidores',
    description: 'Só quem te segue vê seu perfil completo',
  },
  {
    value: 'private',
    label: 'Privado',
    description: 'Ninguém vê seu perfil, atividades ou territórios',
  },
];

export default function ProfileVisibility() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<ProfileVisibilityValue>('public');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VISIBILIDADE DO PERFIL</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Escolha quem pode ver seu perfil, suas atividades e seus territórios.
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
