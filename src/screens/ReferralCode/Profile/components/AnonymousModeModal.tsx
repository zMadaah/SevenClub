import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../theme/colors';
import { styles } from './AnonymousModeModal.styles';

interface AnonymousModeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AnonymousModeModal({
  visible,
  onClose,
  onConfirm,
}: AnonymousModeModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={22} color={colors.ceilingWhite} />
          </TouchableOpacity>

          <View style={styles.iconGlow}>
            <View style={styles.iconCircle}>
              <Ionicons name="warning" size={26} color={colors.ceilingWhite} />
            </View>
          </View>

          <Text style={styles.title}>anônimo</Text>

          <Text style={styles.paragraph}>
            Ao ativar o modo anônimo, outros usuários não conseguem ver as
            informações do seu perfil a partir de territórios no modo Solo ou
            Crew. Além disso, eles não poderão ver suas atividades ou
            territórios pelo seu perfil.
          </Text>

          <Text style={styles.paragraph}>
            O modo anônimo <Text style={styles.bold}>não</Text> te esconde do
            feed — suas curtidas e comentários continuam visíveis, e qualquer
            coisa que você escolher mostrar na comunidade pode aparecer no
            feed para outros usuários.
          </Text>

          <TouchableOpacity style={styles.enableButton} onPress={onConfirm}>
            <Text style={styles.enableButtonText}>ATIVAR</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
