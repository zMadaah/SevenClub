import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

import Header from '../../Header';
import Map from '../../Map';
import LobbyListModal from './components/LobbyListModal';
import { useActiveLobby } from '../../contexts/ActiveLobbyContext';
import { MOCK_ACTIVE_LOBBY } from '../../services/mock/lobby';

import { styles } from './styles';
import { ActivityMode, GameMode } from '../../Header/types';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<GameMode>('solo');
  const [activityMode, setActivityMode] = useState<ActivityMode>('running');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeLobby, setActiveLobby } = useActiveLobby();
  const [lobbyModalVisible, setLobbyModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Map />

      <Header
        avatar="https://i.pravatar.cc/150?img=10"
        username="João"
        selectedCategory={selectedCategory}
        activityMode={activityMode}
        onCategoryChange={setSelectedCategory}
        onActivityChange={setActivityMode}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {activeLobby && (
        <TouchableOpacity
          style={styles.lobbyPill}
          onPress={() => setLobbyModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.lobbyPillText} numberOfLines={1}>
            {activeLobby.name}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#E9EBE6" />
        </TouchableOpacity>
      )}

      {activeLobby?.inGameChatEnabled && (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('LobbyChat')}
          activeOpacity={0.85}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="#E9EBE6" />
        </TouchableOpacity>
      )}

      {/* DEV: atalho só pra testar/visualizar a pill e o chat sem passar
          pelo fluxo inteiro de criar lobby — remover antes de produção */}
      {!activeLobby && (
        <TouchableOpacity
          style={styles.devSeedButton}
          onPress={() => setActiveLobby(MOCK_ACTIVE_LOBBY)}
        >
          <Ionicons name="flask-outline" size={12} color="#061414" />
          <Text style={styles.devSeedButtonText}>Carregar lobby de teste</Text>
        </TouchableOpacity>
      )}

      <LobbyListModal
        visible={lobbyModalVisible}
        onClose={() => setLobbyModalVisible(false)}
        activeLobby={activeLobby}
        onSelectLobby={setActiveLobby}
      />
    </View>
  );
}
