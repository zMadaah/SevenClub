import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { api, ApiError } from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './styles';

type NewPasswordRouteProp = RouteProp<RootStackParamList, 'NewPassword'>;

const MIN_PASSWORD_LENGTH = 8;

export default function NewPassword() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<NewPasswordRouteProp>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = password.length >= 6 && passwordsMatch && !submitting;

  async function handleReset() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await api.passwordResetComplete(route.params.verificationId, password);
      // redefinir a senha derruba todas as sessões (ver backend) — por
      // segurança, a pessoa faz login de novo com a senha nova, não entra
      // direto
      Alert.alert('Pronto', 'Senha redefinida. Faça login com sua nova senha.');
      navigation.navigate('Login');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível redefinir a senha.';
      Alert.alert('Ops', message);
    } finally {
      setSubmitting(false);
    }
  }

     return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>nova{'\n'}senha</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputWithIcon}
            placeholder="nova senha"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputWithIcon}
            placeholder="confirmar senha"
            placeholderTextColor={colors.textMuted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword((prev) => !prev)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

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