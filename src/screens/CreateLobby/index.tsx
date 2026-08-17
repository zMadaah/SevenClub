import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import LeaderboardRow from '../Leaderboard/components/LeaderboardRow';
import MyRankRow from '../Leaderboard/components/MyRankRow';
import { LeaderboardEntry, MyRankEntry } from '../../types/leaderboard';

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
  const [startsAt, setStartsAt] = useState<Date | null>(null);
  const [endsAt, setEndsAt] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [rankingActivityType, setRankingActivityType] = useState<'run' | 'ride'>('run');
  const [rankingEntries, setRankingEntries] = useState<LeaderboardEntry[]>([]);
  const [rankingMyRank, setRankingMyRank] = useState<MyRankEntry | null>(null);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // TODO: trocar pelo domínio real assim que existir (mesmo link usado
  // em LobbyConfirmed.tsx)
  const INVITE_BASE_URL = 'https://corrinio.app/lobby';

  async function handleCopyInviteCode() {
    if (!editingLobby) return;
    await Clipboard.setStringAsync(editingLobby.inviteCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1500);
  }

  async function handleShareInviteLink() {
    if (!editingLobby) return;
    try {
      await Share.share({
        message: `Entra no meu lobby "${editingLobby.name}": ${INVITE_BASE_URL}/${editingLobby.inviteCode}`,
      });
    } catch {
      // usuário cancelou o share sheet — não é um erro real, ignora
    }
  }

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
    setStartsAt(editingLobby.startsAt ? new Date(editingLobby.startsAt) : null);
    setEndsAt(editingLobby.endsAt ? new Date(editingLobby.endsAt) : null);
  }, [editingLobby]);

  useEffect(() => {
    if (!isEditing || !editingLobby) return;
    setRankingLoading(true);
    authApi
      .getLeaderboard(authFetch, 'lobby', rankingActivityType, editingLobby.id)
      .then((result) => {
        setRankingEntries(result.entries);
        setRankingMyRank(result.myRank);
      })
      .catch(() => {
        // ranking é um extra na tela de configurações — uma falha aqui
        // não deveria travar o resto da tela com alerta
      })
      .finally(() => setRankingLoading(false));
  }, [isEditing, editingLobby?.id, rankingActivityType, authFetch]);

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

  function handleChangeStartDate(event: DateTimePickerEvent, selectedDate?: Date) {
    setShowStartPicker(false);
    if (event.type === 'dismissed' || !selectedDate) return;
    setStartsAt(selectedDate);
    // se o fim já estava antes do novo início, empurra o fim junto —
    // evita ficar com um intervalo invertido sem a pessoa perceber
    if (endsAt && endsAt < selectedDate) {
      setEndsAt(selectedDate);
    }
  }

  function handleChangeEndDate(event: DateTimePickerEvent, selectedDate?: Date) {
    setShowEndPicker(false);
    if (event.type === 'dismissed' || !selectedDate) return;
    setEndsAt(selectedDate);
  }

  async function handleSave() {
    if (!canSave) return;

    if (startsAt && endsAt && endsAt < startsAt) {
      Alert.alert('Datas inválidas', 'O fim do evento precisa ser depois do início.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        pictureUri: pictureUri ?? undefined,
        allowPreviousImports,
        allowMemberInvitations,
        inGameChatEnabled,
        maxLobbySize: maxLobbySizeEnabled ? Number(maxLobbySize) || null : null,
        startsAt: startsAt ? startsAt.toISOString() : null,
        endsAt: endsAt ? endsAt.toISOString() : null,
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

        <Text style={styles.sectionTitle}>Duração do evento (opcional)</Text>
        <Text style={styles.emptyMembersText}>
          Defina quando o desafio deste lobby começa e termina — deixe em branco se não quiser um prazo.
        </Text>

        <View style={styles.dateRow}>
          <TouchableOpacity style={styles.dateBox} onPress={() => setShowStartPicker(true)}>
            <Ionicons name="calendar-outline" size={16} color="#111" />
            <View style={{ flex: 1 }}>
              <Text style={styles.dateLabel}>Início</Text>
              <Text style={styles.dateValue}>
                {startsAt ? startsAt.toLocaleDateString('pt-BR') : 'Selecionar'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateBox} onPress={() => setShowEndPicker(true)}>
            <Ionicons name="calendar-outline" size={16} color="#111" />
            <View style={{ flex: 1 }}>
              <Text style={styles.dateLabel}>Fim</Text>
              <Text style={styles.dateValue}>
                {endsAt ? endsAt.toLocaleDateString('pt-BR') : 'Selecionar'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {(startsAt || endsAt) && (
          <TouchableOpacity
            onPress={() => {
              setStartsAt(null);
              setEndsAt(null);
            }}
          >
            <Text style={styles.clearDatesText}>Remover datas</Text>
          </TouchableOpacity>
        )}

        {showStartPicker && (
          <DateTimePicker
            value={startsAt ?? new Date()}
            mode="date"
            display="default"
            onChange={handleChangeStartDate}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endsAt ?? startsAt ?? new Date()}
            mode="date"
            display="default"
            minimumDate={startsAt ?? undefined}
            onChange={handleChangeEndDate}
          />
        )}

        {isEditing && editingLobby && (
          <>
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>
              Participantes ({editingLobby.members.length + 1})
            </Text>

            <View style={styles.memberRow}>
              <Image source={{ uri: editingLobby.creatorAvatarUrl }} style={styles.memberAvatar} />
              <Text style={styles.memberName}>Você</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            </View>

            {editingLobby.members.length === 0 ? (
              <Text style={styles.emptyMembersText}>
                Ninguém mais entrou nesse lobby ainda — compartilhe o código de convite.
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

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Código de convite</Text>
            <Text style={styles.emptyMembersText}>
              Compartilhe pra mais gente entrar nesse lobby — funciona a qualquer momento, não só na criação.
            </Text>

            <TouchableOpacity style={styles.inviteCodeBox} onPress={handleCopyInviteCode} activeOpacity={0.7}>
              <Text style={styles.inviteCodeText}>{editingLobby.inviteCode}</Text>
              <Ionicons name={codeCopied ? 'checkmark' : 'copy-outline'} size={18} color="#111" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareInviteButton} onPress={handleShareInviteLink}>
              <Ionicons name="share-social-outline" size={16} color="#111" />
              <Text style={styles.shareInviteButtonText}>COMPARTILHAR LINK</Text>
            </TouchableOpacity>

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
