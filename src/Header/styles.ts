import { StyleSheet } from 'react-native';

import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  // Safe Area
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },

  // Card do Header
  container: {
    marginHorizontal: 3,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: colors.backgroundDark,
  },

  // Primeira linha
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Avatar
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 16,
    resizeMode: 'cover',
  },

  // Grupo Crew | Duo | Solo
  categories: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 12,
  },

  category: {
    flex: 1,
    marginHorizontal: 4,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: colors.backgroundDark,
  },

  categoryActive: {
    backgroundColor: '#bcff00',
  },

  categoryText: {
    color: colors.textOnDark,
    fontSize: 10,
    fontWeight: '700',
  },

  categoryTextActive: {
    color: colors.textPrimary,
  },

  // Corrida / Pedal
  activityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundDark,
    marginRight: 8,
  },

  activityText: {
    color: colors.textOnDark,
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 4,
  },

  // Notificação
  notificationButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },

  territoryText: {
    color: colors.textOnDark,
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },

});