import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    backgroundColor: colors.backgroundDark,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCircleLocked: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  name: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.ceilingWhite,
    textAlign: 'center',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 14,
  },
  description: {
    fontSize: 13,
    color: colors.celeste,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 22,
  },
  equipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.ceilingWhite,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  equipButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  equipButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ceilingWhite,
    letterSpacing: 0.3,
  },
  equipButtonTextActive: {
    color: colors.richBlack,
  },
  lockedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lockedNoticeText: {
    fontSize: 12,
    color: colors.laurelLeaf,
    fontStyle: 'italic',
  },
});
