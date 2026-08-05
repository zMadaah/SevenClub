import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerFirst: {
    marginTop: -16,
  },
  avatarWrapper: {
    marginBottom: 6,
  },
  rankBadge: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeCrown: {
    backgroundColor: colors.accent,
  },
  rankBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  flag: {
    fontSize: 12,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    maxWidth: 80,
  },
  value: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  bar: {
    width: '80%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});