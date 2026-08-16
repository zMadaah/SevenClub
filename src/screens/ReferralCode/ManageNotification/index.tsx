import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import SettingToggleRow from './components/SettingToggleRow';
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  NotificationPreferences,
} from '../../types/notificationPreference';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function ManageNotifications() {
  const navigation = useNavigation();
  const { authFetch } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .getNotificationPreferences(authFetch)
      .then(setPrefs)
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : 'Não foi possível carregar suas preferências.';
        Alert.alert('Ops', message);
      })
      .finally(() => setLoading(false));
  }, [authFetch]);

  function update<K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) {
    const previous = prefs;
    // atualização otimista — reage na hora, desfaz se a chamada falhar
    setPrefs((prev) => ({ ...prev, [key]: value }));
    authApi.updateNotificationPreferences(authFetch, { [key]: value }).catch((err) => {
      setPrefs(previous);
      const message = err instanceof ApiError ? err.message : 'Não foi possível salvar.';
      Alert.alert('Ops', message);
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GERENCIAR NOTIFICAÇÕES</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator color={colors.textPrimary} />
          </View>
        ) : (
          <>
        <TouchableOpacity
          style={styles.disabledBanner}
          activeOpacity={0.85}
          onPress={() => Linking.openSettings()}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.disabledBannerTitle}>Notificações push desativadas</Text>
            <Text style={styles.disabledBannerSubtitle}>
              Abra as configurações do seu telefone para ativá-las, assim você recebe avisos
              quando alguém reage às suas atividades e posts
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.accent} />
        </TouchableOpacity>

        <SettingToggleRow
          title="Curtida na atividade"
          description="Receba um aviso quando alguém curtir sua atividade"
          value={prefs.heartedActivity}
          onValueChange={(v) => update('heartedActivity', v)}
        />
        <SettingToggleRow
          title="Curtida no status"
          description="Receba um aviso quando alguém curtir seu status"
          value={prefs.heartedStatus}
          onValueChange={(v) => update('heartedStatus', v)}
        />
        <SettingToggleRow
          title="Comentário na atividade"
          description="Receba um aviso quando alguém comentar na sua atividade"
          value={prefs.commentOnActivity}
          onValueChange={(v) => update('commentOnActivity', v)}
        />
        <SettingToggleRow
          title="Comentário no status"
          description="Receba um aviso quando alguém comentar no seu status"
          value={prefs.commentOnStatus}
          onValueChange={(v) => update('commentOnStatus', v)}
        />
        <SettingToggleRow
          title="Resposta ao seu comentário"
          description="Receba um aviso quando alguém responder seu comentário"
          value={prefs.repliedToComment}
          onValueChange={(v) => update('repliedToComment', v)}
        />
        <SettingToggleRow
          title="Novo seguidor"
          description="Receba um aviso quando alguém começar a te seguir"
          value={prefs.followingYou}
          onValueChange={(v) => update('followingYou', v)}
        />
        <SettingToggleRow
          title="Solicitação de seguir"
          description="Receba um aviso quando alguém solicitar te seguir"
          value={prefs.followRequest}
          onValueChange={(v) => update('followRequest', v)}
        />
        <SettingToggleRow
          title="Pergunta respondida"
          description="Receba um aviso quando o suporte responder sua pergunta"
          value={prefs.questionAnswered}
          onValueChange={(v) => update('questionAnswered', v)}
        />

        <View style={styles.divider} />

        <SettingToggleRow
          title="Convite de lobby privado"
          description="Receba um aviso quando alguém te convidar para um lobby privado"
          value={prefs.privateLobbyInvite}
          onValueChange={(v) => update('privateLobbyInvite', v)}
        />
        <SettingToggleRow
          title="Convite de crew"
          description="Receba um aviso quando alguém te convidar para uma crew"
          value={prefs.clubInvite}
          onValueChange={(v) => update('clubInvite', v)}
        />
        <SettingToggleRow
          title="Território roubado (solo)"
          description="Receba um aviso quando seu território for roubado no modo solo"
          value={prefs.territoryStolenSingle}
          onValueChange={(v) => update('territoryStolenSingle', v)}
        />
        <SettingToggleRow
          title="Território roubado (lobby privado)"
          description="Receba um aviso quando seu território for roubado em um lobby privado"
          value={prefs.territoryStolenPrivateLobby}
          onValueChange={(v) => update('territoryStolenPrivateLobby', v)}
        />
        <SettingToggleRow
          title="Código de indicação usado"
          description="Receba um aviso quando alguém usar seu código de indicação"
          value={prefs.referralCodeUsed}
          onValueChange={(v) => update('referralCodeUsed', v)}
        />
        <SettingToggleRow
          title="Anúncios e novidades"
          description="Receba avisos sobre novas competições e funcionalidades"
          value={prefs.marketingAnnouncements}
          onValueChange={(v) => update('marketingAnnouncements', v)}
        />

        <Text style={styles.sectionTitle}>Limites de captura de território</Text>

        <SettingToggleRow
          title="5% ou menos é tomado"
          description="Avise quando uma pequena fração do meu território for capturada"
          value={prefs.captureThreshold5OrLess}
          onValueChange={(v) => update('captureThreshold5OrLess', v)}
        />
        <SettingToggleRow
          title="5% a 20% é tomado"
          description="Avise quando uma fração média do meu território for capturada"
          value={prefs.captureThreshold5To20}
          onValueChange={(v) => update('captureThreshold5To20', v)}
        />
          </>
        )}
      </ScrollView>
    </View>
  );
}