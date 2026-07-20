import React from 'react';
import { Modal, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { styles } from './MapOptionsModal.styles';

interface MapOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  showRoutesOverlay: boolean;
  onToggleRoutesOverlay: (value: boolean) => void;
}

export default function MapOptionsModal({
  visible,
  onClose,
  showRoutesOverlay,
  onToggleRoutesOverlay,
}: MapOptionsModalProps) {
  function handleTerritoriesPress() {
    Alert.alert('Recurso Pro', 'A sobreposição de territórios está disponível no plano Pro.');
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Opções</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Sobreposições do mapa</Text>

          <TouchableOpacity
            style={styles.row}
            onPress={handleTerritoriesPress}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="vector-polygon" size={20} color="#111" />
              <Text style={styles.rowText}>Territórios</Text>
            </View>

            <View style={styles.proBadgeRow}>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
              <Ionicons name="lock-closed" size={16} color="#1D9E75" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => onToggleRoutesOverlay(!showRoutesOverlay)}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="vector-polyline" size={20} color="#111" />
              <Text style={styles.rowText}>Rotas</Text>
            </View>

            <View style={[styles.checkbox, showRoutesOverlay && styles.checkboxChecked]}>
              {showRoutesOverlay && <Ionicons name="checkmark" size={14} color="#111" />}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}