import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '../../navigation/types';
import { Lobby } from '../../types/lobby';
import { useActiveLobby } from '../../contexts/ActiveLobbyContext';
import { useMyLobbies } from '../../contexts/MyLobbiesContext';
import { useGameMode } from '../../contexts/GameModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
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
  const { authFetch, userId } = useAuth();

  const lobbyId = route.params?.lobbyId;
  const editingLobby = useMemo(
    () => lobbies.find((l) => l.id === lobbyId) ?? null,
    [lobbies, lobbyId]
  );
  const isEditing = editingLobby !== null;
  const isAdmin = editingLobby ? editingLobby.creatorId === userId : true;

  const [name, setName] = useState('');
  const [pictureUri, setPictureUri] = useState<string | null>(null);
  const [allowPreviousImports, setAllowPreviousImports] = useState(true);
  const [allowMemberInvitations, setAllowMemberInvitations] = useState(false);
  const [inGameChatEnabled, setInGameChatEnabled] = useState(true);
  const [maxLobbySizeEnabled, setMaxLobbySizeEnabled] = useState(false);
  const [maxLobbySize, setMaxLobbySize] = useState('20');
  const [saving, setSaving] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);

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

  const canSave = name.trim().length > 0 && !saving && !uploadingPicture;

  // Participante (não-admin) vê uma tela bem mais simples — só
  // participantes + sair, sem acesso às configurações do lobby
  if (isEditing && editingLobby && !isAdmin) {
    return <LobbyMemberView lobby={editingLobby} />;
  }

  async function uploadPicture(localUri: string) {
    setPictureUri(localUri); // preview imediato, ainda local
    setUploadingPicture(true);
    try {
      const url = await authApi.uploadPhoto(authFetch, localUri);
      setPictureUri(url); // troca pro URL de verdade, já hospedado
    } catch (err) {
      setPictureUri(editingLobby?.pictureUri ?? null); // desfaz o preview
      const message = err instanceof ApiError ? err.message : 'Não foi possível enviar a imagem.';
      Alert.alert('Ops', message);
    } finally {
      setUploadingPicture(false);
    }
  }

  async function handlePickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets.length > 0) {
      uploadPicture(result.assets[0].uri);
    }
  }

  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar uma foto.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets.length > 0) {
      uploadPicture(result.assets[0].uri);
    }
  }

  function handlePickPicture() {
    Alert.alert('Foto do lobby', undefined, [
      { text: 'Câmera', onPress: handleTakePhoto },
      { text: 'Galeria', onPress: handlePickFromGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        pictureUri: pictureUri ?? undefined,
        allowPreviousImports,
        allowMemberInvitations,
        inGameChatEnabled,
        maxLobbySize: maxLobbySizeEnabled ? Number(maxLobbySize) || null : null,
      };

      if (isEditing && editingLobby) {
        const updatedLobby = await authApi.updateLobby(authFetch, editingLobby.id, payload);
        updateLobby(updatedLobby);
        if (activeLobby?.id === updatedLobby.id) {
          setActiveLobby(updatedLobby);
        }
        navigation.goBack();
        return;
      }

      const newLobby = await authApi.createLobby(authFetch, payload);
      addLobby(newLobby);
      setActiveLobby(newLobby);
      setGameMode('private');

      navigation.replace('LobbyConfirmed', {
        lobbyId: newLobby.id,
        lobbyName: newLobby.name,
        inviteCode: newLobby.inviteCode,
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível salvar o lobby.';
      Alert.alert('Ops', message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editingLobby) return;
    Alert.alert(
      'Apagar lobby',
      `Tem certeza que quer apagar "${editingLobby.name}"? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await authApi.deleteLobby(authFetch, editingLobby.id);
              deleteLobby(editingLobby.id);
              if (activeLobby?.id === editingLobby.id) {
                setActiveLobby(null);
                setGameMode('solo');
              }
              navigation.navigate('Main', { screen: 'Home' });
            } catch (err) {
              const message = err instanceof ApiError ? err.message : 'Não foi possível apagar o lobby.';
              Alert.alert('Ops', message);
            }
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
          <TouchableOpacity
            style={styles.pictureBox}
            onPress={handlePickPicture}
            disabled={uploadingPicture}
          >
            {pictureUri ? (
              <Image source={{ uri: pictureUri }} style={styles.pictureImage} />
            ) : (
              <Ionicons name="image-outline" size={26} color="#999" />
            )}

            {uploadingPicture && (
              <View style={[styles.pictureImage, { position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.35)' }]}>
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePickPicture} disabled={uploadingPicture}>
            <Text style={styles.addPictureText}>
              {uploadingPicture ? 'ENVIANDO...' : 'ADICIONAR FOTO (OPCIONAL)'}
            </Text>
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
            {uploadingPicture
              ? 'ENVIANDO FOTO...'
              : saving
              ? (isEditing ? 'SALVANDO...' : 'CRIANDO...')
              : (isEditing ? 'SALVAR ALTERAÇÕES' : 'CRIAR LOBBY')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
