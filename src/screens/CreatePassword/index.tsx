import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';
import { styles } from './styles';

type CreatePasswordRouteProp = RouteProp<RootStackParamList, 'CreatePassword'>;

export default function CreatePassword() {
  const route = useRoute<CreatePasswordRouteProp>();
  const { login } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = password.length >= 6 && passwordsMatch && !submitting;

  async function handleCreate() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // TODO: trocar por chamada real em services/api.ts — cria a conta de
      // fato com route.params.contact + senha
      await new Promise((resolve) => setTimeout(resolve, 500));
      login(); // conta criada = já entra logado
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>crie sua{'\n'}senha</Text>

        <TextInput
          style={styles.input}
          placeholder="senha"
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
          style={[styles.createButton, !canSubmit && styles.createButtonDisabled]}
          disabled={!canSubmit}
          onPress={handleCreate}
        >
          <Text style={[styles.createText, !canSubmit && styles.createTextDisabled]}>
            {submitting ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}