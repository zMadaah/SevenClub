import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ProfileVisibility as ProfileVisibilityValue } from '../../types/privacySettings';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
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
  const { authFetch } = useAuth();
  const [selected, setSelected] = useState<ProfileVisibilityValue>('followers');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authApi
      .me(authFetch)
      .then((profile) => setSelected(profile.profileVisibility))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authFetch]);

  async function handleSelect(value: ProfileVisibilityValue) {
    const previous = selected;
    setSelected(value);
    setSaving(true);
    try {
      await authApi.updateMyProfile(authFetch, { profileVisibility: value });
    } catch (err) {
      setSelected(previous);
      const message = err instanceof ApiError ? err.message : 'Não foi possível salvar.';
      Alert.alert('Ops', message);
    } finally {
      setSaving(false);
    }
  }

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

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.textPrimary} />
        </View>
      ) : (
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
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.8}
                disabled={saving}
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
      )}
    </View>
  );
}
