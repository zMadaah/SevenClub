import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../navigation/types';
import { MOCK_MY_LOBBIES } from '../../../services/mock/lobby';
import { Lobby } from '../../../types/lobby';
import { styles } from './LobbyListModal.styles';

interface LobbyListModalProps {
  visible: boolean;
  onClose: () => void;
  activeLobby: Lobby | null;
  onSelectLobby: (lobby: Lobby) => void;
}

export default function LobbyListModal({
  visible,
  onClose,
  activeLobby,
  onSelectLobby,
}: LobbyListModalProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  function handleSelect(lobby: Lobby) {
    onSelectLobby(lobby);
    onClose();
  }

  function handleOpenSettings(lobby: Lobby) {
    // TODO: navegar pra tela de configurações do lobby quando existir
    Alert.alert('Em breve', `Configurações de "${lobby.name}" ainda não estão disponíveis.`);
  }

  function handleNewPrivateGame() {
    onClose();
    navigation.navigate('CreateLobby');
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.title}>Games</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={MOCK_MY_LOBBIES}
            keyExtractor={(item) => item.id}
            style={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => {
              const isActive = item.id === activeLobby?.id;
              return (
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => handleOpenSettings(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="settings-outline" size={18} color="#111" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.lobbyRow, isActive && styles.lobbyRowActive]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="globe-outline"
                      size={18}
                      color={isActive ? '#061414' : '#666'}
                    />
                    <Text style={[styles.lobbyName, isActive && styles.lobbyNameActive]} numberOfLines={1}>
                      {item.name}
                    </Text>

                    <View style={{ flex: 1 }} />

                    <View style={[styles.statusDot, isActive && styles.statusDotActive]}>
                      {isActive && <View style={styles.statusDotInner} />}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          <TouchableOpacity style={styles.newGameButton} onPress={handleNewPrivateGame}>
            <Text style={styles.newGameButtonText}>NEW PRIVATE GAME</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
