import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { ActivityType } from '../../../types/lobby';
import { styles } from './ActivityTypeModal.styles';

interface ActivityTypeModalProps {
  visible: boolean;
  onClose: () => void;
  value: ActivityType;
  onSelect: (type: ActivityType) => void;
}

export default function ActivityTypeModal({
  visible,
  onClose,
  value,
  onSelect,
}: ActivityTypeModalProps) {
  function handleSelect(type: ActivityType) {
    onSelect(type);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Escolha o tipo de atividade</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.optionRow, value === 'run' && styles.optionRowActive]}
            onPress={() => handleSelect('run')}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="run" size={20} color="#111" />
              <Text style={styles.optionText}>Corrida / Caminhada</Text>
            </View>
            <View style={[styles.radio, value === 'run' && styles.radioSelected]}>
              {value === 'run' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionRow, value === 'ride' && styles.optionRowActive]}
            onPress={() => handleSelect('ride')}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="bike" size={20} color="#111" />
              <Text style={styles.optionText}>Pedal</Text>
            </View>
            <View style={[styles.radio, value === 'ride' && styles.radioSelected]}>
              {value === 'ride' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}