import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { UnitSystem } from '../../../types/preferences';
import { styles } from './UnitPreferenceModal.styles';

interface UnitPreferenceModalProps {
  visible: boolean;
  onClose: () => void;
  value: UnitSystem;
  onSave: (unit: UnitSystem) => void;
}

export default function UnitPreferenceModal({
  visible,
  onClose,
  value,
  onSave,
}: UnitPreferenceModalProps) {
  const [selected, setSelected] = useState<UnitSystem>(value);

  // sincroniza se o modal reabrir com um valor diferente do que ficou selecionado
  // na última vez (ex.: outro lugar do app mudou a preferência nesse meio tempo)
  useEffect(() => {
    if (visible) setSelected(value);
  }, [visible, value]);

  function handleDone() {
    onSave(selected);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.iconGlow}>
            <View style={styles.iconCircle}>
              <Ionicons name="pencil" size={20} color="#061414" />
            </View>
          </View>

          <Text style={styles.title}>preferência{'\n'}de unidade</Text>

          <Text style={styles.description}>
            Altere sua preferência de unidade para quilômetros e metros ou milhas e
            pés.
          </Text>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setSelected('metric')}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>Quilômetros e metros</Text>
            <View style={[styles.radio, selected === 'metric' && styles.radioSelected]}>
              {selected === 'metric' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setSelected('imperial')}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>Milhas e pés</Text>
            <View style={[styles.radio, selected === 'imperial' && styles.radioSelected]}>
              {selected === 'imperial' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneText}>CONCLUÍDO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}