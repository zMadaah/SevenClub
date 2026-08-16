import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, NativeSyntheticEvent, TextInputKeyPressEventData, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { useActiveLobby } from '../../contexts/ActiveLobbyContext';
import { useGameMode } from '../../contexts/GameModeContext';
import { useMyLobbies } from '../../contexts/MyLobbiesContext';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './styles';

const CODE_LENGTH = 6;

export default function JoinLobby() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setActiveLobby } = useActiveLobby();
  const { setGameMode } = useGameMode();
  const { addLobby } = useMyLobbies();
  const { authFetch } = useAuth();
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const code = digits.join('');
  const canSubmit = code.length === CODE_LENGTH && !submitting;

  function handleChangeDigit(text: string, index: number) {
    // Mesmo alfabeto do gerador de código (utils/inviteCode.ts): letras e
    // números, sem 0/O/1/I. Maiúsculo porque é assim que ele é gerado —
    // convertemos aqui pra não depender do usuário digitar certo.
    const value = text.toUpperCase().replace(/[^ABCDEFGHJKLMNPQRSTUVWXYZ23456789]/g, '').slice(-1);

    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleJoin() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const joinedLobby = await authApi.joinLobby(authFetch, code);
      addLobby(joinedLobby);
      setActiveLobby(joinedLobby);
      setGameMode('private');
      navigation.navigate('Main', { screen: 'Home' });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível entrar no lobby.';
      Alert.alert('Ops', message);
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
        <Text style={styles.headerTitle}>ENTRAR NO LOBBY</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>entrar em{'\n'}um lobby</Text>
        <Text style={styles.subtitle}>Insira o código de 6 dígitos que seu amigo compartilhou.</Text>

        <View style={styles.codeRow}>
          {digits.map((digit, index) => {
            const isActive = index === focusedIndex;
            return (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[styles.codeBox, isActive && styles.codeBoxActive]}
                value={digit}
                onChangeText={(text) => handleChangeDigit(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                autoCapitalize="characters"
                maxLength={1}
                textAlign="center"
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.joinButton, !canSubmit && styles.joinButtonDisabled]}
          disabled={!canSubmit}
          onPress={handleJoin}
        >
          <Text style={styles.joinButtonText}>
            {submitting ? 'ENTRANDO...' : 'ENTRAR NO LOBBY'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}