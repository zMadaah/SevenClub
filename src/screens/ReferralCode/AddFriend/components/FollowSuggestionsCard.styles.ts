import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  avatarSvg: {
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
    textAlign: 'center',
  },
  role: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 14,
    textAlign: 'center',
  },
  followButton: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: colors.backgroundAlt,
  },
  followButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.richBlack,
    letterSpacing: 0.5,
  },
  followingButtonText: {
    color: colors.textSecondary,
  },
});