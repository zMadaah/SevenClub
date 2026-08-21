import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';

// Mostra a notificação mesmo com o app aberto em primeiro plano — sem
// isso, o padrão do expo-notifications é ficar em silêncio nesse caso,
// o que ia parecer "não funcionou" durante o teste.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Registra o token de push assim que o usuário autentica — uma vez por
// sessão de login, não a cada foco de tela (por isso fica no
// AuthContext, não numa tela específica).
export function usePushNotifications() {
  const { isAuthenticated, authFetch } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    (async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          return; // usuário negou — segue sem notificação, não é erro
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        if (!projectId) return; // build sem EAS configurado (ex: Expo Go puro) — sem token possível

        const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId });
        await authApi.registerPushToken(authFetch, expoPushToken);
      } catch {
        // registro de push é um extra — uma falha aqui não deveria
        // travar o app nem mostrar alerta pro usuário
      }
    })();
  }, [isAuthenticated, authFetch]);
}
