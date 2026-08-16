import React, { useCallback, useState } from 'react';

import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError, MyProfile } from '../../services/api';
import UnitPreferenceModal from './components/UnitPreferenceModal';
import AnonymousModeModal from './components/AnonymousModeModal';
import { UnitSystem } from '../../types/preference';

import { styles } from './styles';

export default function Profile() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [appSettingsExpanded, setAppSettingsExpanded] = useState(false);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [privacyExpanded, setPrivacyExpanded] = useState(false);
  const [plansExpanded, setPlansExpanded] = useState(false);
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [anonymousModalVisible, setAnonymousModalVisible] = useState(false);
  const [supportExpanded, setSupportExpanded] = useState(false);
  const { authFetch, signOut } = useAuth();
  const [profile, setProfile] = useState<MyProfile | null>(null);

  // useFocusEffect (não useEffect) de propósito: o React Navigation não
  // desmonta essa tela ao voltar do EditProfile, só esconde e mostra de
  // novo — um useEffect comum não rodaria de novo, e o cabeçalho ficaria
  // com a foto/nome antigos até recarregar o app inteiro.
  useFocusEffect(
    useCallback(() => {
      authApi
        .me(authFetch)
        .then(setProfile)
        .catch(() => {
          // tela funciona com o nome/avatar genérico se isso falhar — não
          // vale travar a tela de configurações com um alerta por causa disso
        });
    }, [authFetch])
  );

  const unitLabel = unitSystem === 'metric' ? 'Quilômetros e metros' : 'Milhas e pés';

  function handleToggleAnonymous() {
    if (anonymousMode) {
      // desligar não precisa de confirmação, só ligar exige entender o aviso primeiro
      setAnonymousMode(false);
      return;
    }
    setAnonymousModalVisible(true);
  }

  function handleConfirmAnonymous() {
    setAnonymousMode(true);
    setAnonymousModalVisible(false);
  }

  function handleRemoveTerraData() {
    Alert.alert(
      'Remover dados',
      'Isso vai apagar permanentemente seus dados de território e atividade. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await authApi.deleteMyData(authFetch);
              Alert.alert('Pronto', 'Seus dados de atividade e território foram removidos.');
            } catch (err) {
              const message = err instanceof ApiError ? err.message : 'Não foi possível remover seus dados.';
              Alert.alert('Ops', message);
            }
          },
        },
      ]
    );
  }

  function handleManageSubscription() {
    // TODO: navegar para tela real de assinatura/paywall quando existir
    Alert.alert('Em breve', 'A tela de assinatura Pro ainda não está disponível.');
  }

  function handleRestorePurchases() {
    // TODO: conectar com a store real (App Store/Google Play) via
    // expo-in-app-purchases ou RevenueCat quando o app tiver produtos configurados
    Alert.alert('Restaurar compras', 'Nenhuma compra anterior foi encontrada.');
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header fixo */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>CONFIGURAÇÕES</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* Perfil */}
      <View style={styles.header}>
        <Image
          source={{ uri: profile?.avatarUrl || 'https://i.pravatar.cc/200?img=10' }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{profile?.displayName ?? '...'}</Text>

        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('MyStats')}>
          <Text style={styles.profileButtonText}>Ver perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Banner de indicação */}
      <TouchableOpacity
        style={styles.referralCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ReferralCode')}
      >
        <View style={styles.referralIcon}>
          <Ionicons name="people-outline" size={22} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.referralTitle}>Indique um amigo</Text>
          <Text style={styles.referralSubtitle}>
            Ganhe pontos por cada amigo indicado e dê a ele um desconto no Pro
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#5DCAA5" />
      </TouchableOpacity>

      {/* Menu */}
      <View style={styles.menu}>
        <MenuItem icon="search-outline" title="Adicionar amigos" type="chevron"
          onPress={() => navigation.navigate('AddFriend')}
        />

        <MenuItem icon="qr-code-outline" title="Inserir código de indicação" type="chevron"
          onPress={() => navigation.navigate('ReferralCode')}
         />
        <MenuItem icon="create-outline" title="Editar perfil" type="chevron"
          onPress={() => navigation.navigate('EditProfile')}
        />
        {!appSettingsExpanded ? (
          <MenuItem
            icon="options-outline"
            title="Configurações do app"
            type="plus"
            onPress={() => setAppSettingsExpanded(true)}
          />
        ) : (
          <View style={styles.appSettingsCard}>
            <TouchableOpacity
              style={styles.appSettingsHeader}
              onPress={() => setAppSettingsExpanded(false)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="options-outline" size={22} color="#111" />
                <Text style={styles.menuTitle}>Configurações do app</Text>
              </View>
              <Ionicons name="remove" size={22} color="#111" />
            </TouchableOpacity>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Notificações</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ManageNotifications')}>
                <Text style={styles.settingValue}>Gerenciar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Unidades e medidas</Text>
              <TouchableOpacity onPress={() => setUnitModalVisible(true)}>
                <Text style={styles.settingValue}>{unitLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {!privacyExpanded ? (
          <MenuItem
            icon="shield-outline"
            title="Privacidade"
            type="plus"
            onPress={() => setPrivacyExpanded(true)}
          />
        ) : (
          <View style={styles.appSettingsCard}>
            <TouchableOpacity
              style={styles.appSettingsHeader}
              onPress={() => setPrivacyExpanded(false)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="shield-outline" size={22} color="#111" />
                <Text style={styles.menuTitle}>Privacidade</Text>
              </View>
              <Ionicons name="remove" size={22} color="#111" />
            </TouchableOpacity>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Modo anônimo</Text>
              <TouchableOpacity
                style={[styles.privacyToggle, anonymousMode && styles.privacyToggleOn]}
                onPress={handleToggleAnonymous}
              >
                <View style={[styles.privacyToggleThumb, anonymousMode && styles.privacyToggleThumbOn]} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Visibilidade do mapa</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MapVisibility')}>
                <Text style={styles.settingValue}>Gerenciar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Visibilidade do perfil</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ProfileVisibility')}>
                <Text style={styles.settingValue}>Gerenciar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Usuários bloqueados</Text>
              <TouchableOpacity onPress={() => navigation.navigate('BlockedUsers')}>
                <Text style={styles.settingValue}>Gerenciar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Remover dados</Text>
              <TouchableOpacity onPress={handleRemoveTerraData}>
                <Text style={styles.settingValueDanger}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {!supportExpanded ? (
          <MenuItem
            icon="chatbubble-ellipses-outline"
            title="Suporte"
            type="plus"
            onPress={() => setSupportExpanded(true)}
          />
        ) : (
          <View style={styles.appSettingsCard}>
            <TouchableOpacity
              style={styles.appSettingsHeader}
              onPress={() => setSupportExpanded(false)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="chatbubble-ellipses-outline" size={22} color="#111" />
                <Text style={styles.menuTitle}>Suporte</Text>
              </View>
              <Ionicons name="remove" size={22} color="#111" />
            </TouchableOpacity>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Chat</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SupportChat')}>
                <Text style={styles.settingValue}>Relatar um problema</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {!plansExpanded ? (
          <MenuItem
            icon="card-outline"
            title="Planos e compras"
            type="plus"
            onPress={() => setPlansExpanded(true)}
          />
        ) : (
          <View style={styles.appSettingsCard}>
            <TouchableOpacity
              style={styles.appSettingsHeader}
              onPress={() => setPlansExpanded(false)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="card-outline" size={22} color="#111" />
                <Text style={styles.menuTitle}>Planos e compras</Text>
              </View>
              <Ionicons name="remove" size={22} color="#111" />
            </TouchableOpacity>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Assinatura</Text>
              <TouchableOpacity onPress={handleManageSubscription}>
                <Text style={styles.settingValue}>Assinar Pro</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Restaurar compras</Text>
              <TouchableOpacity onPress={handleRestorePurchases}>
                <Text style={styles.settingValue}>Restaurar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* <MenuItem icon="git-network-outline" title="Integrações" type="plus" />  */}
        {/* <MenuItem icon="help-circle-outline" title="Perguntas frequentes" type="chevron" /> */}
      </View>

      {/* Sair */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
        <Text style={styles.logoutText}>SAIR</Text>
      </TouchableOpacity>

      <UnitPreferenceModal
        visible={unitModalVisible}
        onClose={() => setUnitModalVisible(false)}
        value={unitSystem}
        onSave={setUnitSystem}
      />

      <AnonymousModeModal
        visible={anonymousModalVisible}
        onClose={() => setAnonymousModalVisible(false)}
        onConfirm={handleConfirmAnonymous}
      />

    </ScrollView>
  );
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  type?: 'chevron' | 'plus' | 'expandable';
  expanded?: boolean;
  onPress?: () => void;
}

function MenuItem({ icon, title, type = 'chevron', onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color="#333" />
        <Text style={styles.menuTitle}>{title}</Text>
      </View>

      <Ionicons
        name={type === 'plus' ? 'add' : 'chevron-forward'}
        size={22}
        color="#999"
      />
    </TouchableOpacity>
  );
}



interface SubMenuItemProps {
  title: string;
  onPress?: () => void;
}

function SubMenuItem({ title, onPress }: SubMenuItemProps) {
  return (
    <TouchableOpacity style={styles.subMenuItem} onPress={onPress}>
      <Text style={styles.subMenuTitle}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  );
}