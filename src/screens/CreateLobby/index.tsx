import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { Lobby } from '../../types/lobby';
import { useActiveLobby } from '../../contexts/ActiveLobbyContext';
import { useMyLobbies } from '../../contexts/MyLobbiesContext';
import { useGameMode } from '../../contexts/GameModeContext';
import { CURRENT_USER_ID } from '../../constants/currentUser';
import { generateInviteCode } from '../../utils/inviteCode';
import SettingToggleRow from './components/SettingToggleRow';
import LobbyMemberView from './LobbyMemberView';
import { styles } from './styles';

type CreateLobbyRouteProp = RouteProp<RootStackParamList, 'CreateLobby'>;

export default function CreateLobby() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<CreateLobbyRouteProp>();
  const { activeLobby, setActiveLobby } = useActiveLobby();
  const { lobbies, addLobby, updateLobby, deleteLobby } = useMyLobbies();
  const { setGameMode } = useGameMode();

  const lobbyId = route.params?.lobbyId;
  const editingLobby = useMemo(
    () => lobbies.find((l) => l.id === lobbyId) ?? null,
    [lobbies, lobbyId]
  );
  const isEditing = editingLobby !== null;
  const isAdmin = editingLobby ? editingLobby.creatorId === CURRENT_USER_ID : true;

  const [name, setName] = useState('');
  const [pictureUri, setPictureUri] = useState<string | null>(null);
  const [allowPreviousImports, setAllowPreviousImports] = useState(true);
  const [allowMemberInvitations, setAllowMemberInvitations] = useState(false);
  const [inGameChatEnabled, setInGameChatEnabled] = useState(true);
  const [maxLobbySizeEnabled, setMaxLobbySizeEnabled] = useState(false);
  const [maxLobbySize, setMaxLobbySize] = useState('20');
  const [saving, setSaving] = useState(false);

  const newInviteCode = useMemo(() => generateInviteCode(), []);

  // Pré-preenche o formulário quando abrir em modo edição
  useEffect(() => {
    if (!editingLobby) return;
    setName(editingLobby.name);
    setPictureUri(editingLobby.pictureUri ?? null);
    setAllowPreviousImports(editingLobby.allowPreviousImports);
    setAllowMemberInvitations(editingLobby.allowMemberInvitations);
    setInGameChatEnabled(editingLobby.inGameChatEnabled);
    setMaxLobbySizeEnabled(editingLobby.maxLobbySize !== null);
    if (editingLobby.maxLobbySize !== null) {
      setMaxLobbySize(String(editingLobby.maxLobbySize));
    }
  }, [editingLobby]);

  const canSave = name.trim().length > 0 && !saving;

  // Participante (não-admin) vê uma tela bem mais simples — só
  // participantes + sair, sem acesso às configurações do lobby
  if (isEditing && editingLobby && !isAdmin) {
    return <LobbyMemberView lobby={editingLobby} />;
  }

  function handlePickPicture() {
    // TODO: trocar por expo-image-picker quando a dependência for instalada
    // (npx expo install expo-image-picker)
    Alert.alert('Em breve', 'Seleção de imagem ainda não está conectada.');
  }

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      // TODO: trocar por chamada real em services/api.ts assim que existir
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (isEditing && editingLobby) {
        const updatedLobby: Lobby = {
          ...editingLobby,
          name: name.trim(),
          pictureUri: pictureUri ?? undefined,
          allowPreviousImports,
          allowMemberInvitations,
          inGameChatEnabled,
          maxLobbySize: maxLobbySizeEnabled ? Number(maxLobbySize) || null : null,
        };

        updateLobby(updatedLobby);
        if (activeLobby?.id === updatedLobby.id) {
          setActiveLobby(updatedLobby);
        }
        navigation.goBack();
        return;
      }

      const newLobby: Lobby = {
        id: Date.now().toString(),
        name: name.trim(),
        pictureUri: pictureUri ?? undefined,
        creatorId: CURRENT_USER_ID,
        allowPreviousImports,
        allowMemberInvitations,
        inGameChatEnabled,
        maxLobbySize: maxLobbySizeEnabled ? Number(maxLobbySize) || null : null,
        inviteCode: newInviteCode,
        members: [],
        createdAt: Date.now(),
      };

      addLobby(newLobby);
      setActiveLobby(newLobby);

      navigation.replace('LobbyConfirmed', {
        lobbyId: newLobby.id,
        lobbyName: newLobby.name,
        inviteCode: newLobby.inviteCode,
      });
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!editingLobby) return;
    Alert.alert(
      'Apagar lobby',
      `Tem certeza que quer apagar "${editingLobby.name}"? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: () => {
            deleteLobby(editingLobby.id);
            if (activeLobby?.id === editingLobby.id) {
              setActiveLobby(null);
              setGameMode('solo');
            }
            navigation.navigate('Main', { screen: 'Home' });
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'CONFIGURAR LOBBY' : 'CRIAR LOBBY'}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Detalhes do lobby</Text>

        <View style={styles.pictureRow}>
          <TouchableOpacity style={styles.pictureBox} onPress={handlePickPicture}>
            {pictureUri ? (
              <Image source={{ uri: pictureUri }} style={styles.pictureImage} />
            ) : (
              <Ionicons name="image-outline" size={26} color="#999" />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePickPicture}>
            <Text style={styles.addPictureText}>ADICIONAR FOTO (OPCIONAL)</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.nameInput}
          placeholder="Nome do lobby"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Configurações do lobby</Text>

        <SettingToggleRow
          title="Permitir importações anteriores"
          description="Deixar novos membros importarem suas corridas já existentes"
          value={allowPreviousImports}
          onValueChange={setAllowPreviousImports}
        />

        <SettingToggleRow
          title="Convites de membros"
          description="Permitir que membros convidem outras pessoas"
          value={allowMemberInvitations}
          onValueChange={setAllowMemberInvitations}
        />

        <SettingToggleRow
          title="Chat do jogo"
          description="Permitir que membros conversem dentro do lobby"
          value={inGameChatEnabled}
          onValueChange={setInGameChatEnabled}
        />

        <SettingToggleRow
          title="Tamanho máximo do lobby"
          description="Definir um número máximo de membros no lobby"
          value={maxLobbySizeEnabled}
          onValueChange={setMaxLobbySizeEnabled}
        />

        {maxLobbySizeEnabled && (
          <View style={styles.maxSizeInputRow}>
            <Text style={styles.maxSizeLabel}>Máximo de membros</Text>
            <TextInput
              style={styles.maxSizeInput}
              keyboardType="number-pad"
              value={maxLobbySize}
              onChangeText={setMaxLobbySize}
              maxLength={3}
            />
          </View>
        )}

        {isEditing && editingLobby && (
          <>
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>
              Participantes ({editingLobby.members.length})
            </Text>

            {editingLobby.members.length === 0 ? (
              <Text style={styles.emptyMembersText}>
                Ninguém entrou nesse lobby ainda — compartilhe o código de convite.
              </Text>
            ) : (
              editingLobby.members.map((member) => (
                <View key={member.id} style={styles.memberRow}>
                  <Image source={{ uri: member.avatarUrl }} style={styles.memberAvatar} />
                  <Text style={styles.memberName}>{member.name}</Text>
                </View>
              ))
            )}

            <View style={styles.divider} />

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={16} color="#D85A30" />
              <Text style={styles.deleteButtonText}>APAGAR LOBBY</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, !canSave && styles.createButtonDisabled]}
          disabled={!canSave}
          onPress={handleSave}
        >
          <Text style={[styles.createText, !canSave && styles.createTextDisabled]}>
            {saving
              ? (isEditing ? 'SALVANDO...' : 'CRIANDO...')
              : (isEditing ? 'SALVAR ALTERAÇÕES' : 'CRIAR LOBBY')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
