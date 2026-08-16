import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import OtpCodeInput from '../../components/OtpCodeInput';
import { api, ApiError } from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './styles';

type VerifyCodeRouteProp = RouteProp<RootStackParamList, 'VerifyCode'>;

export default function VerifyCode() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<VerifyCodeRouteProp>();
  const { purpose, contact, verificationId } = route.params;

  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const canSubmit = code.length === 6 && !submitting;

  async function handleVerify() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      if (purpose === 'signup') {
        await api.signupVerifyCode(verificationId, code);
        navigation.navigate('CreatePassword', { verificationId });
      } else {
        await api.passwordResetVerifyCode(verificationId, code);
        navigation.navigate('NewPassword', { verificationId });
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível verificar o código.';
      Alert.alert('Ops', message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (resending) return;
    setResending(true);
    try {
      const { devCode } =
        purpose === 'signup'
          ? await api.signupResend(verificationId)
          : await api.passwordResetResend(verificationId);
      if (devCode) {
        Alert.alert('Código de teste', `Ambiente sem SMS configurado. Código: ${devCode}`);
      } else {
        Alert.alert('Código reenviado', `Um novo código foi enviado para ${contact}.`);
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível reenviar o código.';
      Alert.alert('Ops', message);
    } finally {
      setResending(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>confirme{'\n'}o código</Text>
        <Text style={styles.subtitle}>Enviamos um código de 6 dígitos para {contact}</Text>

        <View style={styles.codeWrapper}>
          <OtpCodeInput onChangeCode={setCode} />
        </View>

        <TouchableOpacity onPress={handleResend} disabled={resending}>
          <Text style={styles.resendText}>{resending ? 'Reenviando...' : 'Reenviar código'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.verifyButton, !canSubmit && styles.verifyButtonDisabled]}
          disabled={!canSubmit}
          onPress={handleVerify}
        >
          <Text style={[styles.verifyText, !canSubmit && styles.verifyTextDisabled]}>
            {submitting ? 'VERIFICANDO...' : 'VERIFICAR'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
