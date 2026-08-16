import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './FilterModal.styles';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function FilterModal({
  visible,
  onClose,
  title,
  options,
  selected,
  onSelect,
}: FilterModalProps) {
  function handleSelect(value: string) {
    onSelect(value);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          {options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={styles.optionRow}
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{option.label}</Text>
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