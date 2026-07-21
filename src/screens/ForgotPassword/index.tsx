import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { styles } from './styles';

type RecoveryMethod = 'email' | 'phone';

export default function ForgotPassword() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [method, setMethod] = useState<RecoveryMethod>('email');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = contact.trim().length > 0 && !submitting;

  async function handleSend() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // TODO: trocar por chamada real em services/api.ts — deve disparar
      // o envio do código de recuperação por e-mail ou SMS
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigation.navigate('VerifyCode', { purpose: 'reset', contact: contact.trim() });
    } finally {
      setSubmitting(false);
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
        <Text style={styles.title}>recuperar{'\n'}senha</Text>
        <Text style={styles.subtitle}>Como você quer receber o código de recuperação?</Text>

        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[styles.methodPill, method === 'email' && styles.methodPillActive]}
            onPress={() => {
              setMethod('email');
              setContact('');
            }}
          >
            <Text style={[styles.methodText, method === 'email' && styles.methodTextActive]}>
              E-mail
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.methodPill, method === 'phone' && styles.methodPillActive]}
            onPress={() => {
              setMethod('phone');
              setContact('');
            }}
          >
            <Text style={[styles.methodText, method === 'phone' && styles.methodTextActive]}>
              Celular
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder={method === 'email' ? 'e-mail' : 'celular'}
          placeholderTextColor={colors.textMuted}
          value={contact}
          onChangeText={setContact}
          autoCapitalize="none"
          keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
        />

        <TouchableOpacity
          style={[styles.sendButton, !canSubmit && styles.sendButtonDisabled]}
          disabled={!canSubmit}
          onPress={handleSend}
        >
          <Text style={[styles.sendText, !canSubmit && styles.sendTextDisabled]}>
            {submitting ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}