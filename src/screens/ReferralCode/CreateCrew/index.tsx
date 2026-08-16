import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { Crew } from '../../types/crew';
import { generateInviteCode } from '../../utils/inviteCode';
import SettingToggleRow from '../CreateLobby/components/SettingToggleRow';

import { useActiveCrew } from '../../contexts/ActiveCrewContext';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function CreateCrew() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setActiveCrew } = useActiveCrew();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [pictureUri, setPictureUri] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [allowPreviousImports, setAllowPreviousImports] = useState(true);
  const [allowMemberInvitations, setAllowMemberInvitations] = useState(true);
  const [inGameChatEnabled, setInGameChatEnabled] = useState(true);
  const [maxCrewSizeEnabled, setMaxCrewSizeEnabled] = useState(false);
  const [maxCrewSize, setMaxCrewSize] = useState('20');
  const [creating, setCreating] = useState(false);

  const inviteCode = useMemo(() => generateInviteCode(), []);
  const canCreate = name.trim().length > 0 && city.trim().length > 0 && !creating;

  function handlePickPicture() {
    // TODO: trocar por expo-image-picker quando a dependência for instalada
    Alert.alert('Em breve', 'Seleção de imagem ainda não está conectada.');
  }

  async function handleCreate() {
    if (!canCreate) return;
    setCreating(true);
    try {
      const newCrew: Crew = {
        id: Date.now().toString(),
        name: name.trim(),
        pictureUri: pictureUri ?? undefined,
        city: city.trim(),
        isPublic,
        allowPreviousImports,
        allowMemberInvitations,
        inGameChatEnabled,
        maxCrewSize: maxCrewSizeEnabled ? Number(maxCrewSize) || null : null,
        inviteCode,
        members: [],
        createdAt: Date.now(),
      };

      // TODO: trocar por chamada real em services/api.ts assim que existir
      await new Promise((resolve) => setTimeout(resolve, 400));

      setActiveCrew(newCrew);

      navigation.replace('CrewConfirmed', {
        crewId: newCrew.id,
        crewName: newCrew.name,
        inviteCode: newCrew.inviteCode,
      });
    } finally {
      setCreating(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CRIAR CREW</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Detalhes do crew</Text>

        <View style={styles.pictureRow}>
          <TouchableOpacity style={styles.pictureBox} onPress={handlePickPicture}>
            {pictureUri ? (
              <Image source={{ uri: pictureUri }} style={styles.pictureImage} />
            ) : (
              <Ionicons name="image-outline" size={26} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePickPicture}>
            <Text style={styles.addPictureText}>ADICIONAR FOTO DO CREW (OPCIONAL)</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.nameInput}
          placeholder="Nome do crew"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.nameInput}
          placeholder="Cidade / bairro"
          placeholderTextColor={colors.textMuted}
          value={city}
          onChangeText={setCity}
        />

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Configurações do crew</Text>

        <SettingToggleRow
          title="Crew público"
          description="Aparecer na busca para corredores da mesma região encontrarem"
          value={isPublic}
          onValueChange={setIsPublic}
        />

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
          title="Chat do crew"
          description="Permitir que membros conversem dentro do crew"
          value={inGameChatEnabled}
          onValueChange={setInGameChatEnabled}
        />

        <SettingToggleRow
          title="Tamanho máximo do crew"
          description="Definir um número máximo de membros"
          value={maxCrewSizeEnabled}
          onValueChange={setMaxCrewSizeEnabled}
        />

        {maxCrewSizeEnabled && (
          <View style={styles.maxSizeInputRow}>
            <Text style={styles.maxSizeLabel}>Máximo de membros</Text>
            <TextInput
              style={styles.maxSizeInput}
              keyboardType="number-pad"
              value={maxCrewSize}
              onChangeText={setMaxCrewSize}
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
            {creating ? 'CRIANDO...' : 'CRIAR CREW'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}