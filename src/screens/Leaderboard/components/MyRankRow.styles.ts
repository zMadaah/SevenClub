import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  divider: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: -14,
    zIndex: 1,
  },
  dividerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.richBlack,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.ceilingWhite,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accentGlow,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  rank: {
    width: 56,
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  flag: {
    fontSize: 14,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  value: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  unit: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
