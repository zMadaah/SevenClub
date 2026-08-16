import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../../../theme/colors';
import { styles } from './HelpModal.styles';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const ITEMS = [
  {
    icon: 'hand-left-outline' as const,
    lib: 'ionicons' as const,
    title: 'Desenhe arrastando o dedo',
    description: 'Toque em "Iniciar desenho" e arraste o dedo pelo mapa para traçar sua rota.',
  },
  {
    icon: 'shape-polygon-plus' as const,
    lib: 'mci' as const,
    title: 'Feche o loop para capturar',
    description: 'Se o traçado voltar perto do ponto inicial, a área interna vira território capturado.',
  },
  {
    icon: 'arrow-undo-outline' as const,
    lib: 'ionicons' as const,
    title: 'Desfazer, refazer e apagar',
    description: 'Use os botões no painel inferior para ajustar o traçado sem começar do zero.',
  },
  {
    icon: 'save-outline' as const,
    lib: 'ionicons' as const,
    title: 'Salvar tem limite gratuito',
    description: 'Cada rota salva consome um dos seus usos gratuitos — acompanhe o contador antes de salvar.',
  },
];

export default function HelpModal({ visible, onClose }: HelpModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Como funciona essa tela</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {ITEMS.map((item) => (
            <View key={item.title} style={styles.row}>
              <View style={styles.iconCircle}>
                {item.lib === 'ionicons' ? (
                  <Ionicons name={item.icon} size={18} color={colors.richBlack} />
                ) : (
                  <MaterialCommunityIcons name={item.icon} size={18} color={colors.richBlack} />
                )}
              </View>

              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowDescription}>{item.description}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.gotItButton} onPress={onClose}>
            <Text style={styles.gotItText}>ENTENDI</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}