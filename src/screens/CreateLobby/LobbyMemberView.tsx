import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { Lobby } from '../../types/lobby';
import { useActiveLobby } from '../../contexts/ActiveLobbyContext';
import { useMyLobbies } from '../../contexts/MyLobbiesContext';
import { useGameMode } from '../../contexts/GameModeContext';
import { styles } from './LobbyMemberView.styles';

interface LobbyMemberViewProps {
  lobby: Lobby;
}

export default function LobbyMemberView({ lobby }: LobbyMemberViewProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeLobby, setActiveLobby } = useActiveLobby();
  const { deleteLobby } = useMyLobbies();
  const { setGameMode } = useGameMode();

  function handleLeave() {
    Alert.alert('Sair da lobby', `Tem certeza que quer sair de "${lobby.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          // TODO: trocar por chamada real em services/api.ts assim que
          // existir — hoje isso só remove o lobby da SUA lista local,
          // não avisa o dono nem os outros membros de verdade.
          deleteLobby(lobby.id);
          if (activeLobby?.id === lobby.id) {
            setActiveLobby(null);
            setGameMode('solo');
          }
          navigation.navigate('Main', { screen: 'Home' });
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
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Participantes ({lobby.members.length})</Text>

        {lobby.members.length === 0 ? (
          <Text style={styles.emptyMembersText}>Ninguém entrou nesse lobby ainda.</Text>
        ) : (
          lobby.members.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <Image source={{ uri: member.avatarUrl }} style={styles.memberAvatar} />
              <Text style={styles.memberName}>{member.name}</Text>
            </View>
          ))
        )}
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
