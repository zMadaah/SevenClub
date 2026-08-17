import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, Share, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';

import { RootStackParamList } from '../../navigation/types';
import { Lobby } from '../../types/lobby';
import { LeaderboardEntry, MyRankEntry } from '../../types/leaderboard';
import { useActiveLobby } from '../../contexts/ActiveLobbyContext';
import { useMyLobbies } from '../../contexts/MyLobbiesContext';
import { useGameMode } from '../../contexts/GameModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
import LeaderboardRow from '../Leaderboard/components/LeaderboardRow';
import MyRankRow from '../Leaderboard/components/MyRankRow';
import { styles } from './LobbyMemberView.styles';

// TODO: trocar pelo domínio real assim que existir (mesmo link usado em
// LobbyConfirmed.tsx e CreateLobby/index.tsx)
const INVITE_BASE_URL = 'https://corrinio.app/lobby';

interface LobbyMemberViewProps {
  lobby: Lobby;
}

export default function LobbyMemberView({ lobby }: LobbyMemberViewProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeLobby, setActiveLobby } = useActiveLobby();
  const { deleteLobby } = useMyLobbies();
  const { setGameMode } = useGameMode();
  const { authFetch } = useAuth();
  const [codeCopied, setCodeCopied] = useState(false);
  const [rankingActivityType, setRankingActivityType] = useState<'run' | 'ride'>('run');
  const [rankingEntries, setRankingEntries] = useState<LeaderboardEntry[]>([]);
  const [rankingMyRank, setRankingMyRank] = useState<MyRankEntry | null>(null);
  const [rankingLoading, setRankingLoading] = useState(false);

  useEffect(() => {
    setRankingLoading(true);
    authApi
      .getLeaderboard(authFetch, 'lobby', rankingActivityType, lobby.id)
      .then((result) => {
        setRankingEntries(result.entries);
        setRankingMyRank(result.myRank);
      })
      .catch(() => {
        // ranking é um extra nessa tela — uma falha aqui não deveria
        // travar o resto com um alerta
      })
      .finally(() => setRankingLoading(false));
  }, [lobby.id, rankingActivityType, authFetch]);

  async function handleCopyInviteCode() {
    await Clipboard.setStringAsync(lobby.inviteCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1500);
  }

  async function handleShareInviteLink() {
    try {
      await Share.share({
        message: `Entra no meu lobby "${lobby.name}": ${INVITE_BASE_URL}/${lobby.inviteCode}`,
      });
    } catch {
      // usuário cancelou o share sheet — não é um erro real, ignora
    }
  }

  function handleLeave() {
    Alert.alert('Sair da lobby', `Tem certeza que quer sair de "${lobby.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await authApi.leaveLobby(authFetch, lobby.id);
            deleteLobby(lobby.id);
            if (activeLobby?.id === lobby.id) {
              setActiveLobby(null);
              setGameMode('solo');
            }
            navigation.navigate('Main', { screen: 'Home' });
          } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Não foi possível sair do lobby.';
            Alert.alert('Ops', message);
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.hero}>
        <View style={styles.pictureBox}>
          {lobby.pictureUri ? (
            <Image source={{ uri: lobby.pictureUri }} style={styles.pictureImage} />
          ) : (
            <Ionicons name="people" size={30} color="#999" />
          )}
        </View>
        <Text style={styles.lobbyName}>{lobby.name}</Text>
        {(lobby.startsAt || lobby.endsAt) && (
          <Text style={styles.eventDatesText}>
            {lobby.startsAt ? new Date(lobby.startsAt).toLocaleDateString('pt-BR') : '?'}
            {' — '}
            {lobby.endsAt ? new Date(lobby.endsAt).toLocaleDateString('pt-BR') : '?'}
          </Text>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Participantes ({lobby.members.length + 1})</Text>

        <View style={styles.memberRow}>
          <Image source={{ uri: lobby.creatorAvatarUrl }} style={styles.memberAvatar} />
          <Text style={styles.memberName}>{lobby.creatorName}</Text>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
        </View>

        {lobby.members.length === 0 ? (
          <Text style={styles.emptyMembersText}>Ninguém mais entrou nesse lobby ainda.</Text>
        ) : (
          lobby.members.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <Image source={{ uri: member.avatarUrl }} style={styles.memberAvatar} />
              <Text style={styles.memberName}>{member.name}</Text>
            </View>
          ))
        )}

        <View style={styles.divider} />

        <View style={styles.rankingHeaderRow}>
          <Text style={styles.sectionTitle}>Ranking do lobby</Text>
          <TouchableOpacity
            style={styles.rankingToggle}
            onPress={() => setRankingActivityType((prev) => (prev === 'run' ? 'ride' : 'run'))}
          >
            <Ionicons name={rankingActivityType === 'ride' ? 'bicycle' : 'walk'} size={14} color="#111" />
            <Text style={styles.rankingToggleText}>
              {rankingActivityType === 'ride' ? 'Pedal' : 'Corrida'}
            </Text>
          </TouchableOpacity>
        </View>

        {rankingLoading ? (
          <ActivityIndicator color="#111" style={{ marginVertical: 12 }} />
        ) : rankingEntries.length === 0 && !rankingMyRank ? (
          <Text style={styles.emptyMembersText}>
            Ninguém marcou território nesse tipo de atividade ainda.
          </Text>
        ) : (
          <>
            {rankingMyRank && <MyRankRow myRank={rankingMyRank} />}
            {rankingEntries.map((entry) => (
              <LeaderboardRow key={entry.id} entry={entry} />
            ))}
          </>
        )}

        <>
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Código de convite</Text>
            <Text style={styles.emptyMembersText}>
              Compartilhe pra mais gente entrar nesse lobby.
            </Text>

            <TouchableOpacity style={styles.inviteCodeBox} onPress={handleCopyInviteCode} activeOpacity={0.7}>
              <Text style={styles.inviteCodeText}>{lobby.inviteCode}</Text>
              <Ionicons name={codeCopied ? 'checkmark' : 'copy-outline'} size={18} color="#111" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareInviteButton} onPress={handleShareInviteLink}>
              <Ionicons name="share-social-outline" size={16} color="#111" />
              <Text style={styles.shareInviteButtonText}>COMPARTILHAR LINK</Text>
            </TouchableOpacity>
          </>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.leaveButton} onPress={handleLeave}>
          <Ionicons name="exit-outline" size={16} color="#D85A30" />
          <Text style={styles.leaveButtonText}>SAIR DA LOBBY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
