import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { Lobby } from '../../types/lobby';
import { generateInviteCode } from '../../utils/inviteCode';
import SettingToggleRow from './components/SettingToggleRow';
import { styles } from './styles';

export default function CreateLobby() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState('');
  const [pictureUri, setPictureUri] = useState<string | null>(null);
  const [allowPreviousImports, setAllowPreviousImports] = useState(true);
  const [allowMemberInvitations, setAllowMemberInvitations] = useState(false);
  const [inGameChatEnabled, setInGameChatEnabled] = useState(true);
  const [maxLobbySizeEnabled, setMaxLobbySizeEnabled] = useState(false);
  const [maxLobbySize, setMaxLobbySize] = useState('20');
  const [creating, setCreating] = useState(false);

  const inviteCode = useMemo(() => generateInviteCode(), []);
  const canCreate = name.trim().length > 0 && !creating;

  function handlePickPicture() {
    // TODO: trocar por expo-image-picker quando a dependência for instalada
    // (npx expo install expo-image-picker)
    Alert.alert('Em breve', 'Seleção de imagem ainda não está conectada.');
  }

  async function handleCreate() {
  if (!canCreate) return;
  setCreating(true);
  try {
    const newLobby: Lobby = {
      id: Date.now().toString(),
      name: name.trim(),
      pictureUri: pictureUri ?? undefined,
      allowPreviousImports,
      allowMemberInvitations,
      inGameChatEnabled,
      maxLobbySize: maxLobbySizeEnabled ? Number(maxLobbySize) || null : null,
      inviteCode,
      members: [],
      createdAt: Date.now(),
    };

    // TODO: trocar por chamada real em services/api.ts assim que existir
    await new Promise((resolve) => setTimeout(resolve, 400));

    navigation.replace('LobbyConfirmed', {
      lobbyId: newLobby.id,
      lobbyName: newLobby.name,
      inviteCode: newLobby.inviteCode,
    });
  } finally {
    setCreating(false);
  }
}

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CRIAR LOBBY</Text>
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
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, !canCreate && styles.createButtonDisabled]}
          disabled={!canCreate}
          onPress={handleCreate} 
        >
          <Text style={[styles.createText, !canCreate && styles.createTextDisabled]}>
            {creating ? 'CRIANDO...' : 'CRIAR LOBBY'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}