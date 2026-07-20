import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './GenderPickerModal.styles';

const GENDER_OPTIONS = ['Feminino', 'Masculino', 'Outro', 'Prefiro não dizer'];

interface GenderPickerModalProps {
  visible: boolean;
  onClose: () => void;
  selected: string | null;
  onSelect: (gender: string) => void;
}

export default function GenderPickerModal({
  visible,
  onClose,
  selected,
  onSelect,
}: GenderPickerModalProps) {
  function handleSelect(gender: string) {
    onSelect(gender);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>Gênero</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          {GENDER_OPTIONS.map((option) => {
            const isSelected = selected === option;
            return (
              <TouchableOpacity
                key={option}
                style={styles.optionRow}
                onPress={() => handleSelect(option)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{option}</Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color="#1D9E75" />
                )}
              </TouchableOpacity>
            );
          })}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}