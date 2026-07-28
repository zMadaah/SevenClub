import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';

import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { styles } from './styles';

type CrewConfirmedRouteProp = RouteProp<RootStackParamList, 'CrewConfirmed'>;

const INVITE_BASE_URL = 'https://sevenclub.app/crew';

export default function CrewConfirmed() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<CrewConfirmedRouteProp>();
  const { crewName, inviteCode } = route.params;

  const [copied, setCopied] = useState(false);
  const inviteLink = `${INVITE_BASE_URL}/${inviteCode}`;

  async function handleCopyCode() {
    await Clipboard.setStringAsync(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleShareLink() {
    try {
      await Share.share({ message: `Entra no meu crew "${crewName}": ${inviteLink}` });
    } catch {
      // usuário cancelou o share sheet
    }
  }

  function handleGoToCrew() {
    // TODO: navegar pra tela de detalhe do crew (membros/ranking) quando ela existir
    navigation.navigate('Main', { screen: 'Home' });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={28} color={colors.accent} />
        </View>

        <Text style={styles.titleGreen}>crew criado</Text>
        <Text style={styles.titleBlack}>com sucesso</Text>

        <Text style={styles.subtitle}>
          Parabéns, o crew "{crewName}" foi criado. Hora de chamar a galera.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Compartilhar código do crew</Text>
        <Text style={styles.sectionDescription}>Compartilhe esse código de 6 dígitos.</Text>

        <View style={styles.card}>
          <Text style={styles.code}>{inviteCode}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopyCode}>
            <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color={colors.textPrimary} />
            <Text style={styles.actionButtonText}>{copied ? 'Copiado' : 'Copiar'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionSpacing} />

        <Text style={styles.sectionTitle}>Compartilhar link de convite</Text>
        <Text style={styles.sectionDescription}>Ideal pra quem ainda não tem o app.</Text>

        <View style={styles.card}>
          <Text style={styles.link} numberOfLines={2}>{inviteLink}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleShareLink}>
            <Ionicons name="share-social-outline" size={18} color={colors.textPrimary} />
            <Text style={styles.actionButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.goButton} onPress={handleGoToCrew}>
          <Text style={styles.goButtonText}>IR PARA O CREW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}