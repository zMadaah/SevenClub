import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { BadgeWithStatus } from '../../../types/badge';
import { colors } from '../../../theme/colors';
import { styles } from './BadgeDetailModal.styles';

interface BadgeDetailModalProps {
  visible: boolean;
  onClose: () => void;
  badge: BadgeWithStatus | null;
  isFeatured: boolean;
  onSetFeatured: () => void;
}

export default function BadgeDetailModal({
  visible,
  onClose,
  badge,
  isFeatured,
  onSetFeatured,
}: BadgeDetailModalProps) {
  if (!badge) return null;

  const IconComponent = badge.iconLib === 'mci' ? MaterialCommunityIcons : Ionicons;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.card} activeOpacity={1} onPress={() => {}}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={22} color={colors.ceilingWhite} />
          </TouchableOpacity>

          <View style={[styles.iconCircle, !badge.unlocked && styles.iconCircleLocked]}>
            <IconComponent
              name={badge.icon as any}
              size={44}
              color={badge.unlocked ? colors.richBlack : colors.ceilingWhite}
            />
          </View>

          <Text style={styles.name}>{badge.name}</Text>

          <Text style={styles.status}>
            {badge.unlocked ? `Conquistada em ${badge.unlockedAtLabel}` : 'Ainda não conquistada'}
          </Text>

          <Text style={styles.description}>{badge.description}</Text>

          {badge.unlocked ? (
            <TouchableOpacity
              style={[styles.equipButton, isFeatured && styles.equipButtonActive]}
              onPress={onSetFeatured}
            >
              <Ionicons
                name={isFeatured ? 'checkmark' : 'image-outline'}
                size={16}
                color={isFeatured ? colors.richBlack : colors.ceilingWhite}
              />
              <Text style={[styles.equipButtonText, isFeatured && styles.equipButtonTextActive]}>
                {isFeatured ? 'USANDO NO PERFIL' : 'USAR NO PERFIL'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.lockedNotice}>
              <Ionicons name="lock-closed" size={14} color={colors.laurelLeaf} />
              <Text style={styles.lockedNoticeText}>Complete o desafio para desbloquear</Text>
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
