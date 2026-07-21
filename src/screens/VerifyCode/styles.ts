import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: colors.textPrimary,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  codeWrapper: {
    marginBottom: 16,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 28,
  },
  verifyButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: colors.disabledBg,
  },
  verifyText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.richBlack,
    letterSpacing: 0.5,
  },
  verifyTextDisabled: {
    color: colors.disabledText,
  },
});