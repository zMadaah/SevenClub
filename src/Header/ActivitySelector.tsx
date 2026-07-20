import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

export default function ActivitySelector({
    visible, selected, onClose, onSelect}: any) {

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
          backgroundColor: colors.backgroundDark,
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
          <Text style={{ color: colors.textSecondary, fontSize: 20, fontWeight: '700', }}>
            Escolha sua modalidade
          </Text>

          <TouchableOpacity onPress={onClose}>
            <Ionicons  name="close"  size={23} color={colors.textSecondary}/>
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
            borderTopWidth: 1,
            borderColor: colors.textSecondary,
          }}
        >
          <Text style={{ fontSize: 16, color: colors.textOnDark}}>
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
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: '#d2d3ce',
          }}
        >
          <Text style={{ fontSize: 16, color: colors.textOnDark}}>
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

        {/* Confirmar */}
        {/* <TouchableOpacity
          onPress={onClose}
          style={{
            marginTop: 30,
            height: 52,
            borderRadius: 16,
            backgroundColor: '#2E7D32',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#FFF',
              fontWeight: '700',
              fontSize: 16,
            }}
          >
            Confirmar
          </Text>
        </TouchableOpacity> */}
      </View>
    </Modal>
    )
}