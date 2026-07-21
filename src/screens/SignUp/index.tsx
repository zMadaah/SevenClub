import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function SignUp() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    name.trim().length > 0 && email.trim().length > 0 && phone.trim().length > 0 && !submitting;

  async function handleContinue() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // TODO: trocar por chamada real em services/api.ts — deve disparar
      // o envio do código de ativação por SMS/e-mail no backend
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigation.navigate('VerifyCode', { purpose: 'signup', contact: email.trim() });
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
        <Text style={styles.headerTitle}>CRIAR CONTA</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>vamos{'\n'}começar</Text>

        <TextInput
          style={styles.input}
          placeholder="nome completo"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="e-mail"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="celular"
          placeholderTextColor={colors.textMuted}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={[styles.continueButton, !canSubmit && styles.continueButtonDisabled]}
          disabled={!canSubmit}
          onPress={handleContinue}
        >
          <Text style={[styles.continueText, !canSubmit && styles.continueTextDisabled]}>
            {submitting ? 'ENVIANDO...' : 'CONTINUAR'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}