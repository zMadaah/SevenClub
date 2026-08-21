import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

import Header from '../../Header';
import Map from '../../Map';
import LobbyListModal from './components/LobbyListModal';
import { useActiveLobby } from '../../contexts/ActiveLobbyContext';
import { useMyLobbies } from '../../contexts/MyLobbiesContext';
import { useGameMode } from '../../contexts/GameModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, MyProfile } from '../../services/api';

import { styles } from './styles';
import { ActivityMode } from '../../Header/types';

export default function Home() {
  // gameMode vem do GameModeContext — é a mesma fonte que CreateLobby e
  // JoinLobby já atualizavam (setGameMode('private')) antes desta
  // correção. Sem isso, criar/entrar num lobby não fazia a Home refletir
  // o modo Private nunca, mesmo com o activeLobby certo.
  const { gameMode, setGameMode } = useGameMode();
  const [activityMode, setActivityMode] = useState<ActivityMode>('running');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeLobby, setActiveLobby } = useActiveLobby();
  const [lobbyModalVisible, setLobbyModalVisible] = useState(false);
  const { authFetch, userId } = useAuth();
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [territoryLabel, setTerritoryLabel] = useState('0,00 km²');
  const { refreshLobbies } = useMyLobbies();

  // Sem isso, "activeLobby" nasce null toda vez que o app abre — mesmo o
  // lobby continuando salvo no banco. É por isso que fechar e reabrir o
  // app fazia parecer que o lobby tinha sumido: o dado nunca foi
  // perdido, só nunca era buscado de novo no início.
  useEffect(() => {
    if (!userId || activeLobby) return;
    refreshLobbies().then((result) => {
      if (result.length > 0) {
        setActiveLobby(result[0]);
      }
    });
  }, [userId]);

  // useFocusEffect (não useEffect): a Home fica montada o tempo todo por
  // trás de outras telas — sem isso, editar a foto em EditProfile e
  // voltar pra Home não atualizava o avatar do cabeçalho. Mesma lógica
  // vale pro território: sem isso, terminar uma atividade e voltar pra
  // Home nunca atualizava o "0,00 km²" que ficava parado desde sempre —
  // na real, essa prop nunca tinha sido conectada a dado nenhum antes.
  useFocusEffect(
    useCallback(() => {
      authApi
        .me(authFetch)
        .then(setProfile)
        .catch(() => {
          // cabeçalho funciona com o avatar genérico se isso falhar
        });

      const type = activityMode === 'cycling' ? 'ride' : 'run';
      authApi
        .getProgressSummary(authFetch, type)
        .then((summary) => {
          const km2 = summary.territoryM2 / 1_000_000;
          setTerritoryLabel(`${km2.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km²`);
        })
        .catch(() => {
          // mapa funciona com o placeholder se isso falhar
        });
    }, [authFetch, activityMode])
  );

  return (
    <View style={styles.container}>
      <Map activityType={activityMode === 'cycling' ? 'ride' : 'run'} territory={territoryLabel} />

      <Header
        avatar={profile?.avatarUrl ?? undefined}
        username={profile?.displayName ?? 'João'}
        selectedCategory={gameMode}
        activityMode={activityMode}
        onCategoryChange={setGameMode}
        onActivityChange={setActivityMode}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {gameMode === 'private' && activeLobby && (
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

      {gameMode === 'private' && activeLobby?.inGameChatEnabled && (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('LobbyChat')}
          activeOpacity={0.85}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="#E9EBE6" />
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
