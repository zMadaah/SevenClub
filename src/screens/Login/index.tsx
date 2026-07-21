import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function Login() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !submitting;

  function handleSocialLogin(provider: string) {
    // TODO: Google via expo-auth-session, Apple via expo-apple-authentication,
    // Strava via OAuth próprio — precisa de client id/secret e backend
    Alert.alert('Em breve', `Login com ${provider} ainda não está conectado.`);
  }

  async function handleLogin() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // TODO: trocar por chamada real em services/api.ts assim que existir
      await new Promise((resolve) => setTimeout(resolve, 500));
      login();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>bem-vindo{'\n'}de volta</Text>

        <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Google')}>
          <FontAwesome name="google" size={18} color={colors.textPrimary} />
          <Text style={styles.socialButtonText}>Continuar com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Apple')}>
          <Ionicons name="logo-apple" size={20} color={colors.textPrimary} />
          <Text style={styles.socialButtonText}>Continuar com Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Strava')}>
          <MaterialCommunityIcons name="run" size={20} color={colors.textPrimary} />
          <Text style={styles.socialButtonText}>Continuar com Strava</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

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
          placeholder="senha"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, !canSubmit && styles.loginButtonDisabled]}
          disabled={!canSubmit}
          onPress={handleLogin}
        >
          <Text style={[styles.loginButtonText, !canSubmit && styles.loginButtonTextDisabled]}>
            {submitting ? 'ENTRANDO...' : 'ENTRAR'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpRow} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>
            Não tem conta? <Text style={styles.signUpTextBold}>Criar conta</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}