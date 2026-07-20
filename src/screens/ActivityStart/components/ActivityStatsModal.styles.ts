import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 100,
    backgroundColor: colors.backgroundDark,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  pausedBadge: {
    alignSelf: 'center',
    backgroundColor: colors.backgroundDark,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  pausedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#BCFF00',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: colors.textOnDark,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textOnDark,
  },
  statUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textOnDark,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.backgroundDark,
  },
});