import React, { useState } from 'react';

import { View, Text, Image, TouchableOpacity, ScrollView, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

import { useAuth } from '../../contexts/AuthContext'
;
import UnitPreferenceModal from './components/UnitPreferenceModal';
import { UnitSystem } from '../../types/preference';

import { styles } from './styles';

export default function Profile() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [appSettingsExpanded, setAppSettingsExpanded] = useState(false);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [supportExpanded, setSupportExpanded] = useState(false);
  const { logout } = useAuth();

  const unitLabel = unitSystem === 'metric' ? 'Quilômetros e metros' : 'Milhas e pés';

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
          source={{ uri: 'https://i.pravatar.cc/200?img=10' }}
          style={styles.avatar}
        />

        <Text style={styles.name}>João Cruz</Text>

        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('MyStats')}>
          <Text style={styles.profileButtonText}>Ver perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Banner de indicação */}
      <TouchableOpacity style={styles.referralCard} activeOpacity={0.85}>
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

        <MenuItem icon="qr-code-outline" title="Inserir código de indicação" type="chevron" />
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
        <MenuItem icon="shield-outline" title="Privacidade" type="plus" />
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
        {/* <MenuItem icon="card-outline" title="Planos e compras" type="plus" />
        <MenuItem icon="git-network-outline" title="Integrações" type="plus" /> */}
        {/* <MenuItem icon="help-circle-outline" title="Perguntas frequentes" type="chevron" /> */}
        {/* <MenuItem icon="list-outline" title="Notas de atualização" type="chevron" /> */}
      </View>

      {/* Sair */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>SAIR</Text>
      </TouchableOpacity>

      <UnitPreferenceModal
        visible={unitModalVisible}
        onClose={() => setUnitModalVisible(false)}
        value={unitSystem}
        onSave={setUnitSystem}
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