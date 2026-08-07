import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rank: {
    width: 32,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  flag: {
    fontSize: 14,
  },
  medal: {
    marginLeft: -2,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  unit: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
