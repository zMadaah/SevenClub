import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import OtpCodeInput from '../../components/OtpCodeInput';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function JoinCrew() {
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = code.length === 6 && !submitting;

  async function handleJoin() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // TODO: trocar por chamada real em services/api.ts assim que existir
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigation.goBack();
    } finally {
      setSubmitting(false);
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
        <Text style={styles.headerTitle}>ENTRAR NO CREW</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>entrar em{'\n'}um crew</Text>
        <Text style={styles.subtitle}>Insira o código de 6 dígitos que o dono do crew compartilhou.</Text>

        <View style={styles.codeWrapper}>
          <OtpCodeInput onChangeCode={setCode} />
        </View>

        <TouchableOpacity
          style={[styles.joinButton, !canSubmit && styles.joinButtonDisabled]}
          disabled={!canSubmit}
          onPress={handleJoin}
        >
          <Text style={styles.joinButtonText}>
            {submitting ? 'ENTRANDO...' : 'ENTRAR NO CREW'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}