import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';

import { RootStackParamList } from '../../navigation/types';
import { styles } from './styles';

type LobbyConfirmedRouteProp = RouteProp<RootStackParamList, 'LobbyConfirmed'>;

// TODO: trocar pelo domínio real assim que existir
const INVITE_BASE_URL = 'https://corrinio.app/lobby';

export default function LobbyConfirmed() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<LobbyConfirmedRouteProp>();
  const { lobbyId, lobbyName, inviteCode } = route.params;

  const [copied, setCopied] = useState(false);
  const inviteLink = `${INVITE_BASE_URL}/${inviteCode}`;

  async function handleCopyCode() {
    await Clipboard.setStringAsync(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleShareLink() {
    try {
      await Share.share({
        message: `Entra no meu lobby "${lobbyName}": ${inviteLink}`,
      });
    } catch {
      // usuário cancelou o share sheet — não é um erro real, ignora
    }
  }

  function handleGoToLobby() {
    // TODO: navegar pra tela de detalhe do lobby quando ela existir
    navigation.navigate('Private');
  }



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={20} color="#111" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={28} color="#BCFF00" />
        </View>

        <Text style={styles.titleGreen}>lobby privado</Text>
        <Text style={styles.titleBlack}>criado</Text>

        <Text style={styles.subtitle}>
          Parabéns, seu lobby privado "{lobbyName}" foi criado. Hora de convidar seus
          amigos.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Compartilhar código do lobby</Text>
        <Text style={styles.sectionDescription}>
          Compartilhe esse código de 6 dígitos com seus amigos.
        </Text>

        <View style={styles.card}>
          <Text style={styles.code}>{inviteCode}</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleCopyCode}>
            <Ionicons
              name={copied ? 'checkmark' : 'copy-outline'}
              size={18}
              color="#111"
            />
            <Text style={styles.actionButtonText}>{copied ? 'Copiado' : 'Copiar'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionSpacing} />

        <Text style={styles.sectionTitle}>Compartilhar link de convite</Text>
        <Text style={styles.sectionDescription}>
          Ideal pra amigos que ainda não têm o app.
        </Text>

        <View style={styles.card}>
          <Text style={styles.link} numberOfLines={2}>
            {inviteLink}
          </Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleShareLink}>
            <Ionicons name="share-social-outline" size={18} color="#111" />
            <Text style={styles.actionButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footnote}>
          Você pode convidar mais amigos depois, nas configurações do lobby
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.goButton} onPress={handleGoToLobby}>
          <Text style={styles.goButtonText}>IR PARA O LOBBY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}