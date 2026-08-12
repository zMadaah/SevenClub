import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { ActivityMode } from './types';

interface ActivitySelectorProps {
  visible: boolean;
  selected: ActivityMode;
  onClose: () => void;
  onSelect: (value: ActivityMode) => void;
}

export default function ActivitySelector({
  visible, selected, onClose, onSelect }: ActivitySelectorProps) {

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{
        margin: 0,
        justifyContent: 'flex-end',
      }}
    >
      <View
        style={{
          backgroundColor: colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 24,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700', }}>
            Escolha sua modalidade
          </Text>

          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={23} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Corrida */}
        <TouchableOpacity
          onPress={() => onSelect('running')}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 18,
            
          }}
        >
          <Text style={{ fontSize: 16, color: colors.textOnAccent }}>
            Corrida
          </Text>

          <Ionicons
            name={
              selected === 'running'
                ? 'radio-button-on'
                : 'radio-button-off'
            }
            size={24}
            color="#bcff00"
          />
        </TouchableOpacity>

        {/* Ciclismo */}
        <TouchableOpacity
          onPress={() => onSelect('cycling')}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 18,
            
          }}
        >
          <Text style={{ fontSize: 16, color: colors.textOnAccent }}>
            Ciclismo
          </Text>

          <Ionicons
            name={
              selected === 'cycling'
                ? 'radio-button-on'
                : 'radio-button-off'
            }
            size={24}
            color="#bcff00"
          />
        </TouchableOpacity>
      </View>
    </Modal>
  )
}