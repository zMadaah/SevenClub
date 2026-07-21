import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import OtpCodeInput from '../../components/OtpCodeInput';
import { colors } from '../../theme/colors';
import { styles } from './styles';

type VerifyCodeRouteProp = RouteProp<RootStackParamList, 'VerifyCode'>;

export default function VerifyCode() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<VerifyCodeRouteProp>();
  const { purpose, contact } = route.params;

  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = code.length === 6 && !submitting;

  async function handleVerify() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // TODO: trocar por chamada real em services/api.ts assim que existir
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (purpose === 'signup') {
        navigation.navigate('CreatePassword', { contact });
      } else {
        navigation.navigate('NewPassword', { contact });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleResend() {
    // TODO: disparar reenvio real via services/api.ts
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

        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendText}>Reenviar código</Text>
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