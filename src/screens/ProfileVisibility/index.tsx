import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ProfileVisibility as ProfileVisibilityValue } from '../../types/privacySettings';
import { colors } from '../../theme/colors';
import { styles } from './styles';

const OPTIONS: { value: ProfileVisibilityValue; label: string; description: string }[] = [
  {
    value: 'public',
    label: 'Todos',
    description:
      'Qualquer pessoa no app pode te seguir sem precisar de aprovação, e pode ver suas atividades públicas e quem você segue.',
  },
  {
    value: 'followers',
    label: 'Seguidores',
    description:
      'Quem já te segue pode ver suas corridas públicas, informações do perfil e quem você segue. Outras pessoas precisam enviar um pedido de solicitação para te seguir.',
  },
];

export default function ProfileVisibility() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<ProfileVisibilityValue>('followers');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PRIVACIDADE DO PERFIL</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Seu perfil mostra informações suas para outros usuários. Seu nome e
          foto de perfil sempre ficam visíveis, mas você pode mudar quem vê
          quem você segue e se as pessoas podem te seguir sem aprovação.
        </Text>

        {OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.optionCard, isSelected && styles.optionCardActive]}
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
      </ScrollView>
    </View>
  );
}