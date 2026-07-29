import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  sheet: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  iconGlow: {
    alignSelf: 'center',
    backgroundColor: 'rgba(216, 90, 48, 0.15)',
    borderRadius: 40,
    padding: 14,
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    fontStyle: 'italic',
    color: colors.ceilingWhite,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 18,
  },
  paragraph: {
    fontSize: 13,
    color: colors.celeste,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  bold: {
    fontWeight: '800',
    color: colors.ceilingWhite,
  },
  enableButton: {
    backgroundColor: colors.ceilingWhite,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
  },
  enableButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.richBlack,
    letterSpacing: 0.5,
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ceilingWhite,
  },
});
