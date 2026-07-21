import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function NewPassword() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = password.length >= 6 && passwordsMatch && !submitting;

  async function handleReset() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // TODO: trocar por chamada real em services/api.ts
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigation.navigate('Login');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>nova{'\n'}senha</Text>

        <TextInput
          style={styles.input}
          placeholder="nova senha"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="confirmar senha"
          placeholderTextColor={colors.textMuted}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {confirmPassword.length > 0 && !passwordsMatch && (
          <Text style={styles.errorText}>As senhas não coincidem</Text>
        )}

        <TouchableOpacity
          style={[styles.resetButton, !canSubmit && styles.resetButtonDisabled]}
          disabled={!canSubmit}
          onPress={handleReset}
        >
          <Text style={[styles.resetText, !canSubmit && styles.resetTextDisabled]}>
            {submitting ? 'REDEFININDO...' : 'REDEFINIR SENHA'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}