import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { api, ApiError } from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './styles';

type CreatePasswordRouteProp = RouteProp<RootStackParamList, 'CreatePassword'>;

// A API já embute a checagem de senha forte (mínimo 8 caracteres); manter
// esse limite alinhado aqui evita a pessoa preencher tudo e só descobrir
// no fim, com a resposta da API, que a senha era curta demais.
const MIN_PASSWORD_LENGTH = 8;

export default function CreatePassword() {
  const route = useRoute<CreatePasswordRouteProp>();
  const { signInWithTokens } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = password.length >= MIN_PASSWORD_LENGTH && passwordsMatch && !submitting;

  async function handleCreate() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const session = await api.signupSetPassword(route.params.verificationId, password);
      await signInWithTokens(session); // conta criada = já entra logado
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível criar a conta.';
      Alert.alert('Ops', message);
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