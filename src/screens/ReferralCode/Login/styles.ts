import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: colors.textPrimary,
    lineHeight: 36,
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
    borderRadius: 999,
    paddingVertical: 14,
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: colors.disabledBg,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.richBlack,
    letterSpacing: 0.5,
  },
  loginButtonTextDisabled: {
    color: colors.disabledText,
  },
  signUpRow: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  signUpTextBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
});